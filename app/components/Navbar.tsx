'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { totalItems } = useCart();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
    };

    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold gradient-text">🍕 FoodieGo</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/menu"
                            className={`text-sm font-medium transition-colors ${pathname === '/menu'
                                ? 'text-orange-500'
                                : 'text-gray-700 dark:text-gray-300 hover:text-orange-500'
                                }`}
                        >
                            Menu
                        </Link>

                        {user && (
                            <>
                                <Link
                                    href="/orders"
                                    className={`text-sm font-medium transition-colors ${pathname === '/orders'
                                        ? 'text-orange-500'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-orange-500'
                                        }`}
                                >
                                    My Orders
                                </Link>
                                <Link
                                    href="/profile"
                                    className={`text-sm font-medium transition-colors ${pathname === '/profile'
                                        ? 'text-orange-500'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-orange-500'
                                        }`}
                                >
                                    Profile
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Cart */}
                        <Link
                            href="/cart"
                            className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* User Actions */}
                        {user ? (
                            <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    Hi, {user.name?.split(' ')[0]}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg btn-hover-lift"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
