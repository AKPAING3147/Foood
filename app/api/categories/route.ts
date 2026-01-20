import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all categories
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });

        return NextResponse.json({ categories }, { status: 200 });
    } catch (error) {
        console.error('Get categories error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST create new category
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, image } = body;

        // Validate input
        if (!name) {
            return NextResponse.json(
                { error: 'Name is required' },
                { status: 400 }
            );
        }

        // Check if category already exists
        const existingCategory = await prisma.category.findUnique({
            where: { name },
        });

        if (existingCategory) {
            return NextResponse.json(
                { error: 'Category with this name already exists' },
                { status: 400 }
            );
        }

        // Create category
        const category = await prisma.category.create({
            data: {
                name,
                description: description || null,
                image: image || null,
            },
        });

        return NextResponse.json(
            { message: 'Category created successfully', category },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create category error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
