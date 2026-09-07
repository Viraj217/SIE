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

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/products?active=false`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (res.status === 401) {
          logout();
          return;
        }

        const result = await res.json();
        if (result.success && isMounted) {
          setProducts(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (token) {
      fetchProducts();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [token, logout]);

  const refreshProducts = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
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
      console.error('Failed to refresh products:', err);
    }
  };

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
    setSpecs(product.specs.length > 0 ? product.specs : [{ label: '', value: '' }]);
    setIsModalOpen(true);
  };

  const handleSpecChange = (index: number, field: 'label' | 'value', val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  const addSpecField = () => {
    setSpecs([...specs, { label: '', value: '' }]);
  };

  const removeSpecField = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

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
        refreshProducts();
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
    if (!confirm('Are you sure you want to delete this product?')) return;

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
            Inventory & Catalog
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
      ) : products.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-white/[0.01] border border-white/[0.04]">
          <p className="text-white/30 font-mono text-sm">No products found in the database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white/[0.01] border border-white/[0.06] rounded-lg p-6 flex flex-col justify-between group hover:border-cyan-glow/20 transition-all duration-300"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[0.65rem] font-mono text-cyan-glow/60 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {product.isFeatured && (
                      <span className="bg-dawn-coral/10 text-dawn-coral text-[0.6rem] font-mono uppercase px-2 py-0.5 rounded">
                        Featured
                      </span>
                    )}
                    <span className={`w-2 h-2 rounded-full ${product.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                  </div>
                </div>

                <h3 className="font-display text-white text-xl font-semibold mb-2">{product.title}</h3>
                <p className="text-white/40 text-xs mb-6 line-clamp-2 leading-relaxed">{product.tagline}</p>

                <div className="space-y-1.5 border-t border-white/[0.04] pt-4 mb-6">
                  {product.specs?.slice(0, 3).map((spec, i) => (
                    <div key={i} className="flex justify-between text-[0.7rem] font-mono">
                      <span className="text-white/30">{spec.label}</span>
                      <span className="text-white/70">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 border-t border-white/[0.04] pt-4">
                <button
                  onClick={() => openEditModal(product)}
                  className="flex-1 py-2 bg-white/[0.03] hover:bg-white/[0.08] text-white/70 text-[0.7rem] font-mono uppercase tracking-wider rounded transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-3 py-2 bg-white/[0.03] hover:bg-dawn-coral/20 text-white/40 hover:text-dawn-coral text-[0.7rem] rounded transition-colors"
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
          <div className="w-full max-w-[650px] max-h-[90vh] overflow-y-auto bg-slate ring-1 ring-white/[0.08] rounded-xl p-8 space-y-6">
            <h3 className="font-display text-white text-xl font-bold">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[0.65rem] font-mono uppercase tracking-wider text-white/40 block">Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-cyan-glow/40"
                    placeholder="e.g. mild-steel-shafts"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[0.65rem] font-mono uppercase tracking-wider text-white/40 block">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-cyan-glow/40"
                    placeholder="e.g. Mild Steel Shafts"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[0.65rem] font-mono uppercase tracking-wider text-white/40 block">Tagline</label>
                <textarea
                  rows={2}
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  required
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-3 py-2 text-white text-xs font-mono resize-none focus:outline-none focus:border-cyan-glow/40"
                  placeholder="Brief descriptive tagline for the product card..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[0.65rem] font-mono uppercase tracking-wider text-white/40 block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as 'RAW_MATERIAL' | 'ALLOY' | 'SERVICE')}
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
                <div className="flex gap-4 items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded border-white/[0.08]"
                    />
                    <span className="text-[0.65rem] font-mono uppercase text-white/60">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded border-white/[0.08]"
                    />
                    <span className="text-[0.65rem] font-mono uppercase text-white/60">Active</span>
                  </label>
                </div>
              </div>

              {/* Specs Fields */}
              <div className="space-y-3 pt-4 border-t border-white/[0.04]">
                <div className="flex justify-between items-center">
                  <span className="text-[0.65rem] font-mono uppercase tracking-wider text-cyan-glow/70">
                    Product Specifications
                  </span>
                  <button
                    type="button"
                    onClick={addSpecField}
                    className="text-[0.65rem] font-mono text-cyan-glow hover:underline uppercase"
                  >
                    + Add Spec
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {specs.map((spec, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={spec.label}
                        onChange={(e) => handleSpecChange(index, 'label', e.target.value)}
                        placeholder="Label (e.g. Diameter)"
                        className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded px-3 py-1.5 text-white text-xs font-mono focus:outline-none focus:border-cyan-glow/40"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                        placeholder="Value (e.g. Ø 12-250mm)"
                        className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded px-3 py-1.5 text-white text-xs font-mono focus:outline-none focus:border-cyan-glow/40"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecField(index)}
                        className="p-1.5 text-white/30 hover:text-dawn-coral"
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
