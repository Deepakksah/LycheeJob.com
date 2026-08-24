import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MapJobHub - Production Map-Based Job Search & Aggregator',
  description: 'Search and discover jobs geographically across Delhi NCR, Mumbai, Bangalore, and India using interactive Google Map company logo markers and real-time aggregation.',
  keywords: ['job search', 'map jobs', 'react developer', 'c# jobs', 'delhi jobs', 'noida jobs', 'gurgaon jobs', 'job portal'],
  openGraph: {
    title: 'MapJobHub - Map-Based Job Search Platform',
    description: 'Aggregating normalized job listings on Google Maps with company logo markers.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
