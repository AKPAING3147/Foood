import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single order
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const order = await prisma.order.findUnique({
            where: { id: params.id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                payment: true,
            },
        });

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ order }, { status: 200 });
    } catch (error) {
        console.error('Get order error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT update order status
export async function PUT(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const body = await request.json();
        const { status, paymentStatus } = body;

        // Check if order exists
        const existingOrder = await prisma.order.findUnique({
            where: { id: params.id },
        });

        if (!existingOrder) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Update order
        const order = await prisma.order.update({
            where: { id: params.id },
            data: {
                status: status || existingOrder.status,
                paymentStatus: paymentStatus || existingOrder.paymentStatus,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                payment: true,
            },
        });

        return NextResponse.json(
            { message: 'Order updated successfully', order },
            { status: 200 }
        );
    } catch (error) {
        console.error('Update order error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE cancel order
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        // Check if order exists
        const existingOrder = await prisma.order.findUnique({
            where: { id: params.id },
        });

        if (!existingOrder) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Update order status to CANCELLED instead of deleting
        const order = await prisma.order.update({
            where: { id: params.id },
            data: {
                status: 'CANCELLED',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                payment: true,
            },
        });

        return NextResponse.json(
            { message: 'Order cancelled successfully', order },
            { status: 200 }
        );
    } catch (error) {
        console.error('Cancel order error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
