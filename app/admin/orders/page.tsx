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
    payment?: {
        paymentSlipUrl?: string;
        bankAccountNumber?: string;
        bankAccountName?: string;
    };
}

export default function AdminOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState<any>(null);
    const [filter, setFilter] = useState('ALL');
    const [selectedPaymentSlip, setSelectedPaymentSlip] = useState<string | null>(null);
    const [showPaymentSlipModal, setShowPaymentSlipModal] = useState(false);

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

    const viewPaymentSlip = (paymentSlipUrl: string) => {
        setSelectedPaymentSlip(paymentSlipUrl);
        setShowPaymentSlipModal(true);
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

                                            {/* Payment Slip Info for Bank Transfer */}
                                            {order.paymentMethod === 'BANK_TRANSFER' && order.payment && (
                                                <div className="md:col-span-2 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                                                            <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            Bank Transfer Details
                                                        </h4>
                                                        {order.payment.paymentSlipUrl && (
                                                            <button
                                                                onClick={() => viewPaymentSlip(order.payment!.paymentSlipUrl!)}
                                                                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors flex items-center"
                                                            >
                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                                View Payment Slip
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                                        {order.payment.bankAccountName && (
                                                            <div>
                                                                <p className="text-gray-600 dark:text-gray-400">Account Name</p>
                                                                <p className="font-semibold text-gray-900 dark:text-white">{order.payment.bankAccountName}</p>
                                                            </div>
                                                        )}
                                                        {order.payment.bankAccountNumber && (
                                                            <div>
                                                                <p className="text-gray-600 dark:text-gray-400">Account Number</p>
                                                                <p className="font-semibold text-gray-900 dark:text-white">{order.payment.bankAccountNumber}</p>
                                                            </div>
                                                        )}
                                                        {!order.payment.paymentSlipUrl && (
                                                            <div className="col-span-2">
                                                                <p className="text-orange-600 dark:text-orange-400 font-medium">⚠️ Payment slip not uploaded yet</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
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

            {/* Payment Slip Modal */}
            {showPaymentSlipModal && selectedPaymentSlip && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowPaymentSlipModal(false)}
                >
                    <div
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 p-4 flex justify-between items-center rounded-t-2xl">
                            <h3 className="text-xl font-bold text-white flex items-center">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Payment Slip
                            </h3>
                            <button
                                onClick={() => setShowPaymentSlipModal(false)}
                                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <img
                                src={selectedPaymentSlip}
                                alt="Payment Slip"
                                className="w-full h-auto rounded-lg shadow-lg"
                            />
                            <div className="mt-4 flex justify-end">
                                <a
                                    href={selectedPaymentSlip}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download Full Size
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
