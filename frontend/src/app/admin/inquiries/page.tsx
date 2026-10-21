'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AdminClientLayout';

export type InquiryStatus =
  // Legacy
  | 'PENDING'
  | 'REVIEWED'
  | 'CONTACTED'
  | 'QUOTED'
  | 'ARCHIVED'
  // Pipeline CRM
  | 'NEW'
  | 'REVIEWING'
  | 'CLARIFICATION_REQUIRED'
  | 'QUOTE_PREPARING'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST'
  | 'DORMANT';

export interface InquiryItem {
  id: string;
  materialGrade: string;
  productType: string;
  od: number | string | null;
  idDimension: number | string | null;
  length: number | string | null;
  quantity: number | string;
  quantityUnit: string;
  process: string | null;
  remarks: string | null;
}

export interface Inquiry {
  id: string;
  rfqNumber: string | null;
  name: string;
  company: string;
  contactInfo: string;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  gstNumber?: string | null;
  deliveryLocation?: string | null;
  requiredDeliveryDate?: string | null;
  message?: string | null;
  requirements: string | null;
  source: string;
  status: InquiryStatus;
  notes: string | null;
  createdAt: string;
  items?: InquiryItem[];
}

const ALL_STATUSES: InquiryStatus[] = [
  'NEW',
  'REVIEWING',
  'CLARIFICATION_REQUIRED',
  'QUOTE_PREPARING',
  'QUOTED',
  'NEGOTIATION',
  'WON',
  'LOST',
  'DORMANT',
  'PENDING',
  'REVIEWED',
  'CONTACTED',
  'ARCHIVED',
];

const generateQuoteTemplate = (inquiry: Inquiry) => {
  let text = `Hello ${inquiry.contactPerson || inquiry.name || 'there'},\n\nThank you for reaching out to Shah Industrial Enterprise.\n`;
  if (inquiry.rfqNumber) {
    text += `Regarding your RFQ (${inquiry.rfqNumber}), here is our quotation:\n\n`;
  } else {
    text += `Regarding your inquiry, here is our quotation:\n\n`;
  }

  if (inquiry.items && inquiry.items.length > 0) {
    inquiry.items.forEach((it, idx) => {
      text += `${idx + 1}. ${it.materialGrade} - ${it.productType}\n`;
      const dims = [
        it.od != null ? `OD: Ø${it.od}mm` : null,
        it.idDimension != null ? `ID: Ø${it.idDimension}mm` : null,
        it.length != null ? `L: ${it.length}mm` : null,
      ].filter(Boolean).join(' x ');
      if (dims) text += `   Dimensions: ${dims}\n`;
      text += `   Quantity: ${it.quantity} ${it.quantityUnit}\n`;
      text += `   Price: [Insert Price Here]\n\n`;
    });
  } else if (inquiry.requirements) {
    text += `Your Requirements:\n${inquiry.requirements}\n\n`;
    text += `Price: [Insert Price Here]\n\n`;
  }

  text += `Please let us know if you have any questions or need further clarification.\n\nBest regards,\nShah Industrial Enterprise`;
  
  return encodeURIComponent(text);
};

const getGmailLink = (inquiry: Inquiry) => {
  const subject = encodeURIComponent(`Quotation from Shah Industrial Enterprise${inquiry.rfqNumber ? ` - RFQ ${inquiry.rfqNumber}` : ''}`);
  const body = generateQuoteTemplate(inquiry);
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${inquiry.email || ''}&su=${subject}&body=${body}`;
};

const getWhatsAppLink = (inquiry: Inquiry) => {
  if (!inquiry.phone) return '#';
  // Clean phone number: remove all non-digits except '+'
  let phoneStr = inquiry.phone.replace(/[^\d+]/g, '');
  if (!phoneStr.startsWith('+')) {
    // Check if it already has country code (e.g., 91xxxx), if not, assume Indian +91
    if (phoneStr.length === 10) {
      phoneStr = `+91${phoneStr}`;
    } else if (phoneStr.length > 10 && !phoneStr.startsWith('+91') && phoneStr.startsWith('91')) {
       phoneStr = `+${phoneStr}`;
    }
  }
  const text = generateQuoteTemplate(inquiry);
  return `https://wa.me/${phoneStr.replace('+', '')}?text=${text}`;
};

