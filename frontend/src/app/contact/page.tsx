import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import ContactSection from '@/components/sections/ContactSection';
import SiteFooter from '@/components/SiteFooter';

import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Contact Steel Stockist Mumbai',
  description:
    'Direct procurement desk for steel round bars, heavy steamer shafts & hacksaw cutting. Plot 156, 4th Lane, Darukhana, Mazgaon, Mumbai. Call +91 98200 23666.',
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: 'Contact Steel Stockist Mumbai | Shah Industrial Enterprise',
    description:
      'Request a steel material quotation or contact the Darukhana, Mumbai desk directly by phone, WhatsApp, or email.',
    url: `${SITE_URL}/contact`,
    type: 'website',
    images: [{ url: '/og-social.png', width: 1731, height: 909, alt: 'Shah Industrial Enterprise — Industrial Steel and Shafting, Darukhana, Mumbai' }],
  },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ product?: string; grade?: string }> }) {
  const { product, grade } = await searchParams;
  return (
    <main className="min-h-screen bg-paper text-slate">
      <Navigation />
      <div className="pt-16 sm:pt-20">
        <ContactSection productSlug={typeof product === "string" ? product : undefined} gradeCode={typeof grade === "string" ? grade : undefined} />
      </div>
      <SiteFooter />
    </main>
  );
}
