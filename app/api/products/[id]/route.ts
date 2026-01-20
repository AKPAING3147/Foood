import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single product
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: params.id },
            include: {
                category: true,
            },
        });

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ product }, { status: 200 });
    } catch (error) {
        console.error('Get product error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT update product
export async function PUT(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const body = await request.json();
        const { name, description, price, image, categoryId, available } = body;

        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id: params.id },
        });

        if (!existingProduct) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Update product
        const product = await prisma.product.update({
            where: { id: params.id },
            data: {
                name: name || existingProduct.name,
                description: description !== undefined ? description : existingProduct.description,
                price: price !== undefined ? parseFloat(price) : existingProduct.price,
                image: image !== undefined ? image : existingProduct.image,
                categoryId: categoryId || existingProduct.categoryId,
                available: available !== undefined ? available : existingProduct.available,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(
            { message: 'Product updated successfully', product },
            { status: 200 }
        );
    } catch (error) {
        console.error('Update product error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE product
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id: params.id },
        });

        if (!existingProduct) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Delete product
        await prisma.product.delete({
            where: { id: params.id },
        });

        return NextResponse.json(
            { message: 'Product deleted successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Delete product error:', error);
        if (error.code === 'P2003') {
            return NextResponse.json(
                { error: 'Cannot delete product because it is part of existing orders.' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
