'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import Navbar from '../components/Navbar';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, totalPrice, clearCart } = useCart();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'COD' | 'STRIPE'>('COD');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/login?redirect=/checkout');
            return;
        }
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setDeliveryAddress(parsedUser.address || '');
        setPhone(parsedUser.phone || '');
    }, [router]);

    useEffect(() => {
        if (cart.length === 0) {
            router.push('/menu');
        }
    }, [cart, router]);

    const handlePlaceOrder = async () => {
        if (!deliveryAddress || !phone) {
            alert('Please fill in all required fields');
            return;
        }

        setLoading(true);

        try {
            // Create order
            const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    items: cart.map(item => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                    totalAmount: totalPrice + 5, // Including delivery fee
                    deliveryAddress,
                    phone,
                    notes,
                    paymentMethod,
                }),
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create order');
            }

            const order = await orderResponse.json();

            if (paymentMethod === 'STRIPE') {
                // Simulate payment processing delay "for show"
                await new Promise(resolve => setTimeout(resolve, 1500));

                // For demonstration, we just treat it as successful
                // No actual Stripe API call is made
            }

            // Clear cart and redirect to orders page
            clearCart();
            alert('Order placed successfully!');
            router.push('/orders');
        } catch (error: any) {
            console.error('Error placing order:', error);
            alert(error.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (!user || cart.length === 0) {
        return null;
    }

    const deliveryFee = 5;
    const total = totalPrice + deliveryFee;

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-purple-950">
            <Navbar />

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 animate-fade-in">
                        <h1 className="text-4xl font-bold gradient-text mb-2">Checkout</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Complete your order
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Delivery Information */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    Delivery Information
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                            placeholder="+1 (555) 123-4567"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Delivery Address *
                                        </label>
                                        <textarea
                                            value={deliveryAddress}
                                            onChange={(e) => setDeliveryAddress(e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                            placeholder="123 Main St, City, State 12345"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Order Notes (Optional)
                                        </label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            rows={2}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                            placeholder="Any special instructions?"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    Payment Method
                                </h2>

                                <div className="space-y-3">
                                    <label className="flex items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="COD"
                                            checked={paymentMethod === 'COD'}
                                            onChange={() => setPaymentMethod('COD')}
                                            className="w-5 h-5 text-orange-500 focus:ring-orange-500"
                                        />
                                        <div className="ml-4">
                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                Cash on Delivery
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                Pay when you receive your order
                                            </div>
                                        </div>
                                    </label>

                                    <label className="flex items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="STRIPE"
                                            checked={paymentMethod === 'STRIPE'}
                                            onChange={() => setPaymentMethod('STRIPE')}
                                            className="w-5 h-5 text-orange-500 focus:ring-orange-500"
                                        />
                                        <div className="ml-4">
                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                Credit/Debit Card
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                Pay securely with Card
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    Order Summary
                                </h2>

                                {/* Items */}
                                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {item.name} x{item.quantity}
                                            </span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Subtotal</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Delivery Fee</span>
                                        <span>${deliveryFee.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-3">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                    className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold btn-hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Placing Order...' : 'Place Order'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
