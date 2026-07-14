'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../layout';

interface Spec {
  label: string;
  value: string;
}

interface Product {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: 'RAW_MATERIAL' | 'ALLOY' | 'SERVICE';
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  specs: Spec[];
}

export default function ProductsPage() {
  const { token, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<'RAW_MATERIAL' | 'ALLOY' | 'SERVICE'>('RAW_MATERIAL');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [specs, setSpecs] = useState<Spec[]>([]);

  const fetchProducts = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      // Load active and inactive for admin
      const res = await fetch(`${apiUrl}/api/products?active=false`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.status === 401) {
        logout();
        return;
      }

      const result = await res.json();
      if (result.success) {
        setProducts(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  const openAddModal = () => {
    setEditingProduct(null);
    setSlug('');
    setTitle('');
    setTagline('');
    setCategory('RAW_MATERIAL');
    setIsFeatured(false);
    setIsActive(true);
    setDisplayOrder(0);
    setSpecs([{ label: '', value: '' }]);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setSlug(product.slug);
    setTitle(product.title);
    setTagline(product.tagline);
    setCategory(product.category);
    setIsFeatured(product.isFeatured);
    setIsActive(product.isActive);
    setDisplayOrder(product.displayOrder);
    setSpecs(product.specs.length > 0 ? [...product.specs] : [{ label: '', value: '' }]);
    setIsModalOpen(true);
  };

  const handleAddSpec = () => {
    setSpecs((prev) => [...prev, { label: '', value: '' }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: 'label' | 'value', val: string) => {
    setSpecs((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: val } : s))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out blank specs
    const filteredSpecs = specs.filter((s) => s.label.trim() && s.value.trim());

    const payload = {
      slug,
      title,
      tagline,
      category,
      isFeatured,
      isActive,
      displayOrder,
      specs: filteredSpecs,
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      let res;
      if (editingProduct) {
        res = await fetch(`${apiUrl}/api/products/${editingProduct.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${apiUrl}/api/products`, {
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
        fetchProducts();
        setIsModalOpen(false);
      } else {
        alert(result.message || 'Error saving product');
      }
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Error saving product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this product?')) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.status === 401) {
        logout();
        return;
      }

      const result = await res.json();
      if (result.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <span className="font-mono text-[0.65rem] text-cyan-glow/70 tracking-[0.25em] uppercase block mb-1">
            Inventory System
          </span>
          <h2 className="font-display text-white text-3xl font-bold">Manage Products</h2>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-cyan-glow text-slate font-mono text-[0.75rem] font-semibold uppercase tracking-wider rounded hover:shadow-[0_0_20px_rgba(143,216,212,0.15)] transition-all duration-300"
        >
          + Add Product
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-cyan-glow/30 border-t-cyan-glow rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className={`bg-white/[0.01] border rounded-lg p-6 flex flex-col relative transition-all duration-300 ${
                product.isActive ? 'border-white/[0.06]' : 'border-dashed border-white/10 opacity-60'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-[0.6rem] text-white/30 tracking-widest uppercase bg-white/[0.04] px-2 py-0.5 rounded">
                  {product.category}
                </span>
                <div className="flex gap-2">
                  {product.isFeatured && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow" title="Featured" />
                  )}
                  <span className={`w-1.5 h-1.5 rounded-full ${product.isActive ? 'bg-green-500' : 'bg-red-500'}`} title={product.isActive ? 'Active' : 'Inactive'} />
                </div>
              </div>

              <h3 className="font-display text-white text-lg font-bold mb-1">{product.title}</h3>
              <p className="text-white/40 text-xs line-clamp-2 mb-6">{product.tagline}</p>

              <div className="border-t border-white/[0.06] pt-4 mt-auto space-y-3">
                <div className="flex justify-between font-mono text-[0.7rem] text-white/30">
                  <span>Display Order</span>
                  <span className="text-white/60">{product.displayOrder}</span>
                </div>
                <div className="flex justify-between font-mono text-[0.7rem] text-white/30">
                  <span>Specs Count</span>
                  <span className="text-white/60">{product.specs.length}</span>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 py-2 border border-white/[0.08] hover:border-cyan-glow/30 hover:bg-cyan-glow/[0.04] text-white/60 hover:text-cyan-glow font-mono text-[0.7rem] uppercase tracking-wider rounded transition-all duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-2 border border-white/[0.08] hover:border-dawn-coral/30 hover:bg-dawn-coral/[0.04] text-white/20 hover:text-dawn-coral rounded transition-all duration-200"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-[600px] bg-slate ring-1 ring-white/[0.08] rounded-xl p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <h3 className="font-display text-white text-xl font-bold">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[0.65rem] font-mono uppercase tracking-wider text-white/40 block">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-cyan-glow/40"
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
                    placeholder="e.g. carbon-steel-rods"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[0.65rem] font-mono uppercase tracking-wider text-white/40 block">Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  required
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-cyan-glow/40"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[0.65rem] font-mono uppercase tracking-wider text-white/40 block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-white text-xs font-mono rounded px-3 py-2 focus:outline-none focus:border-cyan-glow/40"
                  >
                    <option value="RAW_MATERIAL">RAW_MATERIAL</option>
                    <option value="ALLOY">ALLOY</option>
                    <option value="SERVICE">SERVICE</option>
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
                <div className="flex gap-4 items-center justify-around h-full pt-4">
                  <label className="flex items-center gap-2 text-[0.65rem] font-mono uppercase tracking-wider text-white/60 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="accent-cyan-glow"
                    />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-[0.65rem] font-mono uppercase tracking-wider text-white/60 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="accent-cyan-glow"
                    />
                    Active
                  </label>
                </div>
              </div>

              {/* Specifications Sub-form */}
              <div className="border-t border-white/[0.06] pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[0.65rem] font-mono uppercase tracking-wider text-white/40">Specifications</span>
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="text-[0.65rem] font-mono text-cyan-glow hover:underline"
                  >
                    + Add Spec Row
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {specs.map((spec, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={spec.label}
                        onChange={(e) => handleSpecChange(i, 'label', e.target.value)}
                        placeholder="Label (e.g. Hardness)"
                        className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded px-3 py-1.5 text-white text-xs font-mono focus:outline-none focus:border-cyan-glow/40"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
                        placeholder="Value (e.g. Normalized)"
                        className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded px-3 py-1.5 text-white text-xs font-mono focus:outline-none focus:border-cyan-glow/40"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(i)}
                        className="text-white/20 hover:text-dawn-coral text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
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
