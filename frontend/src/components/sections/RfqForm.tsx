'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { businessConfig, CANONICAL_PRODUCTS } from '@/lib/config';
import { buildRfqWhatsAppUrl, buildGeneralWhatsAppUrl } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

export interface RfqLineItem {
  id: string;
  materialGrade: string;
  productType: string;
  od: string;
  idDimension: string;
  length: string;
  quantity: string;
  quantityUnit: string;
  process: string;
  remarks: string;
}

const DEFAULT_LINE_ITEM: Omit<RfqLineItem, 'id'> = {
  materialGrade: 'EN8',
  productType: CANONICAL_PRODUCTS[0]?.title || 'Heavy Steamer Shafts & Marine Shafts',
  od: '',
  idDimension: '',
  length: '',
  quantity: '',
  quantityUnit: 'NOS',
  process: 'Cut Piece',
  remarks: '',
};

const COMMON_GRADES = [
  { value: 'EN8', label: 'EN8 (080M40 / Carbon Steel)' },
  { value: 'EN9', label: 'EN9 (070M55 / High Carbon)' },
  { value: 'EN19', label: 'EN19 (AISI 4140 / High Tensile)' },
  { value: 'EN24', label: 'EN24 (AISI 4340 / Ni-Cr-Mo)' },
  { value: 'EN31', label: 'EN31 (52100 Bearing Steel)' },
  { value: 'EN353', label: 'EN353 Case Hardening' },
  { value: 'C45', label: 'C45 / 1045' },
  { value: 'IS 2062', label: 'IS 2062 Grade A/B (MS)' },
  { value: 'Class 4 Forged', label: 'Class 4 Forged' },
  { value: 'Hard Chrome', label: 'Hard Chrome Plated Rod' },
  { value: 'SS304', label: 'SS 304 Stainless' },
  { value: 'SS316', label: 'SS 316 Stainless' },
  { value: 'Other', label: 'Other (Specify in notes)' },
];

