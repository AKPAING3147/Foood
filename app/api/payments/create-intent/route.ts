import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json(
                { error: 'Order ID is required' },
                { status: 400 }
            );
        }

        // Get order details
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Create Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(order.totalAmount * 100), // Convert to cents
            currency: 'usd',
            metadata: {
                orderId: order.id,
            },
        });

        // Create or update payment record
        await prisma.payment.upsert({
            where: { orderId: order.id },
            create: {
                orderId: order.id,
                amount: order.totalAmount,
                paymentMethod: 'STRIPE',
                stripePaymentId: paymentIntent.id,
                status: 'PENDING',
            },
            update: {
                stripePaymentId: paymentIntent.id,
                status: 'PENDING',
            },
        });

        return NextResponse.json(
            {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Create payment intent error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
