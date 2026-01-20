import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all products
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');

        const products = await prisma.product.findMany({
            where: categoryId ? { categoryId } : {},
            include: {
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ products }, { status: 200 });
    } catch (error) {
        console.error('Get products error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST create new product
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, price, image, categoryId, available } = body;

        // Validate input
        if (!name || !price || !categoryId) {
            return NextResponse.json(
                { error: 'Name, price, and category are required' },
                { status: 400 }
            );
        }

        // Create product
        const product = await prisma.product.create({
            data: {
                name,
                description: description || null,
                price: parseFloat(price),
                image: image || null,
                categoryId,
                available: available !== undefined ? available : true,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(
            { message: 'Product created successfully', product },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create product error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
