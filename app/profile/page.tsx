'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/login?redirect=/profile');
            return;
        }
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFormData({
            name: parsedUser.name || '',
            email: parsedUser.email || '',
            phone: parsedUser.phone || '',
            address: parsedUser.address || '',
        });
    }, [router]);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            // In a real app, you would call an API to update the user
            // For now, we'll just update localStorage
            const updatedUser = { ...user, ...formData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-purple-950">
            <Navbar />

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 animate-fade-in">
                        <h1 className="text-4xl font-bold gradient-text mb-2">My Profile</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your account information
                        </p>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 animate-scale-in">
                        {/* Avatar */}
                        <div className="flex items-center justify-center mb-8">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white text-4xl font-bold">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>

                        {/* Form */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Full Name
                                </label>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    />
                                ) : (
                                    <p className="text-gray-900 dark:text-white text-lg">{user.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <p className="text-gray-900 dark:text-white text-lg">{user.email}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Email cannot be changed
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Phone Number
                                </label>
                                {editing ? (
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    />
                                ) : (
                                    <p className="text-gray-900 dark:text-white text-lg">
                                        {user.phone || 'Not provided'}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Delivery Address
                                </label>
                                {editing ? (
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    />
                                ) : (
                                    <p className="text-gray-900 dark:text-white text-lg">
                                        {user.address || 'Not provided'}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex gap-4">
                            {editing ? (
                                <>
                                    <button
                                        onClick={handleUpdate}
                                        disabled={loading}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold btn-hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditing(false);
                                            setFormData({
                                                name: user.name || '',
                                                email: user.email || '',
                                                phone: user.phone || '',
                                                address: user.address || '',
                                            });
                                        }}
                                        className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold btn-hover-lift"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {/* Account Stats */}
                        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Account Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Account Type</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">Customer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
