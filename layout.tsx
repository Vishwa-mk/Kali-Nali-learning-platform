import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppHeader } from '@/components/layout/header';
import { AppStateProvider } from '@/lib/state';
import { AuthProvider } from '@/lib/auth-client';
import { AuthSync } from '@/lib/auth-sync';

export const metadata: Metadata = {
  title: 'Learn & Play',
  description: 'A digital learning environment where play becomes the primary engine of understanding.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <AppStateProvider>
            <AuthSync />
            <div className="relative flex min-h-screen flex-col bg-background">
              <AppHeader />
              <main className="flex-1">{children}</main>
            </div>
            <Toaster />
          </AppStateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
