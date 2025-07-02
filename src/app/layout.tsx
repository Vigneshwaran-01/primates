// src/app/layout.tsx
import { CartProvider } from '@/providers/CartProvider';
import { Inter, Bebas_Neue, Montserrat } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/providers/AuthProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const bebas_neue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const montserrat_nav = Montserrat({
  weight: ['500'],
  subsets: ['latin'],
  variable: '--font-montserrat-nav',
  display: 'swap',
});

export const metadata = {
  title: 'PRIMATE - Your Brand Name',
  description: 'High-quality fitness gear and apparel.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${bebas_neue.variable} ${montserrat_nav.variable}`}
    >
      <body className={`${inter.className} min-h-screen bg-black flex flex-col  text-foreground`}>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}