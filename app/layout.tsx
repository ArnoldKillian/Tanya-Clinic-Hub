import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tanyas-clinic-hub.arnold72.chatgpt.site'),
  title: "Tanya's Clinic Hub | The Menopause Clinic",
  description: "Tanya's personalized daily workspace for clinic systems, reminders and scanning.",
  openGraph: {
    title: "Tanya's Clinic Hub",
    description: 'A calmer clinic day starts here.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Tanya's Clinic Hub",
    description: 'A calmer clinic day starts here.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
