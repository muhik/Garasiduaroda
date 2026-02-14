'use client';

import React, { useState } from 'react';
import {
    Calendar,
    MapPin,
    Maximize2,
    Image as ImageIcon,
    MessageCircle,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { Motorbike } from '@/app/actions/motorbikes';

interface MotorCardProps {
    motor: Motorbike;
    whatsappNumber: string;
    onZoom: (images: string[], index: number) => void;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

export const MotorCard: React.FC<MotorCardProps> = ({ motor, whatsappNumber, onZoom }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = motor.imageUrls;

    const nextImg = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImg = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const trackWhatsAppClick = () => {
        // @ts-ignore
        if (window.fbq) {
            // @ts-ignore
            window.fbq('track', 'Lead', { content_name: 'WhatsApp Contact', value: motor.price, currency: 'IDR' });
        }
    };

    return (
        <div className="bg-white border border-stone-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all group border-b-4 border-b-transparent hover:border-b-emerald-600">
            <div className="relative aspect-[4/3] bg-stone-50 overflow-hidden">
                {images.length > 0 ? (
                    <>
                        <img
                            src={images[currentIndex]}
                            alt={motor.name}
                            className="w-full h-full object-cover cursor-zoom-in transition-transform duration-700 group-hover:scale-105"
                            onClick={() => onZoom(images, currentIndex)}
                        />
                        {images.length > 1 && (
                            <>
                                <button onClick={prevImg} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full text-stone-800 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronLeft size={20} />
                                </button>
                                <button onClick={nextImg} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full text-stone-800 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight size={20} />
                                </button>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                                    {images.map((_, i) => (
                                        <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentIndex ? 'w-5 bg-emerald-600' : 'w-1.5 bg-white/60'}`} />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300"><ImageIcon size={48} /></div>
                )}
                <div className="absolute top-4 left-4">
                    <span className="bg-emerald-600/90 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-bold text-white shadow-sm uppercase tracking-widest">{motor.category}</span>
                </div>
                <button
                    onClick={() => onZoom(images, currentIndex)}
                    className="absolute top-4 right-4 bg-stone-900/40 backdrop-blur p-2.5 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-stone-900/60"
                >
                    <Maximize2 size={16} />
                </button>

                {motor.isSold && (
                    <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                        <div className="bg-red-600 text-white px-6 py-2 rounded-xl font-black text-xl uppercase tracking-[0.2em] transform -rotate-12 shadow-2xl border-4 border-white/20">
                            TERJUAL
                        </div>
                    </div>
                )}
            </div>

            <div className={`p-6 ${motor.isSold ? 'opacity-60 grayscale' : ''}`}>
                <h4 className="text-xl font-bold text-stone-800 mb-1">{motor.name}</h4>
                <div className="flex items-center gap-4 text-stone-500 text-sm mb-5">
                    <span className="flex items-center gap-1.5"><Calendar size={15} className="text-emerald-600" /> {motor.year}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={15} className="text-emerald-600" /> {motor.location || 'Ready'}</span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                    <div>
                        <p className="text-[10px] text-stone-400 uppercase font-black tracking-widest mb-0.5">Harga Terbaik</p>
                        <p className="text-2xl font-black text-emerald-700">
                            {formatPrice(motor.price)}
                        </p>
                    </div>
                    {motor.isSold ? (
                        <button disabled className="bg-stone-200 text-stone-400 p-3.5 rounded-2xl cursor-not-allowed">
                            <MessageCircle size={26} />
                        </button>
                    ) : (
                        <a
                            href={`https://wa.me/${whatsappNumber}?text=Halo, saya tertarik dengan ${motor.name} tahun ${motor.year}`}
                            onClick={trackWhatsAppClick}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-50 text-emerald-700 p-3.5 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        >
                            <MessageCircle size={26} />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};
