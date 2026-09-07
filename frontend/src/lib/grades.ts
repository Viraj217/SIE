/**
 * Steel grade reference data used to build the /steel-grades landing pages.
 *
 * IMPORTANT — data provenance:
 * Every value below is a PUBLISHED STANDARD DESIGNATION (BS 970, IS 1570, AISI/SAE,
 * DIN/EN) — not a claim about Shah Industrial Enterprise's stock, heats, or capability.
 * Nothing here asserts inventory quantity, price, lead time, tolerance or certification.
 * Actual chemistry and mechanical properties for any supplied heat are governed by the
 * Mill Test Certificate for that heat, which is what these pages tell the buyer.
 *
 * EN8 / EN9 / EN24 values are carried over unchanged from the gradeDetails already
 * present in config.ts. EN19 / EN31 / C45 use the same published-standard basis.
 */

export interface SteelGrade {
  slug: string;
  /** Primary designation buyers search for, e.g. "EN8" */
  code: string;
  /** BS 970 / IS designation, e.g. "080M40" */
  bsDesignation: string;
  name: string;
  /** Search-intent H1 */
  heading: string;
  family: "Medium Carbon Steel" | "Alloy Steel" | "Bearing Steel";
  summary: string;
  /** Longer intro paragraph — factual, standards-based */
  intro: string;
  equivalents: Array<{ standard: string; designation: string }>;
  chemistry: Array<{ element: string; range: string }>;
  mechanical: Array<{ property: string; value: string }>;
  characteristics: string[];
  applications: string[];
  /** Forms this grade is normally traded in — links back to catalogue products */
  relatedProductSlugs: string[];
  /** Grades a buyer typically cross-shops — drives internal linking */
  comparedWith: string[];
  displayOrder: number;
}

