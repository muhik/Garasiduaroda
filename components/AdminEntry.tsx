'use client';

import React, { useState, useEffect } from 'react';
import { Settings, X, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { login, checkAuth } from '@/app/actions/auth';

export default function AdminEntry() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(false);

    const handleIconClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        setChecking(true);
        // "Smart Check": If already logged in, go straight to dashboard.
        // If not, show the password modal.
        // This balances "Want Password Protection" with "Don't want to be annoyed if I'm already in".
        const isAuth = await checkAuth();
        if (isAuth) {
            router.push('/admin');
        } else {
            setIsOpen(true);
            setChecking(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await login(password);
            if (res.success) {
                setIsOpen(false);
                router.push('/admin');
            } else {
                setError(res.error || 'Password salah');
            }
        } catch (err) {
            setError('Terjadi kesalahan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={handleIconClick}
                className="text-stone-300 hover:text-emerald-600 transition-all p-2 hover:bg-emerald-50 rounded-xl relative"
                aria-label="Admin Area"
                disabled={checking}
            >
                <Settings size={24} className={checking ? "animate-spin" : ""} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl relative">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-2 text-stone-300 hover:text-stone-500 hover:bg-stone-100 rounded-full transition-all"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock size={24} />
                            </div>
                            <h3 className="text-xl font-black text-stone-800">Admin Login</h3>
                            <p className="text-sm text-stone-400 font-medium mt-1">Masukkan kunci akses dashboard.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-4 rounded-xl bg-stone-50 border border-stone-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold text-center tracking-widest text-lg"
                                    placeholder="••••••••"
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <div className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !password}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? 'Memproses...' : <>Masuk <ArrowRight size={18} /></>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
