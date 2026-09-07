'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../layout';

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

export default function InquiriesPage() {
  const { token, logout } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notesText, setNotesText] = useState('');
  const [statusVal, setStatusVal] = useState<InquiryStatus>('NEW');

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
        return 'text-white/40 bg-white/5 border-white/10';
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

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <span className="font-mono text-[0.65rem] text-cyan-glow/70 tracking-[0.25em] uppercase block mb-1">
            Procurement Pipeline
          </span>
          <h2 className="font-display text-white text-3xl font-bold">Inquiries & RFQs</h2>
        </div>
        <button
          onClick={fetchInquiries}
          className="px-4 py-2 border border-white/[0.08] hover:border-cyan-glow/30 bg-white/[0.02] text-white/60 hover:text-cyan-glow font-mono text-[0.75rem] uppercase tracking-wider rounded transition-all duration-300"
        >
          ↻ Refresh Feed
        </button>
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
        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1.1fr] gap-8 items-start">
          {/* Table Container */}
          <div className="bg-white/[0.01] border border-white/[0.06] rounded-lg overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02] text-white/50 font-mono text-[0.65rem] tracking-[0.1em] uppercase">
                    <th className="px-6 py-4">RFQ # / Client</th>
                    <th className="px-6 py-4">Source</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-[0.85rem]">
                  {inquiries.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => handleSelectInquiry(item)}
                      className={`cursor-pointer transition-colors duration-200 ${
                        selectedInquiry?.id === item.id
                          ? 'bg-cyan-glow/[0.04]'
                          : 'hover:bg-white/[0.02]'
                      }`}
                    >
                      <td className="px-6 py-4">
                        {item.rfqNumber ? (
                          <div className="font-mono text-xs font-bold text-cyan-glow mb-0.5">
                            {item.rfqNumber}
                          </div>
                        ) : null}
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="text-white/40 text-[0.75rem] font-mono mt-0.5">{item.company}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-[0.65rem] text-white/50 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                          {item.source || 'LEGACY'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-white/50 text-xs">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[0.65rem] font-mono border ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
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

          {/* Details Container */}
          <div>
            {selectedInquiry ? (
              <div className="bg-white/[0.02] ring-1 ring-white/[0.08] rounded-lg p-6 lg:p-8 space-y-6">
                <div>
                  {selectedInquiry.rfqNumber && (
                    <span className="inline-block font-mono text-xs px-2.5 py-1 bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow rounded font-bold mb-2">
                      {selectedInquiry.rfqNumber}
                    </span>
                  )}
                  <h3 className="text-white font-display text-xl leading-snug">{selectedInquiry.name}</h3>
                  <p className="font-mono text-xs text-cyan-glow mt-0.5">{selectedInquiry.company}</p>
                </div>

                {/* Buyer / Contact Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-white/[0.02] rounded border border-white/[0.04] font-mono text-xs text-white/80">
                  <div>
                    <span className="text-[0.65rem] uppercase tracking-wider text-white/40 block mb-0.5">
                      Contact Info
                    </span>
                    <span>{selectedInquiry.contactInfo}</span>
                  </div>
                  {selectedInquiry.city && (
                    <div>
                      <span className="text-[0.65rem] uppercase tracking-wider text-white/40 block mb-0.5">
                        City
                      </span>
                      <span>{selectedInquiry.city}</span>
                    </div>
                  )}
                  {selectedInquiry.gstNumber && (
                    <div>
                      <span className="text-[0.65rem] uppercase tracking-wider text-white/40 block mb-0.5">
                        GSTIN
                      </span>
                      <span>{selectedInquiry.gstNumber}</span>
                    </div>
                  )}
                  {selectedInquiry.deliveryLocation && (
                    <div>
                      <span className="text-[0.65rem] uppercase tracking-wider text-white/40 block mb-0.5">
                        Destination
                      </span>
                      <span>{selectedInquiry.deliveryLocation}</span>
                    </div>
                  )}
                  {selectedInquiry.requiredDeliveryDate && (
                    <div>
                      <span className="text-[0.65rem] uppercase tracking-wider text-white/40 block mb-0.5">
                        Target Date
                      </span>
                      <span className="text-cyan-glow font-bold">
                        {selectedInquiry.requiredDeliveryDate}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-[0.65rem] uppercase tracking-wider text-white/40 block mb-0.5">
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
                    <div className="overflow-x-auto rounded border border-white/[0.06] bg-white/[0.01]">
                      <table className="w-full text-left font-mono text-[0.72rem]">
                        <thead>
                          <tr className="border-b border-white/[0.06] bg-white/[0.02] text-white/40 uppercase text-[0.62rem]">
                            <th className="p-2.5">Material & Grade</th>
                            <th className="p-2.5">Dimensions (mm)</th>
                            <th className="p-2.5">Quantity</th>
                            <th className="p-2.5">Condition</th>
                            <th className="p-2.5">Notes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {selectedInquiry.items.map((it, idx) => (
                            <tr key={it.id || idx}>
                              <td className="p-2.5 text-white font-semibold">
                                <div>{it.materialGrade}</div>
                                <div className="text-white/40 text-[0.65rem] font-normal">{it.productType}</div>
                              </td>
                              <td className="p-2.5 text-white/70">
                                {[
                                  it.od != null ? `OD: Ø${it.od}` : null,
                                  it.idDimension != null ? `ID: Ø${it.idDimension}` : null,
                                  it.length != null ? `L: ${it.length}` : null,
                                ]
                                  .filter(Boolean)
                                  .join(' × ') || 'Standard'}
                              </td>
                              <td className="p-2.5 text-cyan-glow font-bold">
                                {it.quantity} {it.quantityUnit}
                              </td>
                              <td className="p-2.5 text-white/60">{it.process || 'Standard'}</td>
                              <td className="p-2.5 text-white/50 text-[0.65rem]">{it.remarks || '—'}</td>
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
                    <span className="text-[0.65rem] font-mono uppercase tracking-wider text-white/30 block">
                      Enquiry Requirements
                    </span>
                    <div className="p-4 rounded bg-white/[0.03] border border-white/[0.06] text-white/80 whitespace-pre-wrap leading-relaxed text-[0.8rem] font-mono">
                      {selectedInquiry.requirements}
                    </div>
                  </div>
                )}

                {/* Update Status & Notes */}
                <div className="border-t border-white/[0.06] pt-6 space-y-4">
                  <div className="space-y-2">
                    <span className="text-[0.65rem] font-mono uppercase tracking-wider text-white/30 block">
                      Pipeline Stage
                    </span>
                    <select
                      value={statusVal}
                      onChange={(e) => setStatusVal(e.target.value as InquiryStatus)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] text-white text-xs font-mono rounded px-3 py-2 focus:outline-none focus:border-cyan-glow/40 transition-colors"
                    >
                      {ALL_STATUSES.map((st) => (
                        <option key={st} value={st} className="bg-slate text-white">
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[0.65rem] font-mono uppercase tracking-wider text-white/30 block">
                      Internal Staff Notes
                    </span>
                    <textarea
                      rows={3}
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] text-white text-xs font-mono rounded px-3 py-2 resize-none focus:outline-none focus:border-cyan-glow/40 transition-colors"
                      placeholder="e.g. Quoted rate ₹85/kg on 14th Jul. Awaiting buyer PO."
                    />
                  </div>

                  <button
                    onClick={handleUpdateInquiry}
                    disabled={updating}
                    className="w-full py-3 bg-cyan-glow text-slate font-mono uppercase tracking-wider text-xs font-semibold rounded hover:shadow-[0_0_20px_rgba(143,216,212,0.15)] transition-all duration-300 disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Save Notes & Status'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden xl:flex h-64 border border-dashed border-white/[0.08] rounded-lg items-center justify-center text-center p-8">
                <div>
                  <p className="text-white/25 font-mono text-xs">
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
