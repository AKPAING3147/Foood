import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('stripe-signature')!;

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err) {
            console.error('Webhook signature verification failed:', err);
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent;

                // Update payment and order status
                const payment = await prisma.payment.findFirst({
                    where: { stripePaymentId: paymentIntent.id },
                });

                if (payment) {
                    await prisma.payment.update({
                        where: { id: payment.id },
                        data: { status: 'COMPLETED' },
                    });

                    await prisma.order.update({
                        where: { id: payment.orderId },
                        data: {
                            paymentStatus: 'COMPLETED',
                            status: 'CONFIRMED',
                        },
                    });
                }
                break;

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object as Stripe.PaymentIntent;

                const failedPaymentRecord = await prisma.payment.findFirst({
                    where: { stripePaymentId: failedPayment.id },
                });

                if (failedPaymentRecord) {
                    await prisma.payment.update({
                        where: { id: failedPaymentRecord.id },
                        data: { status: 'FAILED' },
                    });

                    await prisma.order.update({
                        where: { id: failedPaymentRecord.orderId },
                        data: { paymentStatus: 'FAILED' },
                    });
                }
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}
