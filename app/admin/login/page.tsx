'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Admin login failed');
            }

            // Store admin data in localStorage
            localStorage.setItem('admin', JSON.stringify(data.admin));

            // Redirect to admin dashboard
            router.push('/admin/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-black dark:to-indigo-950 px-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8 animate-fade-in">
                    <Link href="/">
                        <h1 className="text-4xl font-bold gradient-text cursor-pointer">FoodieGo</h1>
                    </Link>
                    <div className="mt-4 inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                        <p className="text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-2">
                            <span className="text-2xl">👨‍💼</span>
                            Admin Access
                        </p>
                    </div>
                </div>

                {/* Login Form */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 border-purple-200 dark:border-purple-800 animate-scale-in">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Admin Login</h2>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Admin Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="admin@foodieorder.com"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold btn-hover-lift disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? 'Logging in...' : 'Login as Admin'}
                        </button>
                    </form>

                    {/* Security Notice */}
                    <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <p className="text-xs text-purple-600 dark:text-purple-400 text-center">
                            🔒 This is a secure admin area. Unauthorized access is prohibited.
                        </p>
                    </div>
                </div>

                {/* Back Links */}
                <div className="text-center mt-6 space-y-2">
                    <Link href="/login" className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        User Login →
                    </Link>
                    <Link href="/" className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
