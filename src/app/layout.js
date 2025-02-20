import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Green-GO Config Parser',
  description: 'A simple application to parse Green-GO configuration files and export CSV files containing user and device information',
  icons: {
    icon: [
      { url: '/ggo-config-parser/favicon.ico', sizes: 'any' },
      { url: '/ggo-config-parser/favicon-32x32.png', type: 'image/png', sizes: '32x32' }
    ]
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/ggo-config-parser/favicon.ico" sizes="any" />
        <link rel="icon" href="/ggo-config-parser/favicon-32x32.png" type="image/png" sizes="32x32" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}