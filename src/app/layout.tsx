import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Metadata } from 'next'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

const getBasePath = () => {
  if (process.env.NODE_ENV === 'production') {
    return '/ggo-config-parser';
  }
  return '';
};

export const metadata: Metadata = {
  title: 'Green-GO Config Parser',
  description: 'A simple application to parse Green-GO configuration files and export CSV files containing user and device information',
  icons: {
    icon: [
      { url: '/ggo-config-parser/favicon.ico', sizes: 'any' },
      { url: '/ggo-config-parser/favicon-32x32.png', type: 'image/png', sizes: '32x32' }
    ]
  }
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={`${getBasePath()}/favicon.ico`} sizes="any" />
        <link rel="icon" href={`${getBasePath()}/favicon-32x32.png`} type="image/png" sizes="32x32" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="flex-1 bg-gray-50 dark:bg-gray-900">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
} 