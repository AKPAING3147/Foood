'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category?: { name: string };
}

export default function AdminProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState<any>(null);

    useEffect(() => {
        const adminData = localStorage.getItem('admin');
        if (!adminData) {
            router.push('/admin/login');
            return;
        }
        setAdmin(JSON.parse(adminData));
        fetchProducts();
    }, [router]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete product');
            }

            toast.success('Product deleted successfully!');
            fetchProducts();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin');
        router.push('/admin/login');
    };

    if (!admin) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-black dark:to-indigo-950">
            {/* Admin Navbar */}
            <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-8">
                            <Link href="/admin/dashboard" className="text-2xl font-bold gradient-text">
                                👨‍💼 Admin Panel
                            </Link>
                            <div className="hidden md:flex items-center space-x-6">
                                <Link href="/admin/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors">
                                    Dashboard
                                </Link>
                                <Link href="/admin/products" className="text-purple-600 dark:text-purple-400 font-medium">
                                    Products
                                </Link>
                                <Link href="/admin/orders" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors">
                                    Orders
                                </Link>
                                <Link href="/admin/categories" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors">
                                    Categories
                                </Link>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-bold gradient-text mb-2">Products</h1>
                            <p className="text-gray-600 dark:text-gray-400">Manage your menu items</p>
                        </div>
                        <Link
                            href="/admin/products/new"
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold btn-hover-lift"
                        >
                            + Add Product
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">No products yet</p>
                            <Link href="/admin/products/new" className="text-purple-600 hover:text-purple-700 font-semibold">
                                Add your first product →
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                                    <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-6xl">🍽️</div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                                            {product.description || 'No description'}
                                        </p>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-2xl font-bold text-purple-600">${product.price.toFixed(2)}</span>
                                            {product.category && (
                                                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-semibold">
                                                    {product.category.name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-center font-semibold hover:bg-blue-600 transition-colors text-sm"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
