'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    deliveryAddress: string;
    phone: string;
    createdAt: string;
    user: { name: string; email: string };
    items: any[];
}

export default function AdminOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState<any>(null);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        const adminData = localStorage.getItem('admin');
        if (!adminData) {
            router.push('/admin/login');
            return;
        }
        setAdmin(JSON.parse(adminData));
        fetchOrders();
    }, [router]);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders');
            const data = await response.json();
            setOrders(data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update order');

            toast.success('Order status updated successfully!');
            fetchOrders();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const cancelOrder = async (orderId: string) => {
        if (!confirm('Are you sure you want to cancel this order?')) return;

        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to cancel order');

            toast.success('Order cancelled successfully!');
            fetchOrders();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin');
        router.push('/admin/login');
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            PREPARING: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
            READY: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            DELIVERED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
            CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        };
        return colors[status] || colors.PENDING;
    };

    const filteredOrders = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

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
                                <Link href="/admin/orders" className="text-purple-600 dark:text-purple-400 font-medium">
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
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold gradient-text mb-2">Orders Management</h1>
                        <p className="text-gray-600 dark:text-gray-400">View and manage customer orders</p>
                    </div>

                    {/* Filter Buttons */}
                    <div className="mb-6 flex flex-wrap gap-2">
                        {['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === status
                                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-600 dark:text-gray-400 text-lg">No orders found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredOrders.map((order) => (
                                <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-lg font-bold">Order #{order.orderNumber}</h3>
                                                <p className="text-sm text-purple-100">
                                                    {order.user.name} ({order.user.email})
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold">${order.totalAmount.toFixed(2)}</div>
                                                <div className="text-sm text-purple-100">{order.paymentMethod}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Payment Status</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{order.paymentStatus}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{order.phone}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Order Date</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {new Date(order.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Delivery Address</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{order.deliveryAddress}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-4">
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'CONFIRMED')}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                                                className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-semibold hover:bg-purple-600 transition-colors"
                                            >
                                                Preparing
                                            </button>
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'READY')}
                                                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors"
                                            >
                                                Ready
                                            </button>
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                                                className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-semibold hover:bg-gray-600 transition-colors"
                                            >
                                                Delivered
                                            </button>
                                            <button
                                                onClick={() => cancelOrder(order.id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                                            >
                                                Cancel
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
