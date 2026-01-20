import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all orders (for admin) or user's orders
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const status = searchParams.get('status');

        const whereClause: any = {};

        if (userId) {
            whereClause.userId = userId;
        }

        if (status) {
            whereClause.status = status;
        }

        const orders = await prisma.order.findMany({
            where: whereClause,
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
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ orders }, { status: 200 });
    } catch (error) {
        console.error('Get orders error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST create new order
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, items, paymentMethod, deliveryAddress, phone, notes } = body;

        // Validate input
        if (!userId || !items || items.length === 0 || !paymentMethod || !deliveryAddress || !phone) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Calculate total amount
        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
            });

            if (!product) {
                return NextResponse.json(
                    { error: `Product ${item.productId} not found` },
                    { status: 404 }
                );
            }

            if (!product.available) {
                return NextResponse.json(
                    { error: `Product ${product.name} is not available` },
                    { status: 400 }
                );
            }

            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            orderItemsData.push({
                productId: product.id,
                quantity: item.quantity,
                price: product.price,
            });
        }

        // Create order with order items
        const order = await prisma.order.create({
            data: {
                userId,
                paymentMethod,
                totalAmount,
                deliveryAddress,
                phone,
                notes: notes || null,
                orderItems: {
                    create: orderItemsData,
                },
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                payment: true,
            },
        });

        return NextResponse.json(
            { message: 'Order created successfully', order },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create order error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
