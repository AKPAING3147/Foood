'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Category {
    id: string;
    name: string;
    _count?: { products: number };
}

export default function AdminCategoriesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState<any>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const adminData = localStorage.getItem('admin');
        if (!adminData) {
            router.push('/admin/login');
            return;
        }
        setAdmin(JSON.parse(adminData));
        fetchCategories();
    }, [router]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            const data = await response.json();
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newCategoryName }),
            });

            if (!response.ok) throw new Error('Failed to create category');

            alert('Category created successfully!');
            setNewCategoryName('');
            setShowAddForm(false);
            fetchCategories();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setSubmitting(false);
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
                                <Link href="/admin/products" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors">
                                    Products
                                </Link>
                                <Link href="/admin/orders" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors">
                                    Orders
                                </Link>
                                <Link href="/admin/categories" className="text-purple-600 dark:text-purple-400 font-medium">
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
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-bold gradient-text mb-2">Categories</h1>
                            <p className="text-gray-600 dark:text-gray-400">Manage product categories</p>
                        </div>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold btn-hover-lift"
                        >
                            {showAddForm ? 'Cancel' : '+ Add Category'}
                        </button>
                    </div>

                    {/* Add Category Form */}
                    {showAddForm && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 animate-scale-in">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Category</h2>
                            <form onSubmit={handleAddCategory} className="flex gap-4">
                                <input
                                    type="text"
                                    required
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="Category name (e.g., Burgers, Pizza, Drinks)"
                                />
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold btn-hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Adding...' : 'Add'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Categories List */}
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-8xl mb-6">📂</div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                No categories yet
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">
                                Create your first category to organize products
                            </p>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="inline-block px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold btn-hover-lift"
                            >
                                Add Category
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                                {category.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {category._count?.products || 0} products
                                            </p>
                                        </div>
                                        <div className="text-4xl">📂</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                            💡 Category Management Tips
                        </h3>
                        <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                            <li>• Categories help organize your menu for customers</li>
                            <li>• Create clear, descriptive category names</li>
                            <li>• Common categories: Burgers, Pizza, Salads, Drinks, Desserts</li>
                            <li>• You can assign products to categories when adding/editing them</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
