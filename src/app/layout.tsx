import type React from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/styles/globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { siteConfig } from '@/constants';



const nunito = localFont({
  src: [
    {
      path: '../../public/fonts/nunito-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/nunito-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  icons: {
    icon: '/images/aphrc32x32.png',
    shortcut: '/images/aphrc32x32.png',
    apple: '/images/aphrc180x180.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${nunito.className} ${nunito.variable}`}
        suppressHydrationWarning
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
