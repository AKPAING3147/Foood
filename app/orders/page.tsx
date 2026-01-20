'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: {
        name: string;
        image: string;
    };
}

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    deliveryAddress: string;
    phone: string;
    notes?: string;
    createdAt: string;
    items: OrderItem[];
}

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/login?redirect=/orders');
            return;
        }
        setUser(JSON.parse(userData));
        fetchOrders();
    }, [router]);

    const fetchOrders = async () => {
        try {
            const userData = localStorage.getItem('user');
            if (!userData) return;

            const user = JSON.parse(userData);
            const response = await fetch(`/api/orders?userId=${user.id}`);

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            setOrders(data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
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

    const getPaymentStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            PENDING: 'text-yellow-600 dark:text-yellow-400',
            COMPLETED: 'text-green-600 dark:text-green-400',
            FAILED: 'text-red-600 dark:text-red-400',
            REFUNDED: 'text-gray-600 dark:text-gray-400',
        };
        return colors[status] || colors.PENDING;
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-purple-950">
            <Navbar />

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 animate-fade-in">
                        <h1 className="text-4xl font-bold gradient-text mb-2">My Orders</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Track and manage your orders
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-8xl mb-6">📦</div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                No orders yet
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">
                                Start ordering delicious food!
                            </p>
                            <button
                                onClick={() => router.push('/menu')}
                                className="inline-block px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold btn-hover-lift"
                            >
                                Browse Menu
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden animate-scale-in"
                                >
                                    {/* Order Header */}
                                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold mb-1">
                                                    Order #{order.orderNumber}
                                                </h3>
                                                <p className="text-orange-100 text-sm">
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold">
                                                    ${order.totalAmount.toFixed(2)}
                                                </div>
                                                <div className="text-sm text-orange-100">
                                                    {order.paymentMethod}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Body */}
                                    <div className="p-6">
                                        {/* Status */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className={`text-sm font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                                                Payment: {order.paymentStatus}
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div className="space-y-3 mb-6">
                                            {(order.items || order.orderItems || []).map((item) => (
                                                <div key={item.id} className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
                                                        {item.product.image ? (
                                                            <img
                                                                src={item.product.image}
                                                                alt={item.product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-2xl">
                                                                🍽️
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                                            {item.product.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Quantity: {item.quantity}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900 dark:text-white">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Delivery Info */}
                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-600 dark:text-gray-400">Delivery Address:</span>
                                                    <p className="text-gray-900 dark:text-white font-medium">
                                                        {order.deliveryAddress}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                                                    <p className="text-gray-900 dark:text-white font-medium">
                                                        {order.phone}
                                                    </p>
                                                </div>
                                                {order.notes && (
                                                    <div className="md:col-span-2">
                                                        <span className="text-gray-600 dark:text-gray-400">Notes:</span>
                                                        <p className="text-gray-900 dark:text-white font-medium">
                                                            {order.notes}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
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
