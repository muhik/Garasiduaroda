'use client';

import { useEffect } from 'react';

export default function ExtensionSuppressor() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const originalError = console.error;
        console.error = (...args: any[]) => {
            // Combine all arguments to check for specific error keywords
            const msg = args.map(arg => typeof arg === 'string' ? arg : '').join(' ');

            // Filter out errors related to the known extension attribute injection
            if (msg.includes('bis_skin_checked') ||
                msg.includes('Hydration') ||
                msg.includes('hydrated') ||
                msg.includes('text content does not match')) {
                return;
            }

            originalError.apply(console, args);
        };
    }, []);

    return null;
}
