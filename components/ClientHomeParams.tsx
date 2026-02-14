'use client';

import React, { useState, useMemo } from 'react';
import { Tag, Search } from 'lucide-react';
import { Motorbike } from '@/app/actions/motorbikes';
import { Category } from '@/app/actions/categories';
import { MotorCard } from '@/components/MotorCard';
import { Lightbox } from '@/components/Lightbox';

interface ClientHomeParamsProps {
    motorbikes: Motorbike[];
    categories: Category[];
    whatsappNumber: string;
}

export default function ClientHomeParams({ motorbikes, categories, whatsappNumber }: ClientHomeParamsProps) {
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [zoomData, setZoomData] = useState<{ images: string[]; initialIndex: number } | null>(null);

    const filteredMotorbikes = useMemo(() => {
        if (selectedCategory === 'Semua') return motorbikes;
        // Normalize comparison to be case-insensitive just in case
        return motorbikes.filter(m => m.category.toLowerCase() === selectedCategory.toLowerCase());
    }, [motorbikes, selectedCategory]);

    return (
        <>
            <div className="mb-12" suppressHydrationWarning>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black text-stone-800 flex items-center gap-3">
                        <Tag size={22} className="text-emerald-600" /> Jelajahi Kategori
                    </h3>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    {['Semua', ...categories.map(c => c.name)].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-8 py-3.5 rounded-2xl text-sm font-bold transition-all border shadow-sm ${selectedCategory === cat ? 'bg-emerald-700 text-white border-emerald-700 shadow-emerald-700/20' : 'bg-white text-stone-500 border-stone-100 hover:border-emerald-200 hover:bg-stone-50'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24" suppressHydrationWarning>
                {filteredMotorbikes.length > 0 ? (
                    filteredMotorbikes.map((motor) => (
                        <MotorCard
                            key={motor.id}
                            motor={motor}
                            whatsappNumber={whatsappNumber}
                            onZoom={(images, index) => setZoomData({ images, initialIndex: index })}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center bg-stone-50 rounded-[3rem] border-2 border-dashed border-stone-200">
                        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
                            <Search size={40} />
                        </div>
                        <h3 className="text-stone-700 font-black text-xl mb-2">Belum Ada Unit</h3>
                        <p className="text-stone-400 font-medium">Kami sedang memperbarui stok motor kami untuk kategori ini. Cek lagi nanti!</p>
                    </div>
                )}
            </div>

            <Lightbox
                images={zoomData?.images || []}
                initialIndex={zoomData?.initialIndex || 0}
                isOpen={!!zoomData}
                onClose={() => setZoomData(null)}
            />
        </>
    );
}
