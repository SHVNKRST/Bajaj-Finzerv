import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '0101EX211003',
  description: 'API Frontend Interface',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}