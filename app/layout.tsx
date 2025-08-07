import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bida - Supporting Your Child\'s Development',
  description: 'Track milestones and get personalized activities for your child\'s development',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#B0C4E8',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white`}>
        <div className="min-h-screen max-w-[430px] mx-auto relative bg-white shadow-sm">
          {children}
        </div>
      </body>
    </html>
  )
}