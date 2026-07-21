'use client';

export default function PrintCatalogButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center justify-center rounded-md border border-white/12 px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-white/78 hover:bg-white/8"
    >
      Print Catalog
    </button>
  );
}
