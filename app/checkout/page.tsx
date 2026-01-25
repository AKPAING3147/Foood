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
    const [paymentMethod, setPaymentMethod] = useState<'COD' | 'STRIPE' | 'BANK_TRANSFER'>('COD');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [paymentSlip, setPaymentSlip] = useState<File | null>(null);
    const [paymentSlipPreview, setPaymentSlipPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

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

    const handlePaymentSlipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPaymentSlip(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPaymentSlipPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePlaceOrder = async () => {
        if (!deliveryAddress || !phone) {
            alert('Please fill in all required fields');
            return;
        }

        if (paymentMethod === 'BANK_TRANSFER' && !paymentSlip) {
            alert('Please upload your payment slip for bank transfer');
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
            console.log('Order response:', order);
            console.log('Order ID:', order.order?.id || order.id);

            // Handle payment based on method
            if (paymentMethod === 'STRIPE') {
                // Simulate payment processing delay "for show"
                await new Promise(resolve => setTimeout(resolve, 1500));
                // For demonstration, we just treat it as successful
                // No actual Stripe API call is made
            } else if (paymentMethod === 'BANK_TRANSFER' && paymentSlip) {
                // Upload payment slip
                setUploading(true);
                const formData = new FormData();
                formData.append('file', paymentSlip);
                const actualOrderId = order.order?.id || order.id;
                console.log('Uploading payment slip for order ID:', actualOrderId);
                formData.append('orderId', actualOrderId);
                formData.append('bankAccountNumber', 'Admin Bank Account');
                formData.append('bankAccountName', 'FoodieGo Admin');

                const uploadResponse = await fetch('/api/payment-slip', {
                    method: 'POST',
                    body: formData,
                });

                console.log('Upload response status:', uploadResponse.status);
                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    console.error('Upload error:', errorData);
                    throw new Error(errorData.error || 'Failed to upload payment slip');
                }

                setUploading(false);
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
            setUploading(false);
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

                                    <label className="flex items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="BANK_TRANSFER"
                                            checked={paymentMethod === 'BANK_TRANSFER'}
                                            onChange={() => setPaymentMethod('BANK_TRANSFER')}
                                            className="w-5 h-5 text-orange-500 focus:ring-orange-500"
                                        />
                                        <div className="ml-4">
                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                Bank Transfer
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                Transfer to our bank account
                                            </div>
                                        </div>
                                    </label>
                                </div>

                                {/* Bank Transfer Details */}
                                {paymentMethod === 'BANK_TRANSFER' && (
                                    <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            Bank Account Details
                                        </h3>
                                        <div className="flex justify-center mb-4">
                                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                                <img
                                                    src="/payment-qr.png"
                                                    alt="Payment QR Code"
                                                    className="w-48 h-48 object-contain"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Account Name:</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">FoodieGo Admin</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Account Number:</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">1234567890</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Bank Name:</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">ABC Bank</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                                                <span className="font-bold text-lg text-orange-600 dark:text-orange-400">${(totalPrice + 5).toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-orange-200 dark:border-orange-800">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Upload Payment Slip *
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePaymentSlipChange}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 transition-all"
                                            />
                                            {paymentSlipPreview && (
                                                <div className="mt-3">
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                                                    <img
                                                        src={paymentSlipPreview}
                                                        alt="Payment slip preview"
                                                        className="max-w-full h-40 object-contain rounded-lg border border-gray-300 dark:border-gray-600"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
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
                                    disabled={loading || uploading}
                                    className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold btn-hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploading ? 'Uploading Payment Slip...' : loading ? 'Placing Order...' : 'Place Order'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
