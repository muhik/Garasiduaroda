'use client';

import React, { useState, useEffect } from 'react';

export default function ClientOnly({ children }: { children: React.ReactNode }) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        if (!hasMounted) {
            return (
                <div className="min-h-screen bg-stone-50 flex items-center justify-center" suppressHydrationWarning>
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" suppressHydrationWarning></div>
                </div>
            );
        }
    }

    return <>{children}</>;
}