const getCallLink = (inquiry: Inquiry) => {
  if (!inquiry.phone) return '#';
  return `tel:${inquiry.phone.replace(/[^\d+]/g, '')}`;
};

export default function InquiriesPage() {
  const { token, logout } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notesText, setNotesText] = useState('');
  const [statusVal, setStatusVal] = useState<InquiryStatus>('NEW');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchInquiries = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/inquiries`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        logout();
        return;
      }

      const result = await res.json();
      if (result.success) {
        setInquiries(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/inquiries`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          logout();
          return;
        }

        const result = await res.json();
        if (!ignore && result.success) {
          setInquiries(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch inquiries:', err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    if (token) {
      void loadData();
    } else {
      setLoading(false);
    }

    return () => {
      ignore = true;
    };
  }, [token, logout]);

  const handleSelectInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setNotesText(inquiry.notes || '');
    setStatusVal(inquiry.status);
    if (typeof window !== 'undefined' && window.innerWidth < 1280) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleUpdateInquiry = async () => {
    if (!selectedInquiry) return;
    setUpdating(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/inquiries/${selectedInquiry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: statusVal,
          notes: notesText,
        }),
      });

      if (res.status === 401) {
        logout();
        return;
      }

      const result = await res.json();
      if (result.success) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === selectedInquiry.id ? result.data : item))
        );
        setSelectedInquiry(result.data);
        alert('Inquiry updated successfully!');
      }
    } catch (err) {
      console.error('Failed to update inquiry:', err);
      alert('Error updating inquiry.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this record?')) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/inquiries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        logout();
        return;
      }

      const result = await res.json();
      if (result.success) {
        setInquiries((prev) => prev.filter((item) => item.id !== id));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
    }
  };

  const getStatusColor = (status: InquiryStatus) => {
    switch (status) {
      case 'NEW':
        return 'text-cyan-glow bg-cyan-glow/10 border-cyan-glow/30';
      case 'REVIEWING':
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
      case 'CLARIFICATION_REQUIRED':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'QUOTE_PREPARING':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
      case 'QUOTED':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'NEGOTIATION':
        return 'text-teal-400 bg-teal-500/10 border-teal-500/30';
      case 'WON':
        return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40 font-bold';
      case 'LOST':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'DORMANT':
        return 'text-white/60 bg-white/5 border-white/10';
      case 'PENDING':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'REVIEWED':
        return 'text-cyan-glow bg-cyan-glow/10 border-cyan-glow/30';
      case 'CONTACTED':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'ARCHIVED':
        return 'text-white/30 bg-white/5 border-white/10';
      default:
        return 'text-white bg-white/10 border-white/20';
    }
  };

  const filteredInquiries = inquiries.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name?.toLowerCase().includes(q) ||
      item.company?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q) ||
      item.phone?.toLowerCase().includes(q) ||
      (item.rfqNumber && item.rfqNumber.toLowerCase().includes(q));
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const newInquiriesCount = inquiries.filter((i) => i.status === 'NEW' || i.status === 'PENDING').length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 sm:mb-8">
        <div>
          <span className="font-mono text-[0.65rem] text-cyan-glow/70 tracking-[0.25em] uppercase block mb-1">
            Procurement Pipeline
          </span>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-white text-2xl sm:text-3xl font-bold">Inquiries & RFQs</h2>
            {newInquiriesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-cyan-glow/15 text-cyan-glow border border-cyan-glow/30 font-mono text-[0.65rem] font-bold">
                {newInquiriesCount} new
              </span>
            )}
          </div>
        </div>
        <button
          onClick={fetchInquiries}
          className="w-full sm:w-auto px-4 py-2.5 border border-white/[0.08] hover:border-cyan-glow/30 bg-white/[0.02] text-white/70 hover:text-cyan-glow font-mono text-[0.75rem] uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center justify-center gap-2 min-h-[40px]"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Feed
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search RFQ #, client, company, phone..."
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg pl-9 pr-8 py-2.5 text-white text-base sm:text-xs font-mono placeholder:text-white/30 focus:outline-none focus:border-cyan-glow/40 transition-colors min-h-[42px]"
          />
          <svg
            className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs font-mono"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/[0.03] border border-white/[0.08] text-white text-base sm:text-xs font-mono rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-glow/40 transition-colors min-h-[42px] flex-1 sm:flex-initial"
          >
            <option value="ALL" className="bg-slate text-white">All Statuses ({inquiries.length})</option>
            {ALL_STATUSES.map((st) => (
              <option key={st} value={st} className="bg-slate text-white">
                {st} ({inquiries.filter((i) => i.status === st).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-cyan-glow/30 border-t-cyan-glow rounded-full animate-spin" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-white/[0.01] border border-white/[0.04]">
          <p className="text-white/30 font-mono text-sm">No inquiries or RFQs in database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1.1fr] gap-6 xl:gap-8 items-start">
          {/* List Section: On mobile (< xl), hidden when an inquiry is selected */}
          <div className={`${selectedInquiry ? 'hidden xl:block' : 'block'}`}>
            {filteredInquiries.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-white/[0.01] border border-white/[0.04]">
                <p className="text-white/40 font-mono text-xs">No matching inquiries found.</p>
              </div>
            ) : (
              <>
                {/* Mobile Cards View (< md) */}
                <div className="md:hidden space-y-3">
                  {filteredInquiries.map((item) => {
                    const isSelected = selectedInquiry?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectInquiry(item)}
                        className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-glow/[0.08] border-cyan-glow/40 shadow-[0_0_15px_rgba(143,216,212,0.1)]'
                            : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div className="min-w-0 flex-1">
                            {item.rfqNumber && (
                              <span className="inline-block font-mono text-[0.65rem] font-bold text-cyan-glow bg-cyan-glow/10 border border-cyan-glow/30 px-2 py-0.5 rounded mb-1">
                                {item.rfqNumber}
                              </span>
                            )}
                            <h3 className="font-semibold text-white text-base truncate">{item.name}</h3>
                            <p className="text-white/70 text-xs font-mono truncate">{item.company || 'Individual Client'}</p>
                          </div>
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[0.65rem] font-mono border shrink-0 ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-white/40 font-mono text-[0.68rem] mb-3">
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="bg-white/[0.04] px-1.5 py-0.2 rounded border border-white/[0.06]">
                            {item.source || 'LEGACY'}
                          </span>
                          {item.items && item.items.length > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-cyan-glow">{item.items.length} items</span>
                            </>
                          )}
                        </div>

                        {/* Quick action buttons row on card */}
                        <div
                          className="flex items-center gap-2 pt-3 border-t border-white/[0.06]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.phone && (
                            <a
                              href={getWhatsAppLink(item)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-2 px-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg font-mono text-[0.7rem] flex items-center justify-center gap-1.5 transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                              WhatsApp
                            </a>
                          )}
                          {item.phone && (
                            <a
                              href={getCallLink(item)}
                              className="py-2 px-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg font-mono text-[0.7rem] flex items-center justify-center gap-1 transition-colors"
                              title="Call phone"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            </a>
                          )}
                          <button
                            onClick={() => handleSelectInquiry(item)}
                            className="py-2 px-3 bg-white/[0.04] hover:bg-white/[0.08] text-white/80 rounded-lg font-mono text-[0.7rem] flex items-center justify-center gap-1 transition-colors"
                          >
                            Details →
                          </button>
                          <button
                            onClick={() => handleDeleteInquiry(item.id)}
                            className="p-2 text-white/30 hover:text-dawn-coral hover:bg-dawn-coral/10 rounded-lg transition-colors ml-auto"
                            title="Delete permanently"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tablet & Desktop Table View (>= md) */}
                <div className="hidden md:block bg-white/[0.01] border border-white/[0.06] rounded-xl overflow-hidden backdrop-blur-sm shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/[0.06] bg-white/[0.02] text-white/50 font-mono text-[0.65rem] tracking-[0.1em] uppercase">
                          <th className="px-5 py-3.5">RFQ # / Client</th>
                          <th className="px-4 py-3.5">Source</th>
                          <th className="px-4 py-3.5">Date</th>
                          <th className="px-4 py-3.5">Status</th>
                          <th className="px-4 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04] text-[0.85rem]">
                        {filteredInquiries.map((item) => (
                          <tr
                            key={item.id}
                            onClick={() => handleSelectInquiry(item)}
                            className={`cursor-pointer transition-colors duration-200 ${
                              selectedInquiry?.id === item.id
                                ? 'bg-cyan-glow/[0.06]'
                                : 'hover:bg-white/[0.02]'
                            }`}
                          >
                            <td className="px-5 py-3.5">
                              {item.rfqNumber ? (
                                <div className="font-mono text-xs font-bold text-cyan-glow mb-0.5">
                                  {item.rfqNumber}
                                </div>
                              ) : null}
                              <div className="font-semibold text-white">{item.name}</div>
                              <div className="text-white/60 text-[0.75rem] font-mono mt-0.5">{item.company}</div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="font-mono text-[0.65rem] text-white/50 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                                {item.source || 'LEGACY'}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 font-mono text-white/50 text-xs whitespace-nowrap">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded text-[0.65rem] font-mono border ${getStatusColor(
                                  item.status
                                )}`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleDeleteInquiry(item.id)}
                                className="p-1.5 text-white/20 hover:text-dawn-coral hover:bg-dawn-coral/10 rounded transition-all duration-200"
                                title="Delete Permanently"
                              >
                                🗑
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Details Section: On mobile (< xl), shown only when an inquiry is selected */}
          <div className={`${selectedInquiry ? 'block' : 'hidden xl:block'}`}>
            {selectedInquiry ? (
              <div className="bg-white/[0.02] ring-1 ring-white/[0.08] rounded-xl p-5 sm:p-6 lg:p-8 space-y-6 shadow-2xl">
                {/* Mobile Back Button (< xl) */}
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="xl:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white/90 font-mono text-xs uppercase tracking-wider border border-white/[0.1] transition-colors"
                >
                  <svg className="w-4 h-4 text-cyan-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Inquiries List
                </button>

                <div className="border-b border-white/[0.06] pb-4">
                  {selectedInquiry.rfqNumber && (
                    <span className="inline-block font-mono text-xs px-2.5 py-1 bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow rounded font-bold mb-2">
                      {selectedInquiry.rfqNumber}
                    </span>
                  )}
                  <h3 className="text-white font-display text-xl sm:text-2xl leading-snug">{selectedInquiry.name}</h3>
                  <p className="font-mono text-xs text-cyan-glow mt-0.5">{selectedInquiry.company || 'Individual Client'}</p>
                </div>

                {/* Quick Contact Actions */}
                <div>
                  <span className="text-[0.65rem] font-mono uppercase tracking-wider text-white/40 block mb-2">
                    Quick Contact Actions
                  </span>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {selectedInquiry.email && (
                      <a 
                        href={getGmailLink(selectedInquiry)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-mono text-xs rounded-lg transition-colors flex-1 sm:flex-initial justify-center min-h-[38px]"
                      >
                        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
                        <span>Email (Gmail)</span>
                      </a>
                    )}
                    {selectedInquiry.phone && (
                      <a 
                        href={getWhatsAppLink(selectedInquiry)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 font-mono text-xs rounded-lg transition-colors flex-1 sm:flex-initial justify-center min-h-[38px]"
                      >
                        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        <span>WhatsApp</span>
                      </a>
                    )}
                    {selectedInquiry.phone && (
                      <a 
                        href={getCallLink(selectedInquiry)} 
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 font-mono text-xs rounded-lg transition-colors flex-1 sm:flex-initial justify-center min-h-[38px]"
                      >
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        <span>Call</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Buyer / Contact Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-white/[0.02] rounded-xl border border-white/[0.05] font-mono text-xs text-white/80">
                  <div>
                    <span className="text-[0.65rem] uppercase tracking-wider text-white/50 block mb-0.5">
                      Contact Info
                    </span>
                    <span className="text-white break-all">{selectedInquiry.contactInfo}</span>
                  </div>
                  {selectedInquiry.city && (
                    <div>
                      <span className="text-[0.65rem] uppercase tracking-wider text-white/50 block mb-0.5">
                        City
                      </span>
                      <span>{selectedInquiry.city}</span>
                    </div>
                  )}
                  {selectedInquiry.gstNumber && (
                    <div>
                      <span className="text-[0.65rem] uppercase tracking-wider text-white/50 block mb-0.5">
                        GSTIN
                      </span>
                      <span>{selectedInquiry.gstNumber}</span>
                    </div>
                  )}
                  {selectedInquiry.deliveryLocation && (
                    <div>
                      <span className="text-[0.65rem] uppercase tracking-wider text-white/50 block mb-0.5">
                        Destination
                      </span>
                      <span>{selectedInquiry.deliveryLocation}</span>
                    </div>
                  )}
                  {selectedInquiry.requiredDeliveryDate && (
                    <div>
                      <span className="text-[0.65rem] uppercase tracking-wider text-white/50 block mb-0.5">
                        Target Date
                      </span>
                      <span className="text-cyan-glow font-bold">
                        {selectedInquiry.requiredDeliveryDate}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-[0.65rem] uppercase tracking-wider text-white/50 block mb-0.5">
                      Intake Source
                    </span>
                    <span>{selectedInquiry.source}</span>
                  </div>
                </div>

                {/* Structured Line Items (if present) */}
                {selectedInquiry.items && selectedInquiry.items.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[0.68rem] font-mono uppercase tracking-wider text-cyan-glow/80 block">
                      Line Items ({selectedInquiry.items.length})
                    </span>
                    <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-white/[0.01]">
                      <table className="w-full text-left font-mono text-[0.72rem] min-w-[500px]">
                        <thead>
                          <tr className="border-b border-white/[0.06] bg-white/[0.02] text-white/60 uppercase text-[0.62rem]">
                            <th className="p-3">Material & Grade</th>
                            <th className="p-3">Dimensions (mm)</th>
                            <th className="p-3">Quantity</th>
                            <th className="p-3">Condition</th>
                            <th className="p-3">Notes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {selectedInquiry.items.map((it, idx) => (
                            <tr key={it.id || idx}>
                              <td className="p-3 text-white font-semibold">
                                <div>{it.materialGrade}</div>
                                <div className="text-white/60 text-[0.65rem] font-normal">{it.productType}</div>
                              </td>
                              <td className="p-3 text-white/70">
                                {[
                                  it.od != null ? `OD: Ø${it.od}` : null,
                                  it.idDimension != null ? `ID: Ø${it.idDimension}` : null,
                                  it.length != null ? `L: ${it.length}` : null,
                                ]
                                  .filter(Boolean)
                                  .join(' × ') || 'Standard'}
                              </td>
                              <td className="p-3 text-cyan-glow font-bold">
                                {it.quantity} {it.quantityUnit}
                              </td>
                              <td className="p-3 text-white/60">{it.process || 'Standard'}</td>
                              <td className="p-3 text-white/50 text-[0.65rem]">{it.remarks || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Legacy Requirements / Notes */}
                {selectedInquiry.requirements && (
                  <div className="space-y-2">
                    <span className="text-[0.65rem] font-mono uppercase tracking-wider text-white/40 block">
                      Enquiry Requirements
                    </span>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/80 whitespace-pre-wrap leading-relaxed text-[0.8rem] font-mono break-words">
                      {selectedInquiry.requirements}
                    </div>
                  </div>
                )}

                {/* Update Status & Notes */}
                <div className="border-t border-white/[0.06] pt-6 space-y-4">
                  <div className="space-y-2">
                    <span className="text-[0.65rem] font-mono uppercase tracking-wider text-white/40 block">
                      Pipeline Stage
                    </span>
                    <select
                      value={statusVal}
                      onChange={(e) => setStatusVal(e.target.value as InquiryStatus)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] text-white text-base sm:text-xs font-mono rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-glow/40 transition-colors min-h-[42px]"
                    >
                      {ALL_STATUSES.map((st) => (
                        <option key={st} value={st} className="bg-slate text-white">
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[0.65rem] font-mono uppercase tracking-wider text-white/40 block">
                      Internal Staff Notes
                    </span>
                    <textarea
                      rows={3}
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] text-white text-base sm:text-xs font-mono rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:border-cyan-glow/40 transition-colors"
                      placeholder="e.g. Quoted rate ₹85/kg on 14th Jul. Awaiting buyer PO."
                    />
                  </div>

                  <button
                    onClick={handleUpdateInquiry}
                    disabled={updating}
                    className="w-full py-3.5 bg-cyan-glow text-slate font-mono uppercase tracking-wider text-xs font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(143,216,212,0.15)] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 min-h-[48px]"
                  >
                    {updating ? 'Updating...' : 'Save Notes & Status'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden xl:flex h-64 border border-dashed border-white/[0.08] rounded-xl items-center justify-center text-center p-8">
                <div>
                  <p className="text-white/30 font-mono text-xs">
                    Select an inquiry or RFQ to view specifications & manage status.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