export const STEEL_GRADES: SteelGrade[] = [
  {
    slug: "en8",
    code: "EN8",
    bsDesignation: "080M40",
    name: "EN8 Medium Carbon Steel",
    heading: "EN8 Round Bar & Shaft Stock Supplier in Mumbai",
    family: "Medium Carbon Steel",
    summary:
      "Unalloyed medium carbon steel supplied as round bar, shaft and cut-to-size blanks. The default general-engineering grade where mild steel is not strong enough and alloy steel is not required.",
    intro:
      "EN8 (BS 970 designation 080M40) is an unalloyed medium carbon steel used across general engineering for shafts, studs, axles and machined components. Supplied normally in the normalised condition, it offers a substantial strength increase over IS 2062 mild steel while remaining straightforward to machine and weld with preheat. Shah Industrial Enterprise stocks EN8 as round bar and shaft material at the Darukhana, Mazgaon yard and cuts it to your drawing length.",
    equivalents: [
      { standard: "BS 970", designation: "080M40" },
      { standard: "AISI / SAE", designation: "1040" },
      { standard: "DIN / EN", designation: "C40 / 1.0511" },
      { standard: "IS 1570", designation: "40C8" },
    ],
    chemistry: [
      { element: "Carbon (C)", range: "0.36 – 0.44 %" },
      { element: "Manganese (Mn)", range: "0.60 – 1.00 %" },
      { element: "Silicon (Si)", range: "0.10 – 0.40 %" },
      { element: "Sulphur (S)", range: "0.050 % max" },
      { element: "Phosphorus (P)", range: "0.050 % max" },
    ],
    mechanical: [
      { property: "Tensile Strength", value: "550 – 700 MPa" },
      { property: "Typical Condition", value: "Normalised" },
      { property: "Machinability", value: "Good in normalised condition" },
      { property: "Weldability", value: "Weldable with preheat" },
    ],
    characteristics: [
      "Higher tensile strength and wear resistance than IS 2062 mild steel",
      "Responds to flame and induction hardening on the surface",
      "Readily machined in the normalised condition",
      "Cost-effective where alloy content is not justified",
    ],
    applications: [
      "General machinery shafts and spindles",
      "Connecting rods and axle shafts",
      "Studs, bolts, keys and drive couplings",
      "Gear blanks for lightly loaded drives",
    ],
    relatedProductSlugs: ["carbon-steel-rods", "mild-steel-shafts", "custom-hacksaw-cutting"],
    comparedWith: ["en9", "c45", "en19"],
    displayOrder: 1,
  },
  {
    slug: "en9",
    code: "EN9",
    bsDesignation: "070M55",
    name: "EN9 High Carbon Steel",
    heading: "EN9 Round Bar & High Carbon Shaft Material in Mumbai",
    family: "Medium Carbon Steel",
    summary:
      "Higher carbon than EN8, giving greater hardness and wear resistance for mill rollers, wear pins and high-torque drive shafts.",
    intro:
      "EN9 (BS 970 designation 070M55) is a higher carbon engineering steel used where components must resist wear and carry higher torque than EN8 can sustain. The raised carbon content improves attainable hardness but reduces weldability, so EN9 is generally selected for machined and heat-treated parts rather than fabricated assemblies. Available from our Mazgaon yard as round bar and heavy shaft stock, cut to length.",
    equivalents: [
      { standard: "BS 970", designation: "070M55" },
      { standard: "AISI / SAE", designation: "1055" },
      { standard: "DIN / EN", designation: "C55 / 1.0535" },
      { standard: "IS 1570", designation: "55C8" },
    ],
    chemistry: [
      { element: "Carbon (C)", range: "0.50 – 0.60 %" },
      { element: "Manganese (Mn)", range: "0.50 – 0.90 %" },
      { element: "Silicon (Si)", range: "0.10 – 0.40 %" },
      { element: "Sulphur (S)", range: "0.050 % max" },
      { element: "Phosphorus (P)", range: "0.050 % max" },
    ],
    mechanical: [
      { property: "Tensile Strength", value: "650 – 850 MPa" },
      { property: "Typical Condition", value: "Normalised" },
      { property: "Machinability", value: "Fair — slower than EN8" },
      { property: "Weldability", value: "Poor — not recommended" },
    ],
    characteristics: [
      "Higher hardness and wear resistance than EN8",
      "Suited to flame and induction hardening",
      "Not recommended for welded fabrications",
      "Widely used for sugar mill and crushing duty components",
    ],
    applications: [
      "Sugar mill rollers and crushing components",
      "Heavy wear pins and bushes",
      "High-torque drive shafts",
      "Rolling mill and calender rolls",
    ],
    relatedProductSlugs: ["carbon-steel-rods", "roller-shafts", "heavy-steamer-shafts"],
    comparedWith: ["en8", "en19", "en31"],
    displayOrder: 2,
  },
  {
    slug: "en19",
    code: "EN19",
    bsDesignation: "709M40",
    name: "EN19 Chromium-Molybdenum Alloy Steel",
    heading: "EN19 (AISI 4140) Alloy Steel Round Bar Supplier in Mumbai",
    family: "Alloy Steel",
    summary:
      "Chromium-molybdenum alloy steel — the standard high-strength grade for gears, spindles, hydraulic components and tooling that must be through-hardened.",
    intro:
      "EN19 (BS 970 designation 709M40, widely traded as AISI 4140 or 42CrMo4) is a chromium-molybdenum through-hardening alloy steel. The Cr-Mo addition gives deep hardenability and good fatigue strength at section sizes where plain carbon grades cannot harden through. It is normally supplied annealed or in the quenched-and-tempered condition. Stocked as alloy round bar and shaft material at Darukhana, Mumbai and cut to your requirement.",
    equivalents: [
      { standard: "BS 970", designation: "709M40" },
      { standard: "AISI / SAE", designation: "4140" },
      { standard: "DIN / EN", designation: "42CrMo4 / 1.7225" },
      { standard: "IS 1570", designation: "40Cr4Mo3" },
    ],
    chemistry: [
      { element: "Carbon (C)", range: "0.36 – 0.44 %" },
      { element: "Chromium (Cr)", range: "0.90 – 1.20 %" },
      { element: "Molybdenum (Mo)", range: "0.15 – 0.35 %" },
      { element: "Manganese (Mn)", range: "0.65 – 0.95 %" },
      { element: "Silicon (Si)", range: "0.10 – 0.35 %" },
    ],
    mechanical: [
      { property: "Tensile Strength", value: "850 – 1000 MPa (Q+T)" },
      { property: "Typical Condition", value: "Annealed or Quenched & Tempered" },
      { property: "Hardenability", value: "Deep — through-hardens in heavy sections" },
      { property: "Machinability", value: "Good in annealed condition" },
    ],
    characteristics: [
      "Through-hardening in section sizes where carbon steels cannot",
      "Good fatigue and torsional strength",
      "Retains strength at moderately elevated temperatures",
      "Suitable for nitriding after heat treatment",
    ],
    applications: [
      "Heavy transmission gears, pinions and spindles",
      "Hydraulic press components and tie rods",
      "Die holders and extrusion tooling",
      "High-stress engine and compressor shafts",
    ],
    relatedProductSlugs: ["alloy-steel-round-bars", "roller-shafts", "forged-steel-round-bars"],
    comparedWith: ["en24", "en8", "en31"],
    displayOrder: 3,
  },
  {
    slug: "en24",
    code: "EN24",
    bsDesignation: "817M40",
    name: "EN24 Nickel-Chromium-Molybdenum Alloy Steel",
    heading: "EN24 (AISI 4340) High Tensile Alloy Steel Bar Supplier in Mumbai",
    family: "Alloy Steel",
    summary:
      "Nickel-chromium-molybdenum high tensile steel for the most heavily loaded shafts — marine propeller shafting, crane pins and power transmission drives.",
    intro:
      "EN24 (BS 970 designation 817M40, traded as AISI 4340 or 34CrNiMo6) is a nickel-chromium-molybdenum high tensile steel. The nickel addition over EN19 improves toughness and hardenability, making EN24 the preferred grade for large-section, highly stressed and shock-loaded components. It is normally supplied in the quenched-and-tempered condition. Available as heavy alloy round bar and forged shaft stock from our Mazgaon yard.",
    equivalents: [
      { standard: "BS 970", designation: "817M40" },
      { standard: "AISI / SAE", designation: "4340" },
      { standard: "DIN / EN", designation: "34CrNiMo6 / 1.6582" },
      { standard: "IS 1570", designation: "40Ni2Cr1Mo28" },
    ],
    chemistry: [
      { element: "Carbon (C)", range: "0.36 – 0.44 %" },
      { element: "Nickel (Ni)", range: "1.30 – 1.70 %" },
      { element: "Chromium (Cr)", range: "1.00 – 1.40 %" },
      { element: "Molybdenum (Mo)", range: "0.20 – 0.35 %" },
      { element: "Manganese (Mn)", range: "0.45 – 0.70 %" },
    ],
    mechanical: [
      { property: "Tensile Strength", value: "850 – 1000+ MPa (Q+T)" },
      { property: "Typical Condition", value: "Quenched & Tempered" },
      { property: "Hardenability", value: "Very deep — large sections" },
      { property: "Toughness", value: "High, including at low temperature" },
    ],
    characteristics: [
      "Highest hardenability of the common EN engineering grades",
      "Excellent toughness and shock resistance",
      "Suited to very large diameter forged shafts",
      "Can be nitrided for a hard wearing surface",
    ],
    applications: [
      "Marine propeller shafting and rudder stock",
      "Heavy crane pins and lifting components",
      "Power transmission and turbine drive shafts",
      "Aerospace and defence grade machined components",
    ],
    relatedProductSlugs: ["alloy-steel-round-bars", "heavy-steamer-shafts", "forged-steel-round-bars"],
    comparedWith: ["en19", "en9", "en31"],
    displayOrder: 4,
  },
  {
    slug: "en31",
    code: "EN31",
    bsDesignation: "534A99",
    name: "EN31 High Carbon Chromium Bearing Steel",
    heading: "EN31 (AISI 52100) Bearing Steel Round Bar Supplier in Mumbai",
    family: "Bearing Steel",
    summary:
      "High carbon chromium bearing steel offering very high hardness and dimensional stability after hardening — for bearing races, rollers and precision tooling.",
    intro:
      "EN31 (BS 970 designation 534A99, traded as AISI 52100 or 100Cr6) is a high carbon chromium steel developed for anti-friction bearing components. Its high carbon and chromium content produce a fine, uniformly distributed carbide structure that hardens to very high surface hardness with good dimensional stability. It is supplied annealed for machining and hardened after. Available as round bar from our Darukhana stock, cut to size.",
    equivalents: [
      { standard: "BS 970", designation: "534A99" },
      { standard: "AISI / SAE", designation: "52100" },
      { standard: "DIN / EN", designation: "100Cr6 / 1.3505" },
      { standard: "IS 4398", designation: "103Cr1" },
    ],
    chemistry: [
      { element: "Carbon (C)", range: "0.90 – 1.20 %" },
      { element: "Chromium (Cr)", range: "1.00 – 1.60 %" },
      { element: "Manganese (Mn)", range: "0.30 – 0.75 %" },
      { element: "Silicon (Si)", range: "0.10 – 0.35 %" },
      { element: "Sulphur / Phosphorus", range: "0.05 % max each" },
    ],
    mechanical: [
      { property: "Hardness (hardened)", value: "Typically 62 – 64 HRC" },
      { property: "Supply Condition", value: "Spheroidise annealed" },
      { property: "Wear Resistance", value: "Very high" },
      { property: "Weldability", value: "Not recommended" },
    ],
    characteristics: [
      "Very high attainable hardness and wear resistance",
      "Good dimensional stability after heat treatment",
      "Fine carbide distribution suited to rolling contact fatigue",
      "Machined in the annealed condition, then hardened",
    ],
    applications: [
      "Ball and roller bearing races and rolling elements",
      "Precision spindles and guide rollers",
      "Punches, dies and forming tools",
      "Wear plates and high-load bushings",
    ],
    relatedProductSlugs: ["alloy-steel-round-bars", "custom-hacksaw-cutting"],
    comparedWith: ["en19", "en24", "en9"],
    displayOrder: 5,
  },
  {
    slug: "c45",
    code: "C45",
    bsDesignation: "1.0503",
    name: "C45 Medium Carbon Steel",
    heading: "C45 (AISI 1045) Round Bar & Shaft Material Supplier in Mumbai",
    family: "Medium Carbon Steel",
    summary:
      "Unalloyed medium carbon steel to the DIN/EN designation, functionally close to EN8. Widely specified on European and OEM drawings.",
    intro:
      "C45 (material number 1.0503, traded as AISI 1045) is an unalloyed medium carbon steel specified extensively on European and OEM drawings for shafts, pins, gears and machined components. Its properties are close to EN8, and buyers frequently cross-reference the two. Supplied normalised for machining and capable of surface hardening. Stocked as round bar and shaft material at Darukhana, Mazgaon and cut to length.",
    equivalents: [
      { standard: "DIN / EN", designation: "C45 / 1.0503" },
      { standard: "AISI / SAE", designation: "1045" },
      { standard: "BS 970", designation: "080M46" },
      { standard: "IS 1570", designation: "45C8" },
    ],
    chemistry: [
      { element: "Carbon (C)", range: "0.42 – 0.50 %" },
      { element: "Manganese (Mn)", range: "0.50 – 0.80 %" },
      { element: "Silicon (Si)", range: "0.40 % max" },
      { element: "Sulphur (S)", range: "0.045 % max" },
      { element: "Phosphorus (P)", range: "0.045 % max" },
    ],
    mechanical: [
      { property: "Tensile Strength", value: "570 – 700 MPa" },
      { property: "Typical Condition", value: "Normalised" },
      { property: "Machinability", value: "Good in normalised condition" },
      { property: "Weldability", value: "Weldable with preheat" },
    ],
    characteristics: [
      "Direct DIN/EN counterpart to the BS EN8 specification",
      "Responds well to induction and flame hardening",
      "Commonly called for on imported machinery drawings",
      "Good strength-to-cost ratio for general engineering",
    ],
    applications: [
      "Machine shafts, pins and spacers",
      "Hydraulic cylinder rod base material",
      "Gears, sprockets and couplings",
      "Bolts, studs and general machined parts",
    ],
    relatedProductSlugs: ["carbon-steel-rods", "hydraulic-shafts", "custom-hacksaw-cutting"],
    comparedWith: ["en8", "en9", "en19"],
    displayOrder: 6,
  },
];

export function getGradeBySlug(slug: string): SteelGrade | undefined {
  return STEEL_GRADES.find((g) => g.slug === slug);
}

/**
 * Resolve a free-text grade label from the product catalogue (e.g. "EN8 Forged",
 * "C45 Hard Chrome", "AISI 4140") to a grade landing page, so product pages can
 * link into the grade reference. Returns undefined when there is no page for it.
 */
export function matchGradeLabel(label: string): SteelGrade | undefined {
  const upper = label.toUpperCase();
  return STEEL_GRADES.find(
    (grade) =>
      new RegExp(`\b${grade.code}\b`).test(upper) ||
      grade.equivalents.some((eq) => new RegExp(`\b${eq.designation.toUpperCase()}\b`).test(upper))
  );
}
