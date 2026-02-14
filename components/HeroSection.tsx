'use client';

import React from 'react';
import { MessageCircle, Bike } from 'lucide-react';

interface HeroSectionProps {
    storeName: string;
    whatsappNumber: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ storeName, whatsappNumber }) => {

    const trackHeroContact = () => {
        // @ts-ignore
        if (typeof window !== 'undefined' && window.fbq) {
            // @ts-ignore
            window.fbq('track', 'Contact', { content_name: 'Hero Consultation' });
        }
    };

    return (
        <section className="bg-stone-800 rounded-[3rem] p-10 sm:p-16 text-white mb-16 overflow-hidden relative shadow-2xl shadow-stone-200" suppressHydrationWarning>
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none" suppressHydrationWarning>
                <div className="absolute top-0 right-0 w-[50%] h-full bg-emerald-500 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" suppressHydrationWarning></div>
            </div>
            <div className="relative z-10 max-w-2xl" suppressHydrationWarning>
                <div className="inline-block bg-emerald-500/20 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-sm border border-emerald-500/20" suppressHydrationWarning>
                    Unit Premium & Bergaransi
                </div>
                <h2 className="text-5xl sm:text-6xl font-black mb-6 leading-[1.1] tracking-tight" suppressHydrationWarning>Cari Motor Second?<br /><span className="text-emerald-400">Kami Punya Solusinya.</span></h2>
                <p className="text-stone-300 text-xl mb-10 leading-relaxed font-medium" suppressHydrationWarning>Temukan unit berkualitas dengan surat lengkap dan harga yang jujur di {storeName}.</p>
                <a
                    href={`https://wa.me/${whatsappNumber}`}
                    onClick={trackHeroContact}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex bg-emerald-600 hover:bg-emerald-500 px-10 py-5 rounded-[1.5rem] font-black items-center gap-4 transition-all transform hover:scale-105 shadow-xl shadow-emerald-900/40 text-lg"
                    suppressHydrationWarning
                >
                    <MessageCircle size={26} /> Konsultasi Sekarang
                </a>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none hidden lg:block" suppressHydrationWarning>
                <Bike size={450} className="transform -rotate-12" />
            </div>
        </section>
    );
};
