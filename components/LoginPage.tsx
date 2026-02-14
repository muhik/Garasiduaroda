'use client';

import React, { useState } from 'react';
import { Lock, AlertCircle, ChevronRight } from 'lucide-react';
import { login } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';

export const LoginPage = () => {
    const [passInput, setPassInput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await login(passInput);
            if (res.success) {
                window.location.reload(); // Refresh to trigger server auth check
            } else {
                setError(res.error || 'Login gagal');
            }
        } catch (e) {
            setError('Terjadi kesalahan system');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4" suppressHydrationWarning>
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-xl shadow-stone-200 overflow-hidden border border-stone-100" suppressHydrationWarning>
                <div className="bg-emerald-700 p-10 text-center text-white relative overflow-hidden" suppressHydrationWarning>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="bg-white/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 backdrop-blur-md border border-white/20"><Lock size={36} /></div>
                    <h2 className="text-3xl font-black tracking-tight">Admin Area</h2>
                    <p className="text-emerald-100 text-sm mt-2 font-medium opacity-80">Gunakan kunci akses untuk mengelola unit</p>
                </div>
                <form onSubmit={handleLogin} className="p-10" suppressHydrationWarning>
                    {error && <div className="bg-orange-50 text-orange-700 p-4 rounded-2xl flex items-center gap-3 text-sm mb-8 border border-orange-100"><AlertCircle size={20} /> {error}</div>}
                    <div className="mb-8" suppressHydrationWarning>
                        <label className="block text-[11px] font-black text-stone-400 uppercase mb-3 tracking-[0.2em]">Kunci Akses</label>
                        <input type="password" autoFocus className="w-full p-4 rounded-2xl bg-stone-50 border border-stone-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none" placeholder="Masukkan password..." value={passInput} onChange={(e) => setPassInput(e.target.value)} />
                    </div>
                    <button disabled={loading} className="w-full bg-emerald-700 text-white font-bold py-5 rounded-2xl hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-700/20 flex items-center justify-center gap-2 text-lg disabled:opacity-50">
                        {loading ? 'Memproses...' : <>Masuk <ChevronRight size={22} /></>}
                    </button>
                    <a href="/" className="w-full mt-6 text-stone-400 text-sm font-semibold hover:text-emerald-600 transition-colors block text-center">Kembali ke Beranda</a>
                </form>
            </div>
        </div>
    );
};
