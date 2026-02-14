import React from 'react';
import ClientOnly from './ClientOnly';

interface AdSidebarProps {
    code: string;
    type: 'left' | 'right';
}

export const AdSidebar: React.FC<AdSidebarProps> = ({ code, type }) => {
    return (
        <ClientOnly>
            <div className="hidden lg:flex flex-col items-center justify-start p-4 bg-stone-50/50 border-x border-stone-100 w-56 sticky top-0 h-screen overflow-hidden" suppressHydrationWarning>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.25em] mb-4">Advertisement</span>
                {code ? (
                    <div dangerouslySetInnerHTML={{ __html: code }} className="w-full h-full flex justify-center" suppressHydrationWarning />
                ) : (
                    <div className="w-full aspect-[160/600] bg-stone-100 rounded-3xl flex items-center justify-center text-center p-6 text-stone-400 text-[11px] font-medium leading-relaxed italic border-2 border-dashed border-stone-200" suppressHydrationWarning>
                        Space Iklan Adsterra {type === 'left' ? 'Kiri' : 'Kanan'}
                    </div>
                )}
            </div>
        </ClientOnly>
    );
};
