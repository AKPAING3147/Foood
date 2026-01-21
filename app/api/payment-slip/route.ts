import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const orderId = formData.get('orderId') as string;
        const bankAccountNumber = formData.get('bankAccountNumber') as string;
        const bankAccountName = formData.get('bankAccountName') as string;

        console.log('Payment slip upload - orderId:', orderId);

        if (!file || !orderId) {
            console.error('Missing required fields - file:', !!file, 'orderId:', orderId);
            return NextResponse.json(
                { error: 'File and Order ID are required' },
                { status: 400 }
            );
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const dataURI = `data:${file.type};base64,${base64}`;

        // Upload payment slip to Cloudinary
        console.log('Uploading to Cloudinary...');
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'foodie-order/payment-slips',
            resource_type: 'auto',
        });
        console.log('Cloudinary upload successful:', result.secure_url);

        // Get the order to find payment info
        console.log('Finding order with ID:', orderId);
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { payment: true },
        });

        if (!order) {
            console.error('Order not found with ID:', orderId);
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        console.log('Order found, upserting payment...');
        // Update or create payment record with slip URL and bank details
        const payment = await prisma.payment.upsert({
            where: { orderId },
            update: {
                paymentSlipUrl: result.secure_url,
                bankAccountNumber: bankAccountNumber || null,
                bankAccountName: bankAccountName || null,
                status: 'PENDING', // Keep as pending until admin confirms
            },
            create: {
                orderId,
                amount: order.totalAmount,
                paymentMethod: order.paymentMethod,
                paymentSlipUrl: result.secure_url,
                bankAccountNumber: bankAccountNumber || null,
                bankAccountName: bankAccountName || null,
                status: 'PENDING',
            },
        });

        console.log('Payment slip uploaded successfully for order:', orderId);
        return NextResponse.json(
            {
                message: 'Payment slip uploaded successfully',
                payment,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Payment slip upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload payment slip', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

// GET endpoint to retrieve payment slip
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('orderId');

        if (!orderId) {
            return NextResponse.json(
                { error: 'Order ID is required' },
                { status: 400 }
            );
        }

        const payment = await prisma.payment.findUnique({
            where: { orderId },
        });

        if (!payment) {
            return NextResponse.json(
                { error: 'Payment not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(payment, { status: 200 });
    } catch (error) {
        console.error('Error fetching payment slip:', error);
        return NextResponse.json(
            { error: 'Failed to fetch payment slip' },
            { status: 500 }
        );
    }
}
