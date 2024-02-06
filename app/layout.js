import {Inter} from 'next/font/google'
import {ClerkProvider} from '@clerk/nextjs'
import FirebaseWrapper from './reactfire'
import './globals.css'

const inter = Inter({subsets: ['latin']})

export const metadata = {
  title: 'HackathonTracker',
  description: 'For tracking upcoming and previous hackathons.',
}

export default function RootLayout({children}) {
  return (
    <ClerkProvider>
      <FirebaseWrapper>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </FirebaseWrapper>
    </ClerkProvider>
  )
}
