import type { Metadata } from 'next'
import { Bebas_Neue, Inter } from 'next/font/google'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'Vibra Bolivia 2027 — El festival se viene',
  description: '15.000 personas. 10 artistas. 12 horas de música. Vibra Bolivia vuelve en 2027.',
  openGraph: {
    title: 'Vibra Bolivia 2027',
    description: 'El festival más grande de Bolivia vuelve en 2027.',
    images: ['/assets/branding/preventa 1440.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${bebasNeue.variable} ${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
