'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { businessConfig, CANONICAL_PRODUCTS } from '@/lib/config';
import { buildRfqWhatsAppUrl, buildGeneralWhatsAppUrl } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';
type PreferredContact = 'Call' | 'WhatsApp' | 'Email';
type Urgency = 'Standard' | 'Within 3 Days' | 'Immediate / Breakdown';

export default function ContactSection() {
  const hasStartedRfq = useRef(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    contactInfo: '',
    product: 'Heavy Steamer Shafts & Marine Shafts',
    grade: 'EN8',
    dimensions: '',
    quantity: '',
    deliveryLocation: '',
    urgency: 'Standard' as Urgency,
    preferredContact: 'Call' as PreferredContact,
    requirements: '',
  });

  // Honeypot — hidden from real buyers, filled only by bots.
  const [honeypot, setHoneypot] = useState('');

  const [touched, setTouched] = useState({
    name: false,
    company: false,
    contactInfo: false,
    material: false,
    dimensions: false,
    quantity: false,
    deliveryLocation: false,
    urgency: false,
    preferredContact: false,
    requirements: false,
  });

  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showFallback, setShowFallback] = useState(false);
  const [receiptId, setReceiptId] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const handlePopulate = (e: CustomEvent) => {
      const detail = typeof e.detail === 'string' ? e.detail : '';
      setFormData((prev) => ({
        ...prev,
        requirements: prev.requirements
          ? `${prev.requirements}\nRequirement note: ${detail}`
          : `I would like to request a quote for: ${detail}`,
      }));
    };
    window.addEventListener('populateRequirements', handlePopulate as EventListener);
    return () => window.removeEventListener('populateRequirements', handlePopulate as EventListener);
  }, []);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const getInputStyle = (name: keyof typeof formData, isValid: boolean) => {
    const baseStyle =
      'w-full bg-white/[0.04] rounded-md px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:bg-white/[0.06] transition-all duration-300 font-mono text-xs sm:text-sm';
    if (!touched[name as keyof typeof touched]) return `${baseStyle} border border-white/[0.08] focus:border-cyan-glow/40`;
    return isValid
      ? `${baseStyle} border border-cyan-glow/50`
      : `${baseStyle} border border-dawn-coral/70`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    setShowFallback(false);

    const quoteSummary = [
      `=== SHAH INDUSTRIAL RFQ ===`,
      `Product Category: ${formData.product}`,
      `Steel Grade: ${formData.grade}`,
      `Dimensions / Cut Length: ${formData.dimensions || 'Standard / Unspecified'}`,
      `Quantity: ${formData.quantity}`,
      `Delivery Destination: ${formData.deliveryLocation || 'Ex-Yard Mazgaon pickup'}`,
      `Urgency Level: ${formData.urgency}`,
      `Preferred Contact Method: ${formData.preferredContact}`,
      '',
      'Buyer Requirements & Notes:',
      formData.requirements || 'Please provide quotation with best availability and cutting schedule.',
    ].join('\n');

    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          contactInfo: formData.contactInfo,
          requirements: quoteSummary,
          website: honeypot,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        const validationMessage = Array.isArray(data?.errors)
          ? data.errors.map((errItem: { message: string }) => errItem.message).join('. ')
          : null;

        setErrorMessage(
          validationMessage ||
            data?.message ||
            'We could not record your enquiry just now.'
        );
        // A transport/backend failure (not a validation problem) means the buyer
        // must be offered another channel rather than told it went through.
        setShowFallback(Boolean(data?.fallback) || !validationMessage);
        setStatus('error');
        trackEvent('rfq_submit_failed', { product_title: formData.product });
        return;
      }

      setReceiptId(data.inquiry?.id?.slice(0, 8).toUpperCase() || 'RECEIVED');
      setStatus('success');
      trackEvent('rfq_submit', {
        product_title: formData.product,
        grade: formData.grade,
        dimensions: formData.dimensions,
        quantity: formData.quantity,
      });
      setFormData({
        name: '',
        company: '',
        contactInfo: '',
        product: CANONICAL_PRODUCTS[0].title,
        grade: 'EN8',
        dimensions: '',
        quantity: '',
        deliveryLocation: '',
        urgency: 'Standard',
        preferredContact: 'Call',
        requirements: '',
      });
    } catch {
      setErrorMessage('We could not reach our enquiry desk just now.');
      setShowFallback(true);
      setStatus('error');
      trackEvent('rfq_submit_failed', { product_title: formData.product });
    }
  };

  const handleWhatsAppInstantQuote = () => {
    const url = buildRfqWhatsAppUrl({
      name: formData.name,
      company: formData.company,
      material: `${formData.product} (Grade ${formData.grade})`,
      dimensions: formData.dimensions,
      quantity: formData.quantity,
      deliveryLocation: formData.deliveryLocation,
      urgency: formData.urgency,
      requirements: formData.requirements,
    });
    trackEvent('whatsapp_click', { source_page: 'rfq_form_secondary' });
    window.open(url, '_blank');
  };

  return (
    <section id="contact" className="relative z-20 bg-paper py-16 noise-overlay sm:py-20 lg:py-24">
      <div className="relative z-10 mx-auto max-w-[1200px] px-5 sm:px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center sm:mb-16 md:mb-20"
        >
          <span className="section-tag justify-center">GET IN TOUCH & QUOTE</span>
          <h2 className="section-title">Direct Procurement & Inquiry Desk</h2>
          <p className="section-desc mx-auto text-center">
            Specify the steel grade, diameter, cut length, quantity, and delivery location. For urgent requirements, use the direct call or WhatsApp options.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-12 lg:gap-16 items-start">
          {/* RFQ Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-xl bg-slate p-6 text-white ring-1 ring-white/5 sm:p-8 md:p-10 shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-glow/5 to-transparent pointer-events-none" />

            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-cyan-glow/10 border border-cyan-glow/30 flex items-center justify-center mx-auto mb-6">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8FD8D4" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl mb-3 text-white">Inquiry Received</h3>
                  <p className="text-white/60 text-sm mb-6 max-w-md mx-auto leading-relaxed">
                    Thank you. Your requirement has been recorded for review. Keep this reference ID for follow-up.
                  </p>
                  <div className="inline-flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-md px-5 py-3 mb-8">
                    <span className="font-mono text-[0.7rem] text-white/40 uppercase tracking-[0.2em]">Ref ID:</span>
                    <span className="font-mono text-cyan-glow tracking-wider font-bold">{receiptId}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                      href={buildRfqWhatsAppUrl({
                        name: 'Ref ' + receiptId,
                        company: '',
                        material: 'Inquiry Reference ' + receiptId,
                        quantity: '',
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-slate-900"
                    >
                      Follow up on WhatsApp ↗
                    </a>
                    <button
                      onClick={() => setStatus('idle')}
                      className="font-mono text-xs text-white/50 hover:text-white transition-colors underline underline-offset-4"
                    >
                      Submit another inquiry
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                    <div>
                      <h3 className="font-display text-2xl text-white">Request Material Quote</h3>
                      <p className="text-white/50 text-xs mt-1">Material enquiry · Darukhana, Mazgaon</p>
                    </div>
                    <span className="font-mono text-[0.65rem] uppercase tracking-wider text-cyan-glow bg-cyan-glow/10 border border-cyan-glow/20 px-2.5 py-1 rounded">
                      Direct enquiry
                    </span>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    onFocusCapture={() => {
                      if (hasStartedRfq.current) return;
                      hasStartedRfq.current = true;
                      trackEvent('rfq_start', { source_page: window.location.pathname });
                    }}
                    className="space-y-4 sm:space-y-5 relative z-10"
                  >
                    {/* Buyer Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="rfq-name" className="text-[0.7rem] font-mono uppercase tracking-[0.2em] text-cyan-glow/80">
                          Full Name *
                        </label>
                        <input
                          id="rfq-name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                          className={getInputStyle('name', formData.name.length > 0)}
                          placeholder="Your Name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="rfq-company" className="text-[0.7rem] font-mono uppercase tracking-[0.2em] text-cyan-glow/80">
                          Company Name *
                        </label>
                        <input
                          id="rfq-company"
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                          className={getInputStyle('company', formData.company.length > 0)}
                          placeholder="Company / Workshop Name"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="rfq-contact" className="text-[0.7rem] font-mono uppercase tracking-[0.2em] text-cyan-glow/80">
                        Email Address or Mobile / WhatsApp *
                      </label>
                      <input
                        id="rfq-contact"
                        type="text"
                        name="contactInfo"
                        value={formData.contactInfo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={getInputStyle('contactInfo', formData.contactInfo.length > 3)}
                        placeholder="e.g. +91 98200 00000 or purchase@company.com"
                      />
                    </div>

                    {/* Material & Grade */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="rfq-product" className="text-[0.7rem] font-mono uppercase tracking-[0.2em] text-cyan-glow/80">
                          Material / Product Category
                        </label>
                        <select
                          id="rfq-product"
                          name="product"
                          value={formData.product}
                          onChange={handleChange}
                          className="w-full rounded-md border border-white/[0.08] bg-slate px-4 py-3 font-mono text-xs text-white focus:border-cyan-glow/40 focus:outline-none"
                        >
                          {CANONICAL_PRODUCTS.map((prod) => (
                            <option key={prod.slug} value={prod.title}>
                              {prod.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="rfq-grade" className="text-[0.7rem] font-mono uppercase tracking-[0.2em] text-cyan-glow/80">
                          Steel Grade
                        </label>
                        <select
                          id="rfq-grade"
                          name="grade"
                          value={formData.grade}
                          onChange={handleChange}
                          className="w-full rounded-md border border-white/[0.08] bg-slate px-4 py-3 font-mono text-xs text-white focus:border-cyan-glow/40 focus:outline-none"
                        >
                          <option value="EN8">EN8 (080M40 / Carbon Steel)</option>
                          <option value="EN9">EN9 (070M55 / High Carbon)</option>
                          <option value="EN19">EN19 (AISI 4140 / High Tensile)</option>
                          <option value="EN24">EN24 (AISI 4340 / Ni-Cr-Mo)</option>
                          <option value="EN31">EN31 (52100 Bearing Steel)</option>
                          <option value="EN353">EN353 Case Hardening</option>
                          <option value="C45">C45 / 1045</option>
                          <option value="IS 2062">IS 2062 Grade A/B (MS)</option>
                          <option value="Class 4 Forged">Class 4 Forged</option>
                          <option value="Hard Chrome">Hard Chrome Plated Rod</option>
                          <option value="Other / Drawing Specified">Other (Specify in Notes)</option>
                        </select>
                      </div>
                    </div>

                    {/* Dimensions & Quantity */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="rfq-dimensions" className="text-[0.7rem] font-mono uppercase tracking-[0.2em] text-cyan-glow/80">
                          Diameter & Cut Length (mm)
                        </label>
                        <input
                          id="rfq-dimensions"
                          type="text"
                          name="dimensions"
                          value={formData.dimensions}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={getInputStyle('dimensions', formData.dimensions.length > 0)}
                          placeholder="e.g. Ø 120mm × 850mm long"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="rfq-quantity" className="text-[0.7rem] font-mono uppercase tracking-[0.2em] text-cyan-glow/80">
                          Quantity (Pcs / Weight) *
                        </label>
                        <input
                          id="rfq-quantity"
                          type="text"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                          className={getInputStyle('quantity', formData.quantity.length > 0)}
                          placeholder="e.g. 10 pcs or 2.5 Metric Tons"
                        />
                      </div>
                    </div>

                    {/* Location & Urgency */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="rfq-location" className="text-[0.7rem] font-mono uppercase tracking-[0.2em] text-cyan-glow/80">
                          Delivery Location
                        </label>
                        <input
                          id="rfq-location"
                          type="text"
                          name="deliveryLocation"
                          value={formData.deliveryLocation}
                          onChange={handleChange}
                          className={getInputStyle('deliveryLocation', true)}
                          placeholder="e.g. Mumbai Yard Pickup, Pune, Gujarat..."
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="rfq-urgency" className="text-[0.7rem] font-mono uppercase tracking-[0.2em] text-cyan-glow/80">
                          Urgency Level
                        </label>
                        <select
                          id="rfq-urgency"
                          name="urgency"
                          value={formData.urgency}
                          onChange={handleChange}
                          className="w-full rounded-md border border-white/[0.08] bg-slate px-4 py-3 font-mono text-xs text-white focus:border-cyan-glow/40 focus:outline-none"
                        >
                          <option value="Standard">Standard (Within 5-7 Days)</option>
                          <option value="Within 3 Days">Within 2–3 Days</option>
                          <option value="Immediate / Breakdown">Immediate / Breakdown Need</option>
                        </select>
                      </div>
                    </div>

                    {/* Drawing Upload & Requirements */}
                    <div className="space-y-1.5">
                      <label htmlFor="rfq-requirements" className="text-[0.7rem] font-mono uppercase tracking-[0.2em] text-cyan-glow/80">
                        Additional Requirements & Machining Specs
                      </label>
                      <textarea
                        id="rfq-requirements"
                        rows={3}
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleChange}
                        className={`${getInputStyle('requirements', true)} resize-none`}
                        placeholder="Mention tolerance notes, ultrasonic testing need, MTC requirement, or specific workshop instructions..."
                      />
                    </div>

                    {/*
                      Drawings are handed off over WhatsApp / email rather than
                      uploaded: the RFQ endpoint stores text only, so an in-form
                      upload control would promise a transfer that never happens.
                    */}
                    <div className="rounded-md border border-dashed border-white/20 bg-white/[0.02] p-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <span className="flex items-center gap-2 font-mono text-xs text-white/60">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                          Have a drawing or spec sheet? Send it directly:
                        </span>
                        <span className="flex items-center gap-2">
                          <a
                            href={buildGeneralWhatsAppUrl(
                              `Hello Shah Industrial Enterprise,

I am sending a drawing / specification sheet for a material enquiry.`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded bg-[#25D366]/15 px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-wider text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-slate-900"
                          >
                            WhatsApp
                          </a>
                          <a
                            href={`mailto:${businessConfig.email}?subject=${encodeURIComponent('Drawing / Specification for material enquiry')}`}
                            className="rounded bg-white/[0.06] px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-wider text-white/70 transition-colors hover:bg-white/15 hover:text-white"
                          >
                            Email
                          </a>
                        </span>
                      </div>
                    </div>

                    {/* Honeypot — hidden from buyers and assistive tech, bots fill it. */}
                    <div aria-hidden="true" className="hidden">
                      <label htmlFor="rfq-website">Website</label>
                      <input
                        id="rfq-website"
                        name="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                      />
                    </div>

                    {/* Error Display */}
                    {status === 'error' && (
                      <div className="rounded border border-dawn-coral/25 bg-dawn-coral/10 p-3 font-mono text-xs text-dawn-coral">
                        <p>⚠ {errorMessage}</p>
                        {showFallback && (
                          <>
                            <p className="mt-2 leading-relaxed text-white/70">
                              Your enquiry has not been recorded. Please send it straight to the
                              yard desk — your details below are carried across.
                            </p>
                            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                              <button
                                type="button"
                                onClick={handleWhatsAppInstantQuote}
                                className="rounded bg-[#25D366] px-4 py-2.5 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-slate-900 transition-colors hover:bg-[#20bd5a]"
                              >
                                Send on WhatsApp
                              </button>
                              <a
                                href={`tel:${(businessConfig.contacts.find(c => c.isPrimary) ?? businessConfig.contacts[0]).phone}`}
                                className="rounded border border-white/20 px-4 py-2.5 text-center font-mono text-[0.68rem] uppercase tracking-wider text-white/80 transition-colors hover:bg-white/10"
                              >
                                Call {(businessConfig.contacts.find(c => c.isPrimary) ?? businessConfig.contacts[0]).formattedPhone}
                              </a>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Dual Conversion Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full py-3.5 bg-dawn-coral text-slate-900 font-bold font-mono uppercase tracking-[0.14em] text-xs rounded-md shadow-md hover:bg-[#f09770] transition-colors disabled:opacity-50"
                      >
                        {status === 'submitting' ? 'Submitting RFQ...' : 'Submit Official RFQ →'}
                      </button>

                      <button
                        type="button"
                        onClick={handleWhatsAppInstantQuote}
                        className="w-full flex items-center justify-center gap-2 py-3.5 border border-[#25D366]/50 bg-[#25D366]/10 text-[#25D366] font-bold font-mono uppercase tracking-[0.14em] text-xs rounded-md hover:bg-[#25D366] hover:text-slate-900 transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                        Instant WhatsApp Quote
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Column: Contact Details & Yard Information */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-between h-full"
          >
            <div>
              <h3 className="font-display text-2xl sm:text-3xl mb-3 text-slate">Direct Enquiry Desk</h3>
              <p className="text-slate/70 mb-8 text-[0.95rem] leading-relaxed">
                Use the listed contacts for material availability, cutting feasibility, quotations, and dispatch questions.
              </p>

              <div className="space-y-4">
                {businessConfig.contacts.map((contact) => (
                  <div
                    key={contact.name}
                    className="flex items-center justify-between rounded-xl border border-steel/10 bg-white p-4 shadow-sm transition-all hover:border-steel/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-steel/10 flex items-center justify-center text-steel font-bold font-mono text-sm">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-slate text-base">{contact.name}</h4>
                        <p className="font-mono text-[0.7rem] text-steel/70">{contact.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${contact.phone}`}
                        className="rounded bg-slate/5 px-3 py-1.5 font-mono text-xs text-slate hover:bg-slate hover:text-white transition-colors"
                        title="Call"
                      >
                        Call
                      </a>
                      <a
                        href={`https://wa.me/${contact.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded bg-[#25D366]/10 px-3 py-1.5 font-mono text-xs text-[#128C7E] hover:bg-[#25D366] hover:text-white transition-colors"
                        title="WhatsApp"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Yard Address */}
              <div className="mt-8 rounded-xl border border-steel/10 bg-white p-5 space-y-4 shadow-sm">
                <div>
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-steel mb-1">Operating Stockyard Location</p>
                  <p className="font-mono text-xs text-slate/80 leading-relaxed">
                    Plot No. 156, 4th Lane, Darukhana, Mazgaon, Mumbai — 400010
                  </p>
                  <a
                    href="https://maps.google.com/?q=Plot+No.+156+4th+Lane+Darukhana+Mazgaon+Mumbai+400010"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[0.7rem] text-dawn-coral hover:underline mt-1.5"
                  >
                    View on Google Maps ↗
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-steel/10 flex items-center justify-between text-xs font-mono text-slate/60">
              <span>Working Hours: Mon–Sat, 9 AM – 7 PM</span>
              <span>IST</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
