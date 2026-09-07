import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import ContactSection from '@/components/sections/ContactSection';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Contact & Material Enquiry',
  description:
    'Send a material enquiry to Shah Industrial Enterprise with the required grade, dimensions, quantity, urgency, and delivery location, or contact the Darukhana desk directly.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact & Material Enquiry | Shah Industrial Enterprise',
    description:
      'Request a steel material quotation or contact the Darukhana, Mumbai desk directly by phone, WhatsApp, or email.',
    url: '/contact',
    type: 'website',
    images: [{ url: '/og-social.png', width: 1731, height: 909, alt: 'Shah Industrial Enterprise — Industrial Steel and Shafting, Darukhana, Mumbai' }],
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-paper text-slate">
      <Navigation />
      <div className="pt-16 sm:pt-20">
        <ContactSection />
      </div>
      <SiteFooter />
    </main>
  );
}
