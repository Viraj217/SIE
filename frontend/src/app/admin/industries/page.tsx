'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../AdminClientLayout';

interface Sector {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  displayOrder: number;
}

export default function IndustriesPage() {
  const { token, logout } = useAuth();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Factory');
  const [displayOrder, setDisplayOrder] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/industries`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (res.status === 401) {
          logout();
          return;
        }

        const result = await res.json();
        if (!ignore && result.success) {
          setSectors(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch sectors:', err);
      } finally {
        if (!ignore) setLoading(false);
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

  const refreshSectors = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/industries`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.status === 401) {
        logout();
        return;
      }
      const result = await res.json();
      if (result.success) {
        setSectors(result.data);
      }
    } catch (err) {
      console.error('Failed to refresh sectors:', err);
    }
  };

  const openAddModal = () => {
    setEditingSector(null);
    setName('');
    setSlug('');
    setDescription('');
    setIconName('Factory');
    setDisplayOrder(0);
    setIsModalOpen(true);
  };

  const openEditModal = (sector: Sector) => {
    setEditingSector(sector);
    setName(sector.name);
    setSlug(sector.slug);
    setDescription(sector.description);
    setIconName(sector.iconName);
    setDisplayOrder(sector.displayOrder);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      slug,
      description,
      iconName,
      displayOrder,
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      let res;
      if (editingSector) {
        res = await fetch(`${apiUrl}/api/industries/${editingSector.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${apiUrl}/api/industries`, {
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
        refreshSectors();
        setIsModalOpen(false);
      } else {
        alert(result.message || 'Error saving sector');
      }
    } catch (err) {
      console.error('Error saving sector:', err);
      alert('Error saving sector');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this industry sector?')) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/industries/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.status === 401) {
        logout();
        return;
      }

      const result = await res.json();
      if (result.success) {
        setSectors((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error('Error deleting sector:', err);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-10">
        <div>
          <span className="font-mono text-[0.65rem] text-cyan-glow/70 tracking-[0.25em] uppercase block mb-1">
            Industry Scope
          </span>
          <h2 className="font-display text-white text-2xl sm:text-3xl font-bold">Industrial Sectors</h2>
        </div>
        <button
          onClick={openAddModal}
          className="w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-cyan-glow text-slate font-mono text-[0.75rem] font-semibold uppercase tracking-wider rounded-lg hover:shadow-[0_0_20px_rgba(143,216,212,0.15)] active:scale-[0.99] transition-all duration-300 min-h-[44px] flex items-center justify-center gap-1.5"
        >
          <span>+ Add Sector</span>
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-cyan-glow/30 border-t-cyan-glow rounded-full animate-spin" />
        </div>
      ) : sectors.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-white/[0.01] border border-white/[0.04]">
          <p className="text-white/30 font-mono text-sm">No industrial sectors created.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-[900px]">
          {sectors.map((sector) => (
            <div
              key={sector.id}
              className="bg-white/[0.01] border border-white/[0.06] rounded-xl p-5 sm:p-6 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono text-[0.7rem] text-cyan-glow/60 uppercase">
                    Order {sector.displayOrder}
                  </span>
                  <span className="text-xs font-mono text-white/40">{sector.iconName}</span>
                </div>
                <h3 className="text-white font-display text-lg font-semibold mb-2">{sector.name}</h3>
                <p className="text-white/60 text-xs leading-relaxed mb-6">{sector.description}</p>
              </div>

              <div className="flex gap-2.5 pt-4 border-t border-white/[0.04] justify-end">
                <button
                  onClick={() => openEditModal(sector)}
                  className="flex-1 sm:flex-initial px-4 py-2 border border-white/[0.08] hover:border-cyan-glow/30 hover:bg-cyan-glow/[0.04] text-white/70 hover:text-cyan-glow font-mono text-[0.75rem] uppercase tracking-wider rounded-lg transition-all duration-200 min-h-[38px] flex items-center justify-center"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(sector.id)}
                  className="px-3.5 py-2 border border-white/[0.08] hover:border-dawn-coral/30 hover:bg-dawn-coral/[0.04] text-white/30 hover:text-dawn-coral rounded-lg transition-all duration-200 min-h-[38px] flex items-center justify-center"
                  title="Delete sector"
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
                {editingSector ? 'Edit Industry Sector' : 'Add Industry Sector'}
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
                  <label className="text-[0.65rem] font-mono uppercase tracking-wider text-white/60 block">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white text-base sm:text-xs font-mono focus:outline-none focus:border-cyan-glow/40 min-h-[42px]"
                    placeholder="e.g. Sugar Processing"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[0.65rem] font-mono uppercase tracking-wider text-white/60 block">Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white text-base sm:text-xs font-mono focus:outline-none focus:border-cyan-glow/40 min-h-[42px]"
                    placeholder="e.g. sugar-processing"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <label className="text-[0.65rem] font-mono uppercase tracking-wider text-white/60 block">Icon Name (Lucide)</label>
                  <select
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-white text-base sm:text-xs font-mono rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-glow/40 min-h-[42px]"
                  >
                    <option value="Factory">Factory</option>
                    <option value="Anchor">Anchor</option>
                    <option value="HardHat">HardHat</option>
                    <option value="Wrench">Wrench</option>
                    <option value="ShieldAlert">ShieldAlert</option>
                    <option value="Compass">Compass</option>
                  </select>
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
                <label className="text-[0.65rem] font-mono uppercase tracking-wider text-white/60 block">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-base sm:text-xs font-mono resize-none focus:outline-none focus:border-cyan-glow/40"
                  placeholder="Describe how the company serves this sector..."
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
