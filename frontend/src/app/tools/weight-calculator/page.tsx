'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import SiteFooter from '@/components/SiteFooter';
import {
  calculateSteelWeight,
  SteelShape,
  DENSITY_PRESETS,
  CalculationInput,
} from '@/lib/calculator';
import { buildProductWhatsAppUrl } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';
import { businessConfig } from '@/lib/config';
import { SITE_URL } from '@/lib/seo';

export default function SteelWeightCalculatorPage() {
  const [shape, setShape] = useState<SteelShape>('ROUND_BAR');
  const [densityKey, setDensityKey] = useState<string>('CARBON_STEEL');
  const [customDensity, setCustomDensity] = useState<number>(7.85);

  // Dimension inputs (mm)
  const [diameter, setDiameter] = useState<string>('100');
  const [outerDiameter, setOuterDiameter] = useState<string>('150');
  const [wallThickness, setWallThickness] = useState<string>('12');
  const [side, setSide] = useState<string>('80');
  const [width, setWidth] = useState<string>('150');
  const [thickness, setThickness] = useState<string>('25');
  const [acrossFlats, setAcrossFlats] = useState<string>('50');
  const [lengthMm, setLengthMm] = useState<string>('1000');
  const [quantity, setQuantity] = useState<string>('1');

  const activeDensity = useMemo(() => {
    if (densityKey === 'CUSTOM') return customDensity;
    return DENSITY_PRESETS[densityKey]?.density || 7.85;
  }, [densityKey, customDensity]);

  const calculationInput: CalculationInput = useMemo(() => {
    return {
      shape,
      density: activeDensity,
      diameter: parseFloat(diameter) || 0,
      outerDiameter: parseFloat(outerDiameter) || 0,
      wallThickness: parseFloat(wallThickness) || 0,
      side: parseFloat(side) || 0,
      width: parseFloat(width) || 0,
      thickness: parseFloat(thickness) || 0,
      acrossFlats: parseFloat(acrossFlats) || 0,
      lengthMm: parseFloat(lengthMm) || 0,
      quantity: parseInt(quantity, 10) || 1,
    };
  }, [shape, activeDensity, diameter, outerDiameter, wallThickness, side, width, thickness, acrossFlats, lengthMm, quantity]);

  const result = useMemo(() => {
    return calculateSteelWeight(calculationInput);
  }, [calculationInput]);

  const shapeTitleMap: Record<SteelShape, string> = {
    ROUND_BAR: 'Round Bar / Shaft',
    HOLLOW_PIPE: 'Seamless Pipe / Hollow Tube',
    SQUARE_BAR: 'Square Bar',
    FLAT_BAR: 'Flat Bar / Rectangular Profile',
    PLATE: 'Steel Plate / Sheet',
    HEX_BAR: 'Hexagonal Bar',
  };

  const getDimensionSummary = () => {
    switch (shape) {
      case 'ROUND_BAR':
        return `Ø ${diameter}mm × ${lengthMm}mm`;
      case 'HOLLOW_PIPE':
        return `OD ${outerDiameter}mm × WT ${wallThickness}mm × ${lengthMm}mm`;
      case 'SQUARE_BAR':
        return `${side}mm × ${side}mm × ${lengthMm}mm`;
      case 'FLAT_BAR':
      case 'PLATE':
        return `${width}mm × ${thickness}mm × ${lengthMm}mm`;
      case 'HEX_BAR':
        return `AF ${acrossFlats}mm × ${lengthMm}mm`;
    }
  };

  const handleWhatsAppQuote = () => {
    const gradeName = DENSITY_PRESETS[densityKey]?.name || 'Standard Steel';
    const dimSummary = getDimensionSummary();
    const qtySummary = `${quantity} pcs (${result.totalWeightKg} kg / ${result.totalWeightTons} Tons)`;

    trackEvent('calculator_use', {
      calculator_shape: shape,
      calculated_weight_kg: result.totalWeightKg,
      dimensions: dimSummary,
      quantity: qtySummary,
    });

    const url = buildProductWhatsAppUrl({
      productTitle: `Steel ${shapeTitleMap[shape]}`,
      grade: gradeName,
      diameter: dimSummary,
      quantity: qtySummary,
      additionalNotes: `Calculated total weight: ${result.totalWeightKg} kg (${result.totalWeightTons} MT). Formula: ${result.formulaDescription}`,
    });

    trackEvent('whatsapp_click', { source_page: 'weight_calculator' });
    window.open(url, '_blank');
  };

  const handleOpenRfq = () => {
    const dimSummary = getDimensionSummary();
    const reqText = `${quantity} pcs of ${shapeTitleMap[shape]} (${dimSummary}), total weight approx ${result.totalWeightKg} kg (${result.totalWeightTons} MT). Density: ${activeDensity} g/cm³.`;

    window.dispatchEvent(
      new CustomEvent('populateRequirements', {
        detail: reqText,
      })
    );

    trackEvent('calculator_use', {
      calculator_shape: shape,
      calculated_weight_kg: result.totalWeightKg,
      dimensions: dimSummary,
    });
    trackEvent('rfq_start', { source_page: 'weight_calculator' });

    window.location.href = '/contact';
  };

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Steel Weight & Shaft Calculator',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    url: `${SITE_URL}/tools/weight-calculator`,
    description:
      'Online engineering tool to calculate weights for round steel bars, heavy steamer shafts, hollow seamless pipes, square, flat and hexagonal steel sections.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    publisher: {
      '@type': 'LocalBusiness',
      name: businessConfig.name,
    },
  };

  return (
    <main className="min-h-screen bg-paper text-slate">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />

      <Navigation />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-slate pb-16 pt-32 text-white noise-overlay sm:pb-20 sm:pt-36">
        <div className="absolute top-[-150px] right-[-150px] h-[400px] w-[400px] rounded-full bg-cyan-glow/[0.04] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-150px] left-[-150px] h-[400px] w-[400px] rounded-full bg-dawn-coral/[0.03] blur-[100px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[1200px] px-5 sm:px-8 md:px-12">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/50">
            <Link href="/" className="hover:text-cyan-glow transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/50">Engineering Tools</span>
            <span>/</span>
            <span className="text-cyan-glow">Steel Weight Calculator</span>
          </nav>

          <div className="flex items-center gap-3 text-cyan-glow mb-4">
            <span className="h-px w-8 bg-cyan-glow/70" />
            <p className="font-mono text-[0.68rem] tracking-[0.28em] uppercase">
              Engineering Tools · Precision Estimator
            </p>
          </div>

          <h1 className="max-w-[850px] font-display text-[clamp(2.4rem,5.5vw,4.5rem)] font-bold leading-[1.05]">
            Steel Weight & Shaft Tonnage Calculator
          </h1>

          <p className="mt-6 max-w-[680px] text-[1.05rem] leading-relaxed text-white/65">
            Calculate theoretical weight in kilograms and metric tons for round bars, steamer shafts, seamless pipes, and profiles. Instant quote generation for procurement teams and machinists.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 md:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16">
            
            {/* Input Controls */}
            <div className="rounded-2xl border border-steel/15 bg-white p-6 sm:p-10 shadow-sm">
              <h2 className="font-display text-2xl font-bold mb-6 text-slate">1. Select Profile & Material</h2>

              {/* Profile Shape Selector */}
              <div className="mb-8">
                <label className="block font-mono text-xs uppercase tracking-wider text-steel mb-3">Steel Profile Shape</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(
                    [
                      { key: 'ROUND_BAR', label: '● Round Bar / Shaft' },
                      { key: 'HOLLOW_PIPE', label: '◎ Hollow Pipe / Tube' },
                      { key: 'SQUARE_BAR', label: '■ Square Bar' },
                      { key: 'FLAT_BAR', label: '▬ Flat Bar / Profile' },
                      { key: 'PLATE', label: '▭ Steel Plate' },
                      { key: 'HEX_BAR', label: '⬡ Hexagonal Bar' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setShape(item.key)}
                      className={`rounded-lg border p-3 text-left font-mono text-xs transition-all ${
                        shape === item.key
                          ? 'border-slate bg-slate text-white shadow-sm'
                          : 'border-steel/20 bg-paper hover:border-steel/40 text-slate'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material Density Preset */}
              <div className="mb-8">
                <label htmlFor="material-grade-select" className="block font-mono text-xs uppercase tracking-wider text-steel mb-2">Steel Grade & Density</label>
                <select
                  id="material-grade-select"
                  value={densityKey}
                  onChange={(e) => setDensityKey(e.target.value)}
                  className="w-full rounded-lg border border-steel/20 bg-paper px-4 py-3 font-mono text-xs sm:text-sm text-slate focus:border-cyan-glow focus:outline-none"
                >
                  {Object.entries(DENSITY_PRESETS).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.name} — {item.density} g/cm³
                    </option>
                  ))}
                  <option value="CUSTOM">Custom Density...</option>
                </select>

                {densityKey === 'CUSTOM' && (
                  <div className="mt-3">
                    <label htmlFor="custom-density-input" className="block font-mono text-[0.7rem] uppercase text-steel mb-1">Density (g/cm³)</label>
                    <input
                      id="custom-density-input"
                      type="number"
                      step="0.01"
                      value={customDensity}
                      onChange={(e) => setCustomDensity(parseFloat(e.target.value) || 7.85)}
                      className="w-full rounded-lg border border-steel/20 bg-paper px-4 py-2 font-mono text-sm"
                    />
                  </div>
                )}
              </div>

              <h2 className="font-display text-2xl font-bold mb-6 text-slate">2. Enter Dimensions (Millimeters)</h2>

              {/* Shape Specific Dimension Inputs */}
              <div className="space-y-5">
                {shape === 'ROUND_BAR' && (
                  <div>
                    <label htmlFor="input-diameter" className="block font-mono text-xs uppercase tracking-wider text-steel mb-2">
                      Diameter (mm)
                    </label>
                    <input
                      id="input-diameter"
                      type="number"
                      min="1"
                      value={diameter}
                      onChange={(e) => setDiameter(e.target.value)}
                      placeholder="e.g. 100"
                      className="w-full rounded-lg border border-steel/20 bg-paper px-4 py-3 font-mono text-sm text-slate focus:border-cyan-glow focus:outline-none"
                    />
                    <p className="mt-1 font-mono text-[0.65rem] text-steel/60">Common stock: Ø 12mm to 1000mm</p>
                  </div>
                )}

                {shape === 'HOLLOW_PIPE' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="input-od" className="block font-mono text-xs uppercase tracking-wider text-steel mb-2">
                        Outer Diameter (OD in mm)
                      </label>
                      <input
                        id="input-od"
                        type="number"
                        min="1"
                        value={outerDiameter}
                        onChange={(e) => setOuterDiameter(e.target.value)}
                        placeholder="e.g. 150"
                        className="w-full rounded-lg border border-steel/20 bg-paper px-4 py-3 font-mono text-sm text-slate focus:border-cyan-glow focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="input-wt" className="block font-mono text-xs uppercase tracking-wider text-steel mb-2">
                        Wall Thickness (WT in mm)
                      </label>
                      <input
                        id="input-wt"
                        type="number"
                        min="0.5"
                        value={wallThickness}
                        onChange={(e) => setWallThickness(e.target.value)}
                        placeholder="e.g. 12"
                        className="w-full rounded-lg border border-steel/20 bg-paper px-4 py-3 font-mono text-sm text-slate focus:border-cyan-glow focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {shape === 'SQUARE_BAR' && (
                  <div>
                    <label htmlFor="input-side" className="block font-mono text-xs uppercase tracking-wider text-steel mb-2">
                      Side Width (mm)
                    </label>
                    <input
                      id="input-side"
                      type="number"
                      min="1"
                      value={side}
                      onChange={(e) => setSide(e.target.value)}
                      placeholder="e.g. 80"
                      className="w-full rounded-lg border border-steel/20 bg-paper px-4 py-3 font-mono text-sm text-slate focus:border-cyan-glow focus:outline-none"
                    />
                  </div>
                )}

                {(shape === 'FLAT_BAR' || shape === 'PLATE') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="input-width" className="block font-mono text-xs uppercase tracking-wider text-steel mb-2">
                        Width (mm)
                      </label>
                      <input
                        id="input-width"
                        type="number"
                        min="1"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        placeholder="e.g. 150"
                        className="w-full rounded-lg border border-steel/20 bg-paper px-4 py-3 font-mono text-sm text-slate focus:border-cyan-glow focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="input-thickness" className="block font-mono text-xs uppercase tracking-wider text-steel mb-2">
                        Thickness (mm)
                      </label>
                      <input
                        id="input-thickness"
                        type="number"
                        min="0.5"
                        value={thickness}
                        onChange={(e) => setThickness(e.target.value)}
                        placeholder="e.g. 25"
                        className="w-full rounded-lg border border-steel/20 bg-paper px-4 py-3 font-mono text-sm text-slate focus:border-cyan-glow focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {shape === 'HEX_BAR' && (
                  <div>
                    <label htmlFor="input-af" className="block font-mono text-xs uppercase tracking-wider text-steel mb-2">
                      Across Flats (AF in mm)
                    </label>
                    <input
                      id="input-af"
                      type="number"
                      min="1"
                      value={acrossFlats}
                      onChange={(e) => setAcrossFlats(e.target.value)}
                      placeholder="e.g. 50"
                      className="w-full rounded-lg border border-steel/20 bg-paper px-4 py-3 font-mono text-sm text-slate focus:border-cyan-glow focus:outline-none"
                    />
                  </div>
                )}

                {/* Length & Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label htmlFor="input-length" className="block font-mono text-xs uppercase tracking-wider text-steel mb-2">
                      Cut Length (mm)
                    </label>
                    <input
                      id="input-length"
                      type="number"
                      min="1"
                      value={lengthMm}
                      onChange={(e) => setLengthMm(e.target.value)}
                      placeholder="e.g. 1000"
                      className="w-full rounded-lg border border-steel/20 bg-paper px-4 py-3 font-mono text-sm text-slate focus:border-cyan-glow focus:outline-none"
                    />
                    <p className="mt-1 font-mono text-[0.65rem] text-steel/60">1 meter = 1000 mm</p>
                  </div>

                  <div>
                    <label htmlFor="input-quantity" className="block font-mono text-xs uppercase tracking-wider text-steel mb-2">
                      Quantity (Number of pieces)
                    </label>
                    <input
                      id="input-quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="e.g. 1"
                      className="w-full rounded-lg border border-steel/20 bg-paper px-4 py-3 font-mono text-sm text-slate focus:border-cyan-glow focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Live Calculation Output & CTAs */}
            <div className="space-y-6">
              
              <div className="rounded-2xl bg-slate p-6 sm:p-8 text-white shadow-xl noise-overlay">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-glow">Calculation Results</span>
                  <span className="font-mono text-xs text-white/40">{shapeTitleMap[shape]}</span>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="font-mono text-xs uppercase text-white/50 tracking-wider">Total Estimated Weight</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-mono text-4xl sm:text-5xl font-bold text-cyan-glow">
                        {result.totalWeightKg.toLocaleString()}
                      </span>
                      <span className="font-mono text-lg text-white/70">kg</span>
                    </div>
                    <p className="font-mono text-sm text-white/60 mt-1">
                      ≈ {result.totalWeightTons} Metric Tons
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4 font-mono text-xs">
                    <div>
                      <p className="text-white/40 uppercase text-[0.65rem]">Weight Per Piece</p>
                      <p className="text-white font-semibold text-sm mt-0.5">{result.singleWeightKg} kg</p>
                    </div>
                    <div>
                      <p className="text-white/40 uppercase text-[0.65rem]">Total Volume</p>
                      <p className="text-white font-semibold text-sm mt-0.5">{result.volumeCm3.toLocaleString()} cm³</p>
                    </div>
                  </div>

                  <div className="rounded border border-white/10 bg-black/20 p-3 font-mono text-[0.7rem] text-white/50">
                    <p className="text-white/30 uppercase tracking-wider text-[0.6rem] mb-1">Applied Formula</p>
                    <p className="text-cyan-glow/80 break-all">{result.formulaDescription}</p>
                  </div>

                  {/* Dual Action Triggers */}
                  <div className="space-y-3 pt-2">
                    <button
                      type="button"
                      onClick={handleOpenRfq}
                      className="w-full rounded-md bg-dawn-coral py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-900 hover:bg-[#f09770] transition-colors"
                    >
                      Quote this Weight via RFQ →
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppQuote}
                      className="w-full flex items-center justify-center gap-2 rounded-md bg-[#25D366] py-3 font-mono text-xs font-bold uppercase tracking-wider text-slate-900 hover:bg-[#20bd5a] transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                      Send Output on WhatsApp ↗
                    </button>
                  </div>
                </div>
              </div>

              {/* Cutting & Processing Note */}
              <div className="rounded-xl border border-steel/15 bg-paper-warm p-6">
                <h4 className="font-display text-lg font-bold mb-2">In-House Cut-to-Size Processing</h4>
                <p className="text-slate/70 text-xs leading-relaxed">
                  Shah Industrial Enterprise provides precision hacksaw cutting up to Ø 300mm with ±1.0mm tolerance from our Mazgaon yard. Order exact piece lengths to eliminate shop-floor cutting time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </main>
  );
}
