'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Stats {
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalUsers: number;
}

export default function AdminDashboardPage() {
    const router = useRouter();
    const [admin, setAdmin] = useState<any>(null);
    const [stats, setStats] = useState<Stats>({
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalUsers: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const adminData = localStorage.getItem('admin');
        if (!adminData) {
            router.push('/admin/login');
            return;
        }
        setAdmin(JSON.parse(adminData));
        fetchStats();
    }, [router]);

    const fetchStats = async () => {
        try {
            const [ordersRes, productsRes] = await Promise.all([
                fetch('/api/orders'),
                fetch('/api/products'),
            ]);

            const ordersData = await ordersRes.json();
            const productsData = await productsRes.json();

            const orders = ordersData.orders || [];
            const products = productsData.products || [];

            const pendingOrders = orders.filter((o: any) => o.status === 'PENDING').length;
            const totalRevenue = orders.reduce((sum: number, o: any) => sum + o.totalAmount, 0);

            setStats({
                totalOrders: orders.length,
                pendingOrders,
                totalRevenue,
                totalProducts: products.length,
                totalUsers: 0, // Would need a users API endpoint
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin');
        router.push('/admin/login');
    };

    if (!admin) {
        return null;
    }

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
                                <Link href="/admin/dashboard" className="text-purple-600 dark:text-purple-400 font-medium">
                                    Dashboard
                                </Link>
                                <Link href="/admin/products" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors">
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
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                {admin.name || admin.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Welcome back, {admin.name || 'Admin'}!
                        </p>
                    </div>

                    {/* Stats Grid */}
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {/* Total Orders */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Orders</p>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                                {stats.totalOrders}
                                            </p>
                                        </div>
                                        <div className="text-4xl">📦</div>
                                    </div>
                                </div>

                                {/* Pending Orders */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending Orders</p>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                                {stats.pendingOrders}
                                            </p>
                                        </div>
                                        <div className="text-4xl">⏳</div>
                                    </div>
                                </div>

                                {/* Total Revenue */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                                ${stats.totalRevenue.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="text-4xl">💰</div>
                                    </div>
                                </div>

                                {/* Total Products */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Products</p>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                                {stats.totalProducts}
                                            </p>
                                        </div>
                                        <div className="text-4xl">🍔</div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Link
                                        href="/admin/products/new"
                                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                                    >
                                        <span className="text-3xl">➕</span>
                                        <div>
                                            <p className="font-semibold">Add Product</p>
                                            <p className="text-sm text-purple-100">Create new menu item</p>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/admin/orders"
                                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                                    >
                                        <span className="text-3xl">📋</span>
                                        <div>
                                            <p className="font-semibold">Manage Orders</p>
                                            <p className="text-sm text-blue-100">View and update orders</p>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/admin/categories"
                                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all"
                                    >
                                        <span className="text-3xl">📂</span>
                                        <div>
                                            <p className="font-semibold">Categories</p>
                                            <p className="text-sm text-orange-100">Manage categories</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            {/* Info Card */}
                            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
                                <h2 className="text-2xl font-bold mb-4">Welcome to FoodieGo Admin</h2>
                                <p className="text-purple-100 mb-6">
                                    Manage your food ordering platform efficiently. Add products, process orders, and track your business growth.
                                </p>
                                <Link
                                    href="/"
                                    className="inline-block px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                                >
                                    View Customer Site →
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
