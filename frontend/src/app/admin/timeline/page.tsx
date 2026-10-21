'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../AdminClientLayout';

interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  imagePath: string | null;
  displayOrder: number;
}

export default function TimelinePage() {
  const { token, logout } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);

  // Form states
  const [year, setYear] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchMilestones = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/timeline`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (res.status === 401) {
          logout();
          return;
        }

        const result = await res.json();
        if (result.success && isMounted) {
          setMilestones(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch milestones:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (token) {
      fetchMilestones();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [token, logout]);

  const refreshMilestones = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/timeline`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.status === 401) {
        logout();
        return;
      }
      const result = await res.json();
      if (result.success) {
        setMilestones(result.data);
      }
    } catch (err) {
      console.error('Failed to refresh milestones:', err);
    }
  };

  const openAddModal = () => {
    setEditingMilestone(null);
    setYear('');
    setTitle('');
    setDescription('');
    setDisplayOrder(0);
    setIsModalOpen(true);
  };

  const openEditModal = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setYear(milestone.year);
    setTitle(milestone.title);
    setDescription(milestone.description);
    setDisplayOrder(milestone.displayOrder);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      year,
      title,
      description,
      displayOrder,
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      let res;
      if (editingMilestone) {
        res = await fetch(`${apiUrl}/api/timeline/${editingMilestone.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${apiUrl}/api/timeline`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (res.status === 401) {
        logout();
        return;
      }

      const result = await res.json();
      if (result.success) {
        refreshMilestones();
        setIsModalOpen(false);
      } else {
        alert(result.message || 'Error saving milestone');
      }
    } catch (err) {
      console.error('Error saving milestone:', err);
      alert('Error saving milestone');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this milestone?')) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/timeline/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.status === 401) {
        logout();
        return;
      }

      const result = await res.json();
      if (result.success) {
        setMilestones((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error('Error deleting milestone:', err);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-10">
        <div>
          <span className="font-mono text-[0.65rem] text-cyan-glow/70 tracking-[0.25em] uppercase block mb-1">
            Legacy Log
          </span>
          <h2 className="font-display text-white text-2xl sm:text-3xl font-bold">Timeline Milestones</h2>
        </div>
        <button
          onClick={openAddModal}
          className="w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-cyan-glow text-slate font-mono text-[0.75rem] font-semibold uppercase tracking-wider rounded-lg hover:shadow-[0_0_20px_rgba(143,216,212,0.15)] active:scale-[0.99] transition-all duration-300 min-h-[44px] flex items-center justify-center gap-1.5"
        >
          <span>+ Add Milestone</span>
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-cyan-glow/30 border-t-cyan-glow rounded-full animate-spin" />
        </div>
      ) : milestones.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-white/[0.01] border border-white/[0.04]">
          <p className="text-white/30 font-mono text-sm">No historical milestones created.</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-[800px]">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="bg-white/[0.01] border border-white/[0.06] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between items-start sm:items-center shadow-lg"
            >
              <div className="flex items-start gap-4">
                <span className="font-mono text-cyan-glow font-bold text-lg sm:text-xl shrink-0 mt-0.5 min-w-[60px]">
                  {milestone.year}
                </span>
                <div>
                  <h3 className="text-white font-display text-base sm:text-lg font-semibold mb-1">{milestone.title}</h3>
                  <p className="text-white/60 text-xs leading-relaxed max-w-[500px]">{milestone.description}</p>
                </div>
              </div>

              <div className="flex gap-2.5 w-full sm:w-auto shrink-0 justify-end pt-2 sm:pt-0 border-t sm:border-0 border-white/[0.04]">
                <button
                  onClick={() => openEditModal(milestone)}
                  className="flex-1 sm:flex-initial px-4 py-2 border border-white/[0.08] hover:border-cyan-glow/30 hover:bg-cyan-glow/[0.04] text-white/70 hover:text-cyan-glow font-mono text-[0.75rem] uppercase tracking-wider rounded-lg transition-all duration-200 min-h-[38px] flex items-center justify-center"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(milestone.id)}
                  className="px-3.5 py-2 border border-white/[0.08] hover:border-dawn-coral/30 hover:bg-dawn-coral/[0.04] text-white/30 hover:text-dawn-coral rounded-lg transition-all duration-200 min-h-[38px] flex items-center justify-center"
                  title="Delete milestone"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-slate/85 backdrop-blur-sm">
          <div className="w-full max-w-[500px] max-h-[92vh] sm:max-h-[90vh] overflow-y-auto bg-slate ring-1 ring-white/[0.08] rounded-t-2xl sm:rounded-2xl p-5 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="font-display text-white text-lg sm:text-xl font-bold">
                {editingMilestone ? 'Edit Milestone' : 'Add New Milestone'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-white/50 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <label className="text-[0.65rem] font-mono uppercase tracking-wider text-white/60 block">Year</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white text-base sm:text-xs font-mono focus:outline-none focus:border-cyan-glow/40 min-h-[42px]"
                    placeholder="e.g. 1989 or TODAY"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[0.65rem] font-mono uppercase tracking-wider text-white/60 block">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                    required
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white text-base sm:text-xs font-mono focus:outline-none focus:border-cyan-glow/40 min-h-[42px]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[0.65rem] font-mono uppercase tracking-wider text-white/60 block">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white text-base sm:text-xs font-mono focus:outline-none focus:border-cyan-glow/40 min-h-[42px]"
                  placeholder="e.g. The Foundation"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[0.65rem] font-mono uppercase tracking-wider text-white/60 block">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-base sm:text-xs font-mono resize-none focus:outline-none focus:border-cyan-glow/40"
                  placeholder="Tell the history details..."
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:flex-1 py-3 border border-white/[0.08] hover:bg-white/[0.03] text-white/60 font-mono text-xs uppercase tracking-wider rounded-lg transition-all duration-200 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-3 bg-cyan-glow text-slate font-mono text-xs uppercase tracking-wider font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(143,216,212,0.15)] active:scale-[0.99] transition-all duration-200 min-h-[44px]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
