import React from 'react';

export const runtime = 'edge';

import {
    Bike,
    Tag,
    MessageCircle,
    Search
} from 'lucide-react';
import { getMotorbikes } from './actions/motorbikes';
import { getCategories } from './actions/categories';
import { getSettings } from './actions/settings';
import { AdSidebar } from '@/components/AdSidebar';
import { MotorCard } from '@/components/MotorCard';
import ClientHomeParams from '@/components/ClientHomeParams';
import ClientOnly from '@/components/ClientOnly';
import { HeroSection } from '@/components/HeroSection';

export const dynamic = 'force-dynamic';

export default async function Home() {
    const [motorbikes, categories, settings] = await Promise.all([
        getMotorbikes(),
        getCategories(),
        getSettings()
    ]);

    const storeName = settings.storeName || 'Garasi Roda Dua';
    const whatsappNumber = settings.whatsappNumber || '628123456789';

    return (
        <div className="flex bg-white min-h-screen font-sans" suppressHydrationWarning>
            <AdSidebar type="left" code={settings.leftAdCode || ''} />
            <main className="flex-1 w-full max-w-6xl mx-auto px-6 lg:px-12">
                <header className="flex justify-between items-center py-8" suppressHydrationWarning>
                    <div className="flex items-center gap-3" suppressHydrationWarning>
                        <div className="bg-emerald-700 p-2.5 rounded-2xl shadow-lg shadow-emerald-700/20" suppressHydrationWarning>
                            <Bike className="text-white" size={26} />
                        </div>
                        <h1 className="text-2xl font-black text-stone-800 tracking-tight" suppressHydrationWarning>{storeName}</h1>
                    </div>
                    {/* Admin Entry hidden as per user request */}
                </header>

                <HeroSection storeName={storeName} whatsappNumber={whatsappNumber} />

                {/* Client Component for filtering and state */}
                <ClientOnly>
                    <ClientHomeParams
                        motorbikes={motorbikes}
                        categories={categories}
                        whatsappNumber={whatsappNumber}
                    />
                </ClientOnly>

            </main>
            <AdSidebar type="right" code={settings.rightAdCode || ''} />

            {/* Pixel Script */}
            {settings.pixelId && (
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${settings.pixelId}');
              fbq('track', 'PageView');
            `
                    }}
                />
            )}
        </div>
    );
}
