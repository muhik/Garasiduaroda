'use client';

import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
    images: string[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ images, initialIndex, isOpen, onClose }) => {
    const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

    React.useEffect(() => {
        if (isOpen) setCurrentIndex(initialIndex);
    }, [isOpen, initialIndex]);

    if (!isOpen || images.length === 0) return null;

    const nextImg = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImg = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-stone-900/95 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200 backdrop-blur-sm" onClick={onClose}>
            <button onClick={onClose} className="absolute top-6 right-6 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all z-20">
                <X size={32} />
            </button>

            <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
                <img
                    src={images[currentIndex]}
                    className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                    alt={`Zoom View ${currentIndex + 1}`}
                    onClick={(e) => e.stopPropagation()}
                />

                {images.length > 1 && (
                    <>
                        <button onClick={prevImg} className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-white bg-black/20 hover:bg-black/50 p-3 rounded-full transition-all backdrop-blur-sm">
                            <ChevronLeft size={32} />
                        </button>
                        <button onClick={nextImg} className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-white bg-black/20 hover:bg-black/50 p-3 rounded-full transition-all backdrop-blur-sm">
                            <ChevronRight size={32} />
                        </button>
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
                            {images.map((_, i) => (
                                <div key={i} className={`h-2 rounded-full transition-all ${i === currentIndex ? 'w-8 bg-emerald-500' : 'w-2 bg-stone-600'}`} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
