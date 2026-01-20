'use client';

import { useCart } from '@/lib/CartContext';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleCheckout = () => {
        if (!user) {
            router.push('/login?redirect=/checkout');
            return;
        }
        router.push('/checkout');
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-purple-950">
                <Navbar />
                <div className="pt-24 pb-12 px-4">
                    <div className="max-w-4xl mx-auto text-center py-20">
                        <div className="text-8xl mb-6">🛒</div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Add some delicious items to get started!
                        </p>
                        <Link
                            href="/menu"
                            className="inline-block px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold btn-hover-lift"
                        >
                            Browse Menu
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-purple-950">
            <Navbar />

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 animate-fade-in">
                        <h1 className="text-4xl font-bold gradient-text mb-2">Shopping Cart</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-scale-in"
                                >
                                    <div className="flex items-center gap-6">
                                        {/* Product Image */}
                                        <div className="w-24 h-24 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-4xl">
                                                    🍽️
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-grow">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                                {item.name}
                                            </h3>
                                            <p className="text-orange-500 font-semibold">
                                                ${item.price.toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors flex items-center justify-center"
                                            >
                                                −
                                            </button>
                                            <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors flex items-center justify-center"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Item Total */}
                                        <div className="text-right min-w-[100px]">
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 hover:text-red-600 transition-colors"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Clear Cart Button */}
                            <button
                                onClick={clearCart}
                                className="w-full px-4 py-3 text-red-500 hover:text-red-600 font-medium transition-colors"
                            >
                                Clear Cart
                            </button>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    Order Summary
                                </h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Subtotal</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Delivery Fee</span>
                                        <span>$5.00</span>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                                            <span>Total</span>
                                            <span>${(totalPrice + 5).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold btn-hover-lift mb-4"
                                >
                                    Proceed to Checkout
                                </button>

                                <Link
                                    href="/menu"
                                    className="block w-full px-6 py-4 text-center border-2 border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