const QUANTITY_UNITS = ['NOS', 'KG', 'METER', 'MT'];
const PROCESS_OPTIONS = ['Cut Piece', 'Rough Turned', 'Black Bar', 'Proof Machined', 'Forged Block / Ring'];

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function RfqForm() {
  const hasStartedRfq = useRef(false);

  // Buyer Info
  const [buyerInfo, setBuyerInfo] = useState({
    contactPerson: '',
    companyName: '',
    email: '',
    phone: '',
    city: '',
    gstNumber: '',
    deliveryLocation: '',
    requiredDeliveryDate: '',
    message: '',
  });

  // Line items
  const [items, setItems] = useState<RfqLineItem[]>([
    {
      id: 'item-1',
      ...DEFAULT_LINE_ITEM,
    },
  ]);

  // Honeypot field (hidden from real users)
  const [honeypot, setHoneypot] = useState('');

  // Status & Responses
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showFallback, setShowFallback] = useState(false);
  const [generatedRfqNumber, setGeneratedRfqNumber] = useState('');

  const handleBuyerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setBuyerInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleItemChange = (
    index: number,
    field: keyof Omit<RfqLineItem, 'id'>,
    value: string
  ) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addItem = () => {
    if (items.length >= 20) return;
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        ...DEFAULT_LINE_ITEM,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleWhatsAppInstantQuote = () => {
    const primaryItem = items[0];
    const dims = primaryItem
      ? [
          primaryItem.od ? `OD Ø${primaryItem.od}mm` : '',
          primaryItem.length ? `L:${primaryItem.length}mm` : '',
        ]
          .filter(Boolean)
          .join(' × ')
      : '';

    const url = buildRfqWhatsAppUrl({
      name: buyerInfo.contactPerson,
      company: buyerInfo.companyName,
      material: primaryItem
        ? `${primaryItem.productType} (${primaryItem.materialGrade})`
        : 'Industrial Steel Inquiry',
      dimensions: dims,
      quantity: primaryItem ? `${primaryItem.quantity} ${primaryItem.quantityUnit}` : '',
      deliveryLocation: buyerInfo.deliveryLocation,
      requirements: buyerInfo.message || undefined,
    });

    trackEvent('whatsapp_click', { source_page: 'rfq_form_secondary' });
    window.open(url, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    setShowFallback(false);

    // Prepare structured payload
    const payload = {
      contactPerson: buyerInfo.contactPerson.trim(),
      companyName: buyerInfo.companyName.trim(),
      email: buyerInfo.email.trim(),
      phone: buyerInfo.phone.trim(),
      city: buyerInfo.city.trim() || undefined,
      gstNumber: buyerInfo.gstNumber.trim() || undefined,
      deliveryLocation: buyerInfo.deliveryLocation.trim() || undefined,
      requiredDeliveryDate: buyerInfo.requiredDeliveryDate || undefined,
      message: buyerInfo.message.trim() || undefined,
      website: honeypot || undefined,
      items: items.map((item) => ({
        materialGrade: item.materialGrade,
        productType: item.productType,
        od: item.od ? parseFloat(item.od) : undefined,
        idDimension: item.idDimension ? parseFloat(item.idDimension) : undefined,
        length: item.length ? parseFloat(item.length) : undefined,
        quantity: parseFloat(item.quantity) || 1,
        quantityUnit: item.quantityUnit,
        process: item.process || undefined,
        remarks: item.remarks.trim() || undefined,
      })),
    };

    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        const validationMessage = Array.isArray(data?.errors)
          ? data.errors.map((errItem: { message: string }) => errItem.message).join('. ')
          : null;

        setErrorMessage(
          validationMessage ||
            data?.message ||
            'We could not record your RFQ just now.'
        );
        setShowFallback(Boolean(data?.fallback) || !validationMessage);
        setStatus('error');
        trackEvent('rfq_submit_failed', { line_count: items.length });
        return;
      }

      const assignedNumber =
        data.inquiry?.rfqNumber || data.inquiry?.id?.slice(0, 8).toUpperCase() || 'RECEIVED';
      setGeneratedRfqNumber(assignedNumber);
      setStatus('success');
      trackEvent('rfq_submit', {
        rfq_number: assignedNumber,
        line_count: items.length,
      });

      // Reset form
      setBuyerInfo({
        contactPerson: '',
        companyName: '',
        email: '',
        phone: '',
        city: '',
        gstNumber: '',
        deliveryLocation: '',
        requiredDeliveryDate: '',
        message: '',
      });
      setItems([{ id: 'item-1', ...DEFAULT_LINE_ITEM }]);
    } catch {
      setErrorMessage('We could not connect to our RFQ intake desk just now.');
      setShowFallback(true);
      setStatus('error');
      trackEvent('rfq_submit_failed', { line_count: items.length });
    }
  };

  const inputStyle =
    'w-full bg-white/[0.04] border border-white/[0.08] focus:border-cyan-glow/40 focus:bg-white/[0.06] rounded-md px-3.5 py-2.5 text-white text-xs font-mono placeholder:text-white/25 focus:outline-none transition-colors';

  const labelStyle = 'text-[0.68rem] font-mono uppercase tracking-[0.16em] text-cyan-glow/80 block mb-1';

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 text-center py-10"
          >
            <div className="w-16 h-16 rounded-full bg-cyan-glow/10 border border-cyan-glow/30 flex items-center justify-center mx-auto mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8FD8D4" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl mb-2 text-white">RFQ Registered Successfully</h3>
            <p className="text-white/60 text-xs sm:text-sm mb-6 max-w-md mx-auto leading-relaxed">
              Your formal Request for Quotation has been logged into our procurement queue. Our technical sales desk will review tolerances, stock availability, and prepare your quote.
            </p>

            <div className="inline-flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-md px-6 py-3.5 mb-8">
              <span className="font-mono text-[0.7rem] text-white/40 uppercase tracking-[0.2em]">Official Reference:</span>
              <span className="font-mono text-cyan-glow tracking-wider font-bold text-base sm:text-lg">
                {generatedRfqNumber}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={buildRfqWhatsAppUrl({
                  name: `Ref ${generatedRfqNumber}`,
                  company: '',
                  material: `RFQ Reference: ${generatedRfqNumber}`,
                  quantity: '',
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-slate-900 shadow-md hover:bg-[#20bd5a] transition-colors"
              >
                Follow up on WhatsApp ↗
              </a>
              <button
                onClick={() => setStatus('idle')}
                className="font-mono text-xs text-white/50 hover:text-white transition-colors underline underline-offset-4"
              >
                Submit another RFQ
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <h3 className="font-display text-xl sm:text-2xl text-white">Request for Quotation (RFQ)</h3>
                <p className="text-white/50 text-xs mt-1">Multi-item steel procurement · Mazgaon Stockyard</p>
              </div>
              <span className="font-mono text-[0.65rem] uppercase tracking-wider text-cyan-glow bg-cyan-glow/10 border border-cyan-glow/20 px-2.5 py-1 rounded">
                B2B Procurement
              </span>
            </div>

            <form
              onSubmit={handleSubmit}
              onFocusCapture={() => {
                if (hasStartedRfq.current) return;
                hasStartedRfq.current = true;
                trackEvent('rfq_start', { source_page: window.location.pathname });
              }}
              className="space-y-6 relative z-10"
            >
              {/* SECTION: Buyer Details */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-[0.15em] text-white/60 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow"></span>
                  1. Buyer & Organization Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label htmlFor="rfq-contactPerson" className={labelStyle}>
                      Contact Person *
                    </label>
                    <input
                      id="rfq-contactPerson"
                      type="text"
                      name="contactPerson"
                      value={buyerInfo.contactPerson}
                      onChange={handleBuyerChange}
                      required
                      placeholder="e.g. Rajesh Sharma"
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label htmlFor="rfq-companyName" className={labelStyle}>
                      Company Name *
                    </label>
                    <input
                      id="rfq-companyName"
                      type="text"
                      name="companyName"
                      value={buyerInfo.companyName}
                      onChange={handleBuyerChange}
                      required
                      placeholder="e.g. Precision Heavy Eng. Pvt Ltd"
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label htmlFor="rfq-email" className={labelStyle}>
                      Official Email *
                    </label>
                    <input
                      id="rfq-email"
                      type="email"
                      name="email"
                      value={buyerInfo.email}
                      onChange={handleBuyerChange}
                      required
                      placeholder="purchase@company.com"
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label htmlFor="rfq-phone" className={labelStyle}>
                      Mobile / WhatsApp *
                    </label>
                    <input
                      id="rfq-phone"
                      type="tel"
                      name="phone"
                      value={buyerInfo.phone}
                      onChange={handleBuyerChange}
                      required
                      placeholder="+91 98200 00000"
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label htmlFor="rfq-city" className={labelStyle}>
                      City / Region
                    </label>
                    <input
                      id="rfq-city"
                      type="text"
                      name="city"
                      value={buyerInfo.city}
                      onChange={handleBuyerChange}
                      placeholder="e.g. Mumbai, Pune, Ahmedabad"
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label htmlFor="rfq-gstNumber" className={labelStyle}>
                      GSTIN (Optional)
                    </label>
                    <input
                      id="rfq-gstNumber"
                      type="text"
                      name="gstNumber"
                      value={buyerInfo.gstNumber}
                      onChange={handleBuyerChange}
                      placeholder="27AAAAA0000A1Z5"
                      className={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: Line Items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-mono text-xs uppercase tracking-[0.15em] text-white/60 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow"></span>
                    2. Required Material Specifications ({items.length} {items.length === 1 ? 'Item' : 'Items'})
                  </h4>
                  <button
                    type="button"
                    onClick={addItem}
                    disabled={items.length >= 20}
                    className="inline-flex items-center gap-1 font-mono text-[0.68rem] uppercase tracking-wider text-cyan-glow border border-cyan-glow/30 hover:bg-cyan-glow/10 px-2.5 py-1 rounded transition-colors"
                  >
                    + Add Line Item
                  </button>
                </div>

                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] relative group"
                    >
                      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-3">
                        <span className="font-mono text-[0.68rem] text-white/40 uppercase tracking-wider">
                          Line Item #{idx + 1}
                        </span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="text-white/30 hover:text-dawn-coral font-mono text-xs transition-colors"
                            title="Remove this item"
                          >
                            ✕ Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {/* Product Category */}
                        <div>
                          <label className={labelStyle}>Product Type *</label>
                          <select
                            value={item.productType}
                            onChange={(e) => handleItemChange(idx, 'productType', e.target.value)}
                            className={inputStyle}
                          >
                            {CANONICAL_PRODUCTS.map((prod) => (
                              <option key={prod.slug} value={prod.title} className="bg-slate text-white">
                                {prod.title}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Grade */}
                        <div>
                          <label className={labelStyle}>Material Grade *</label>
                          <select
                            value={item.materialGrade}
                            onChange={(e) => handleItemChange(idx, 'materialGrade', e.target.value)}
                            className={inputStyle}
                          >
                            {COMMON_GRADES.map((g) => (
                              <option key={g.value} value={g.value} className="bg-slate text-white">
                                {g.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Process Condition */}
                        <div>
                          <label className={labelStyle}>Supply Condition</label>
                          <select
                            value={item.process}
                            onChange={(e) => handleItemChange(idx, 'process', e.target.value)}
                            className={inputStyle}
                          >
                            {PROCESS_OPTIONS.map((opt) => (
                              <option key={opt} value={opt} className="bg-slate text-white">
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Dimensions: OD */}
                        <div>
                          <label className={labelStyle}>Outer Dia / Width (mm)</label>
                          <input
                            type="number"
                            step="any"
                            min="0"
                            value={item.od}
                            onChange={(e) => handleItemChange(idx, 'od', e.target.value)}
                            placeholder="e.g. 120"
                            className={inputStyle}
                          />
                        </div>

                        {/* Dimensions: ID (optional) */}
                        <div>
                          <label className={labelStyle}>Inner Dia / Bore (mm)</label>
                          <input
                            type="number"
                            step="any"
                            min="0"
                            value={item.idDimension}
                            onChange={(e) => handleItemChange(idx, 'idDimension', e.target.value)}
                            placeholder="Optional (tubes/bush)"
                            className={inputStyle}
                          />
                        </div>

                        {/* Dimensions: Length */}
                        <div>
                          <label className={labelStyle}>Cut Length (mm)</label>
                          <input
                            type="number"
                            step="any"
                            min="0"
                            value={item.length}
                            onChange={(e) => handleItemChange(idx, 'length', e.target.value)}
                            placeholder="e.g. 850"
                            className={inputStyle}
                          />
                        </div>

                        {/* Quantity */}
                        <div>
                          <label className={labelStyle}>Quantity *</label>
                          <input
                            type="number"
                            step="any"
                            min="0.001"
                            required
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                            placeholder="e.g. 10 or 2.5"
                            className={inputStyle}
                          />
                        </div>

                        {/* Unit */}
                        <div>
                          <label className={labelStyle}>Quantity Unit *</label>
                          <select
                            value={item.quantityUnit}
                            onChange={(e) => handleItemChange(idx, 'quantityUnit', e.target.value)}
                            className={inputStyle}
                          >
                            {QUANTITY_UNITS.map((u) => (
                              <option key={u} value={u} className="bg-slate text-white">
                                {u}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Item Remarks */}
                        <div>
                          <label className={labelStyle}>Item Tolerances / Note</label>
                          <input
                            type="text"
                            value={item.remarks}
                            onChange={(e) => handleItemChange(idx, 'remarks', e.target.value)}
                            placeholder="e.g. ±1mm tolerance, MTC needed"
                            className={inputStyle}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION: Logistics & Timeline */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-[0.15em] text-white/60 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow"></span>
                  3. Logistics & Delivery Schedule
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label htmlFor="rfq-deliveryLocation" className={labelStyle}>
                      Delivery Location / Destination
                    </label>
                    <input
                      id="rfq-deliveryLocation"
                      type="text"
                      name="deliveryLocation"
                      value={buyerInfo.deliveryLocation}
                      onChange={handleBuyerChange}
                      placeholder="e.g. Ex-Yard Mazgaon pickup or Pune Workshop"
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label htmlFor="rfq-requiredDeliveryDate" className={labelStyle}>
                      Required Delivery Date (Target)
                    </label>
                    <input
                      id="rfq-requiredDeliveryDate"
                      type="date"
                      name="requiredDeliveryDate"
                      value={buyerInfo.requiredDeliveryDate}
                      onChange={handleBuyerChange}
                      className={inputStyle}
                    />
                  </div>
                </div>

                <div className="mt-3.5">
                  <label htmlFor="rfq-message" className={labelStyle}>
                    Commercial Terms / Additional Specifications
                  </label>
                  <textarea
                    id="rfq-message"
                    rows={3}
                    name="message"
                    value={buyerInfo.message}
                    onChange={handleBuyerChange}
                    className={`${inputStyle} resize-none`}
                    placeholder="Mention UT testing, chemical test certificates (MTC 3.1), cutting schedule, payment terms..."
                  />
                </div>
              </div>

              {/* Drawing Attachment Notice (Direct to WhatsApp / Email) */}
              <div className="rounded-md border border-dashed border-white/20 bg-white/[0.02] p-3.5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="flex items-center gap-2 font-mono text-xs text-white/60">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                    Have fabrication drawings or detailed spec sheets? Send directly:
                  </span>
                  <span className="flex items-center gap-2">
                    <a
                      href={buildGeneralWhatsAppUrl(
                        `Hello Shah Industrial Enterprise,\n\nI am sending drawings and specification sheets for our RFQ.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded bg-[#25D366]/15 px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-wider text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-slate-900"
                    >
                      WhatsApp PDF
                    </a>
                    <a
                      href={`mailto:${businessConfig.email}?subject=${encodeURIComponent(
                        'Drawings & Specifications for Material RFQ'
                      )}`}
                      className="rounded bg-white/[0.06] px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-wider text-white/70 transition-colors hover:bg-white/15 hover:text-white"
                    >
                      Email Drawings
                    </a>
                  </span>
                </div>
              </div>

              {/* Honeypot field (hidden from screen readers & visual buyers) */}
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

              {/* Error Feedback */}
              {status === 'error' && (
                <div className="rounded border border-dawn-coral/25 bg-dawn-coral/10 p-3 font-mono text-xs text-dawn-coral">
                  <p>⚠ {errorMessage}</p>
                  {showFallback && (
                    <>
                      <p className="mt-2 leading-relaxed text-white/70">
                        Your RFQ could not be saved to the database. Please send your requirements directly to our yard desk via WhatsApp or phone.
                      </p>
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={handleWhatsAppInstantQuote}
                          className="rounded bg-[#25D366] px-4 py-2.5 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-slate-900 transition-colors hover:bg-[#20bd5a]"
                        >
                          Send via WhatsApp
                        </button>
                        <a
                          href={`tel:${
                            (businessConfig.contacts.find((c) => c.isPrimary) ?? businessConfig.contacts[0]).phone
                          }`}
                          className="rounded border border-white/20 px-4 py-2.5 text-center font-mono text-[0.68rem] uppercase tracking-wider text-white/80 transition-colors hover:bg-white/10"
                        >
                          Call Direct
                        </a>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Submission Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-3.5 bg-dawn-coral text-slate-900 font-bold font-mono uppercase tracking-[0.14em] text-xs rounded-md shadow-md hover:bg-[#f09770] transition-colors disabled:opacity-50"
                >
                  {status === 'submitting' ? 'Submitting Official RFQ...' : 'Submit Official RFQ →'}
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppInstantQuote}
                  className="w-full flex items-center justify-center gap-2 py-3.5 border border-[#25D366]/50 bg-[#25D366]/10 text-[#25D366] font-bold font-mono uppercase tracking-[0.14em] text-xs rounded-md hover:bg-[#25D366] hover:text-slate-900 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                  Instant WhatsApp RFQ
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
