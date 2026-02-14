import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const runtime = 'edge';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jual Beli Motor Second",
  description: "Temukan motor second berkualitas dengan harga terbaik.",
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var originalError = console.error;
                console.error = function() {
                  var args = Array.from(arguments);
                  var msg = args.map(function(arg) {
                    try {
                      return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
                    } catch(e) {
                      return String(arg);
                    }
                  }).join(' ');
                  
                  if (msg.includes('bis_skin_checked') ||
                      msg.includes('Hydration') || 
                      msg.includes('hydrated') || 
                      msg.includes('text content does not match')) {
                    return;
                  }
                  originalError.apply(console, args);
                };
              })();
            `
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <div suppressHydrationWarning>
          {children}
        </div>
      </body>
    </html>
  );
}
