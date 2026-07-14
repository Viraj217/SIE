'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../layout';

type InquiryStatus = 'PENDING' | 'REVIEWED' | 'CONTACTED' | 'QUOTED' | 'ARCHIVED';

interface Inquiry {
  id: string;
  name: string;
  company: string;
  contactInfo: string;
  requirements: string;
  status: InquiryStatus;
  notes: string | null;
  createdAt: string;
}

export default function InquiriesPage() {
  const { token, logout } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notesText, setNotesText] = useState('');
  const [statusVal, setStatusVal] = useState<InquiryStatus>('PENDING');

  const fetchInquiries = async () => {
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
  };

  useEffect(() => {
    if (token) {
      fetchInquiries();
    }
  }, [token]);

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
        // Refresh inquiry details locally
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
    if (!confirm('Are you sure you want to permanently delete this inquiry?')) return;

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
      case 'PENDING':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'REVIEWED':
        return 'text-cyan-glow bg-cyan-glow/10 border-cyan-glow/30';
      case 'CONTACTED':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'QUOTED':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
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
            Telemetry Feed
          </span>
          <h2 className="font-display text-white text-3xl font-bold">Incoming Inquiries</h2>
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
          <p className="text-white/30 font-mono text-sm">No inquiries in system database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-8 items-start">
          {/* Table Container */}
          <div className="bg-white/[0.01] border border-white/[0.06] rounded-lg overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02] text-white/50 font-mono text-[0.65rem] tracking-[0.1em] uppercase">
                    <th className="px-6 py-4">Client / Company</th>
                    <th className="px-6 py-4">Submitted</th>
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
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="text-white/40 text-[0.75rem] font-mono mt-0.5">{item.company}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-white/50 text-xs">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[0.65rem] font-mono border ${getStatusColor(item.status)}`}>
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
                  <h3 className="text-white font-display text-xl leading-snug">{selectedInquiry.name}</h3>
                  <p className="font-mono text-xs text-cyan-glow mt-1">{selectedInquiry.company}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[0.65rem] font-mono uppercase tracking-wider text-white/30">Contact Info</span>
                  <p className="text-white/80 font-mono text-xs">{selectedInquiry.contactInfo}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-[0.65rem] font-mono uppercase tracking-wider text-white/30 block">Requirements</span>
                  <div className="p-4 rounded bg-white/[0.03] border border-white/[0.06] text-white/80 whitespace-pre-wrap leading-relaxed text-[0.8rem]">
                    {selectedInquiry.requirements}
                  </div>
                </div>

                <div className="border-t border-white/[0.06] pt-6 space-y-4">
                  <div className="space-y-2">
                    <span className="text-[0.65rem] font-mono uppercase tracking-wider text-white/30 block">Update Status</span>
                    <select
                      value={statusVal}
                      onChange={(e) => setStatusVal(e.target.value as InquiryStatus)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] text-white text-xs font-mono rounded px-3 py-2 focus:outline-none focus:border-cyan-glow/40 transition-colors"
                    >
                      <option value="PENDING" className="bg-slate text-white">PENDING</option>
                      <option value="REVIEWED" className="bg-slate text-white">REVIEWED</option>
                      <option value="CONTACTED" className="bg-slate text-white">CONTACTED</option>
                      <option value="QUOTED" className="bg-slate text-white">QUOTED</option>
                      <option value="ARCHIVED" className="bg-slate text-white">ARCHIVED</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[0.65rem] font-mono uppercase tracking-wider text-white/30 block">Staff Notes (Internal)</span>
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
                  <p className="text-white/25 font-mono text-xs">Select an inquiry to view specs & manage state.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
