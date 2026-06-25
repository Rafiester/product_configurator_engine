import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { UIProvider } from '@/components/ToastProvider';
import Navbar from '@/components/Navbar';
import { cookies } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PC Builder - Admin',
  description: 'Manage Master Product and dynamic PC Builder builds.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value || 'en';

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${inter.className} bg-neutral-bg dark:bg-dark-bg text-neutral-text dark:text-dark-text min-h-screen antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <UIProvider>
            <div className="min-h-screen">
              <Navbar lang={lang} />
              <main>{children}</main>
            </div>
          </UIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
