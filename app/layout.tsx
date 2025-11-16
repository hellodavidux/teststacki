import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StackAI · The Platform for Enterprise AI',
  description: 'StackAI is a versatile and powerful interface to deploy AI Agents for Enterprise AI. Build AI Applications effortlessly with our drag-and-drop no-code platform.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-transparent text-foreground">{children}</body>
    </html>
  )
}

