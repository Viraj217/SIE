'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../layout';

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

  const fetchSectors = async () => {
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
      console.error('Failed to fetch sectors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSectors();
    }
  }, [token]);

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
        fetchSectors();
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
      <div className="flex justify-between items-center mb-10">
        <div>
          <span className="font-mono text-[0.65rem] text-cyan-glow/70 tracking-[0.25em] uppercase block mb-1">
            Industry Scope
          </span>
          <h2 className="font-display text-white text-3xl font-bold">Industrial Sectors</h2>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-cyan-glow text-slate font-mono text-[0.75rem] font-semibold uppercase tracking-wider rounded hover:shadow-[0_0_20px_rgba(143,216,212,0.15)] transition-all duration-300"
        >
          + Add Sector
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[900px]">
          {sectors.map((sector) => (
            <div
              key={sector.id}
              className="bg-white/[0.01] border border-white/[0.06] rounded-lg p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono text-[0.7rem] text-cyan-glow/60 uppercase">
                    Order {sector.displayOrder}
                  </span>
                  <span className="text-xs font-mono text-white/30">{sector.iconName}</span>
                </div>
                <h3 className="text-white font-display text-lg font-semibold mb-2">{sector.name}</h3>
                <p className="text-white/50 text-xs leading-relaxed mb-6">{sector.description}</p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/[0.04] justify-end">
                <button
                  onClick={() => openEditModal(sector)}
                  className="px-4 py-2 border border-white/[0.08] hover:border-cyan-glow/30 hover:bg-cyan-glow/[0.04] text-white/60 hover:text-cyan-glow font-mono text-[0.7rem] uppercase tracking-wider rounded transition-all duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(sector.id)}
                  className="px-3 py-2 border border-white/[0.08] hover:border-dawn-coral/30 hover:bg-dawn-coral/[0.04] text-white/20 hover:text-dawn-coral rounded transition-all duration-200"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate/80 backdrop-blur-sm">
          <div className="w-full max-w-[500px] bg-slate ring-1 ring-white/[0.08] rounded-xl p-8 space-y-6">
            <h3 className="font-display text-white text-xl font-bold">
              {editingSector ? 'Edit Industry Sector' : 'Add Industry Sector'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[0.65rem] font-mono uppercase tracking-wider text-white/40 block">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-cyan-glow/40"
                    placeholder="e.g. Sugar Processing"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[0.65rem] font-mono uppercase tracking-wider text-white/40 block">Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-cyan-glow/40"
                    placeholder="e.g. sugar-processing"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[0.65rem] font-mono uppercase tracking-wider text-white/40 block">Icon Name (Lucide)</label>
                  <select
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-white text-xs font-mono rounded px-3 py-2 focus:outline-none focus:border-cyan-glow/40"
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
                  <label className="text-[0.65rem] font-mono uppercase tracking-wider text-white/40 block">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                    required
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-cyan-glow/40"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[0.65rem] font-mono uppercase tracking-wider text-white/40 block">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-3 py-2 text-white text-xs font-mono resize-none focus:outline-none focus:border-cyan-glow/40"
                  placeholder="Describe how the company serves this sector..."
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-white/[0.08] hover:bg-white/[0.03] text-white/60 font-mono text-xs uppercase tracking-wider rounded transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-cyan-glow text-slate font-mono text-xs uppercase tracking-wider font-semibold rounded hover:shadow-[0_0_20px_rgba(143,216,212,0.15)] transition-all duration-200"
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
