import type { Metadata, Viewport } from 'next'
import { Inter, Lato, Roboto } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CommentPanel } from '@/components/comments/comment-panel'
import './globals.css'

const lato = Lato({ 
  subsets: ["latin"],
  variable: '--font-lato',
  weight: ['400', '700']
});

const roboto = Roboto({ 
  subsets: ["latin"],
  variable: '--font-roboto',
  weight: ['400', '700']
});

export const metadata: Metadata = {
  title: 'Bloomfield Terminal | Données Financières Africaines',
  description: 'Plateforme professionnelle de données financières et macroéconomiques africaines. Analyse BRVM, marchés boursiers, indicateurs économiques.',
  keywords: ['finance africaine', 'BRVM', 'marché boursier', 'données économiques', 'Afrique'],
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="">
      <head>
        {/* Apply saved theme before first paint to avoid flash */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('bloomfield-theme');if(t==='dark'){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})()` }} />
      </head>
      <body className={`${lato.variable} ${roboto.variable} antialiased bg-background text-foreground`}>
        {/* <CommentPanel /> */}
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
