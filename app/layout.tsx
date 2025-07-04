import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'personal-finance-visualizer',
  description: 'A personal finance visualizer app built with Next.js, MongoDB, and Tailwind CSS.',
  generator: 'Nitesh Vashist',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
