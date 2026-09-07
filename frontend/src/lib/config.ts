export const SITE_URL = "https://shahindustrialenterprise.com";

export interface ContactPerson {
  name: string;
  role: string;
  phone: string;
  formattedPhone: string;
  whatsapp: string;
  isPrimary?: boolean;
}

export interface BusinessConfig {
  name: string;
  legalName: string;
  tagline: string;
  founded: string;
  establishedClaim: string;
  yearsInTradeClaim: string;
  statesSuppliedClaim: string;
  cutToleranceClaim: string;
  annualTonnageClaim: string;
  expectedResponseTime: string;
  description: string;
  address: {
    street: string;
    locality: string;
    landmark: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
    countryCode: string;
    fullFormatted: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  landlines: string[];
  contacts: ContactPerson[];
  primaryWhatsAppNumber: string;
  email: string;
  salesEmail: string;
  hours: string;
  serviceAreas: string[];
  industries: string[];
}

export const businessConfig: BusinessConfig = {
  name: "Shah Industrial Enterprise",
  legalName: "Shah Industrial Enterprise",
  tagline: "Forged for strength, cut to precision.",
  founded: "1961",
  establishedClaim: "Est. 1961 · Mazgaon, Mumbai",
  yearsInTradeClaim: "65+",
  statesSuppliedClaim: "18",
  cutToleranceClaim: "±1mm",
  annualTonnageClaim: "500+",
  expectedResponseTime: "Under 2 hours",
  description:
    "Iron and steel merchants in Darukhana, Mazgaon, Mumbai supplying heavy steamer shafts, carbon steel, alloy steel round bars, forged rounds, MS rounds, heavy seamless pipes, and hacksaw cutting since 1989.",
  address: {
    street: "Plot No. 156, 4th Lane",
    locality: "Darukhana, Mazgaon",
    landmark: "Darukhana Steel Market",
    city: "Mumbai",
    region: "Maharashtra",
    postalCode: "400010",
    country: "India",
    countryCode: "IN",
    fullFormatted: "Plot No. 156, 4th Lane, Darukhana, Mazgaon, Mumbai — 400010, Maharashtra, India",
  },
  coordinates: {
    latitude: 18.968,
    longitude: 72.845,
  },
  landlines: [],
  contacts: [
    {
      name: "Kalpesh Shah",
      role: "Operations & Logistics",
      phone: "+919820023666",
      formattedPhone: "+91 98200 23666",
      whatsapp: "919820023666",
      isPrimary: true,
    },
    {
      name: "Ritesh Shah",
      role: "Sales & Technical Enquiries",
      phone: "+919324797660",
      formattedPhone: "+91 93247 97660",
      whatsapp: "919324797660",
      isPrimary: false,
    },
  ],
  primaryWhatsAppNumber: "919820023666",
  email: "shahindenterprise@rediffmail.com",
  salesEmail: "shahindenterprise@rediffmail.com",
  hours: "Monday to Saturday, 9:00 AM to 7:00 PM IST",
  serviceAreas: [
    "Darukhana",
    "Mazgaon",
    "Mumbai",
    "Navi Mumbai",
    "Thane",
    "Pune",
    "Maharashtra",
    "Gujarat",
    "Goa",
    "Karnataka",
    "Pan-India (18 States)",
  ],
  industries: [
    "Sugar Mills & Processing",
    "Marine & Offshore",
    "Earthmoving & Heavy Construction",
    "General Engineering & Machining",
    "Hydraulic Press Manufacturers",
    "Plastic Dies & Moulds",
    "Textile Machinery",
    "Paper & Pulp Machinery",
    "Forging & Casting Plants",
    "Plate Bending & Heavy Fabrication",
  ],
};

export type ProductCategory = "RAW_MATERIAL" | "ALLOY" | "SERVICE";

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface SteelGradeDetail {
  grade: string;
  standardEquivalent: string;
  carbonContent: string;
  tensileStrength: string;
  recommendedUse: string;
}

export interface CatalogProduct {
  slug: string;
  title: string;
  shortTitle?: string;
  category: ProductCategory;
  categoryLabel: string;
  tagline: string;
  fullDescription: string;
  isFeatured?: boolean;
  displayOrder: number;
  specs: ProductSpecification[];
  availableGrades?: string[];
  gradeDetails?: SteelGradeDetail[];
  diameterRange?: string;
  lengthRange?: string;
  finishOptions?: string[];
  applications: string[];
  cutToSizeAvailable: boolean;
  testingAvailable?: string[];
}

export const CANONICAL_PRODUCTS: CatalogProduct[] = [
  {
    slug: "heavy-steamer-shafts",
    title: "Heavy Steamer Shafts & Marine Shafts",
    shortTitle: "Steamer Shafts",
    category: "RAW_MATERIAL",
    categoryLabel: "Shaft Stock",
    tagline: "Large-diameter forged and turned shafts engineered for high torque, marine drives, and heavy milling operations.",
    fullDescription:
      "Shah Industrial Enterprise supplies heavy steamer shafts and marine shaft stock ranging from 100mm to 1000mm diameter. Sourced for critical industrial drives, ship repair, and sugar mill crushing rollers, our shaft materials are available cut-to-length with strict dimensional compliance from our Darukhana yard.",
    isFeatured: true,
    displayOrder: 1,
    specs: [
      { label: "Diameter", value: "Ø 100mm – 1000mm" },
      { label: "Grades", value: "EN8, EN9, EN19, EN24, Class 4" },
      { label: "Condition", value: "Forged / Rough Turned" },
      { label: "Tolerance", value: "± 1.0mm Cut Length" },
      { label: "Dispatch", value: "Cut-to-size ready" },
    ],
    availableGrades: ["EN8", "EN9", "EN19", "EN24", "Class 4 Forged"],
    gradeDetails: [
      {
        grade: "EN8 / 080M40",
        standardEquivalent: "AISI 1040 / DIN C45",
        carbonContent: "0.36 – 0.44% C",
        tensileStrength: "550 – 700 MPa",
        recommendedUse: "General machinery shafts, connecting rods, axle shafts.",
      },
      {
        grade: "EN9 / 070M55",
        standardEquivalent: "AISI 1055",
        carbonContent: "0.50 – 0.60% C",
        tensileStrength: "650 – 850 MPa",
        recommendedUse: "Sugar mill rollers, heavy wear pins, high-torque drive shafts.",
      },
      {
        grade: "EN24 / 817M40",
        standardEquivalent: "AISI 4340 / 34CrNiMo6",
        carbonContent: "0.36 – 0.44% C, Ni-Cr-Mo",
        tensileStrength: "850 – 1000+ MPa",
        recommendedUse: "High tensile marine propeller shafts, heavy crane pins, power drives.",
      },
    ],
    diameterRange: "100 mm to 1000 mm dia",
    lengthRange: "Custom cut lengths up to 6000 mm",
    finishOptions: ["Black As-Forged", "Rough Turned", "Peeled"],
    applications: [
      "Marine propeller shafting and rudder stock",
      "Sugar mill crushing roller main shafts",
      "Heavy hydraulic press column tie rods",
      "Turbine drive shafts and reduction gear stock",
    ],
    cutToSizeAvailable: true,
    testingAvailable: ["Mill Test Certificate", "Ultrasonic Testing (UT)", "Chemical & Mechanical Reports"],
  },
  {
    slug: "custom-hacksaw-cutting",
    title: "Custom Hacksaw Cutting Service",
    shortTitle: "Hacksaw Cutting",
    category: "SERVICE",
    categoryLabel: "Processing",
    tagline: "High-precision cut-to-size material processing with ±1mm tolerance. Zero workshop wastage.",
    fullDescription:
      "Equipped with heavy industrial hacksaw and bandsaw machinery at our Mazgaon yard, we cut mild steel, carbon steel, and high-tensile alloy rods to exact workshop drawings. Eliminates raw stock handling overhead for CNC machine shops, fabrication units, and maintenance teams.",
    isFeatured: true,
    displayOrder: 2,
    specs: [
      { label: "Cutting Capacity", value: "Up to Ø 300mm" },
      { label: "Tolerance", value: "± 1.0mm" },
      { label: "Materials", value: "MS, Carbon, Alloy Steel" },
      { label: "Turnaround", value: "Same day on stock" },
    ],
    diameterRange: "Up to Ø 300 mm",
    lengthRange: "Any length as per drawing",
    finishOptions: ["Square Cut End", "Deburred"],
    applications: [
      "Lathe & CNC turning blanks",
      "Gear blanks and flange stock",
      "Bespoke replacement pins and bushings",
      "Emergency breakdown maintenance pieces",
    ],
    cutToSizeAvailable: true,
  },
  {
    slug: "mild-steel-shafts",
    title: "M.S. & Carbon Steel Rounds",
    shortTitle: "MS Rounds",
    category: "RAW_MATERIAL",
    categoryLabel: "Carbon Steel",
    tagline: "Bright and black finish steel rounds in standard lengths and custom cut pieces for general fabrication.",
    fullDescription:
      "Mild steel rounds conforming to IS 2062 Grade A and Grade B standards. Available in diameters from 12mm to 250mm, these rounds offer reliable weldability and uniform machinability for structural engineering, shafts, and general manufacturing.",
    isFeatured: false,
    displayOrder: 3,
    specs: [
      { label: "Diameter", value: "Ø 12 – 250mm" },
      { label: "Lengths", value: "3m to 6m standard" },
      { label: "Standard", value: "IS 2062 Grade A/B" },
      { label: "Form", value: "Rolled & Forged" },
    ],
    availableGrades: ["IS 2062 Gr A", "IS 2062 Gr B", "SAE 1018"],
    diameterRange: "12 mm to 250 mm dia",
    lengthRange: "3 meters to 6 meters standard or cut to size",
    finishOptions: ["Black Rolled", "Bright Turned"],
    applications: [
      "Machinery axles and shafting",
      "Fabrication framework and structural members",
      "Foundation anchor bolts and studs",
      "Flanges and general engineering components",
    ],
    cutToSizeAvailable: true,
  },
  {
    slug: "carbon-steel-rods",
    title: "Carbon Steel Rods (EN8, EN9)",
    shortTitle: "Carbon Rods",
    category: "ALLOY",
    categoryLabel: "Medium Carbon",
    tagline: "High-tensile forged and peeled bars in EN8 and EN9 grades. Normalized for uniform machinability.",
    fullDescription:
      "Medium carbon engineering steel bars in EN8 (080M40) and EN9 (070M55). Ideal for components requiring higher strength and wear resistance than mild steel without requiring expensive alloy additions.",
    isFeatured: false,
    displayOrder: 4,
    specs: [
      { label: "Grades", value: "EN8, EN9, C45" },
      { label: "Finish", value: "Forged, Peeled, Black" },
      { label: "Condition", value: "Normalized" },
      { label: "Hardness", value: "180 – 220 HB" },
    ],
    availableGrades: ["EN8", "EN9", "C45", "AISI 1045"],
    diameterRange: "20 mm to 300 mm dia",
    lengthRange: "Random or cut to size",
    finishOptions: ["Black Forged", "Peeled / Bright"],
    applications: [
      "Automotive axles and crankshafts",
      "Gears, sprockets, and splines",
      "Hydraulic cylinder tie-rods",
      "Keys, studs, and high-load fasteners",
    ],
    cutToSizeAvailable: true,
  },
  {
    slug: "alloy-steel-round-bars",
    title: "N.S. & Alloy Steel Round Bars",
    shortTitle: "Alloy Steel Bars",
    category: "ALLOY",
    categoryLabel: "Alloy Steel",
    tagline: "High-strength alloy steel rounds tailored for heavy-duty automotive, marine, and power generation components.",
    fullDescription:
      "Chromium-molybdenum and nickel-chromium-molybdenum alloy steel bars including EN19 (4140), EN24 (4340), and EN353. Designed for extreme fatigue resistance, high torque, and critical load-bearing performance.",
    isFeatured: false,
    displayOrder: 5,
    specs: [
      { label: "Grades", value: "EN19, EN24, EN353, EN31" },
      { label: "Diameter", value: "Ø 100mm – 1000mm" },
      { label: "Finish", value: "Black, Peeled, Ground" },
      { label: "Heat Treat", value: "Annealed / Normalized / Q+T" },
    ],
    availableGrades: ["EN19", "EN24", "EN353", "EN31", "AISI 4140", "AISI 4340"],
    diameterRange: "100 mm to 1000 mm dia",
    lengthRange: "Custom cut lengths as requested",
    finishOptions: ["Black", "Peeled", "Rough Turned"],
    applications: [
      "Heavy transmission gears and pinions",
      "High-stress engine and compressor shafts",
      "Die holders and extrusion tooling components",
      "Marine propulsion shafting",
    ],
    cutToSizeAvailable: true,
  },
  {
    slug: "forged-steel-round-bars",
    title: "Forged Steel Round Bars",
    shortTitle: "Forged Rounds",
    category: "ALLOY",
    categoryLabel: "Heavy Forging",
    tagline: "Superior grain flow forged rounds for maximum structural integrity, high impact resistance, and ultrasonic sound quality.",
    fullDescription:
      "Open-die forged round bars from 200mm to 600mm diameter. High reduction forging guarantees dense core structure, minimal porosity, and superior mechanical properties under shock loading.",
    isFeatured: true,
    displayOrder: 6,
    specs: [
      { label: "Grades", value: "Class 4, EN8, EN9, EN19, EN24" },
      { label: "Diameter", value: "Ø 200mm – 600mm" },
      { label: "Condition", value: "Normalized, UT Tested" },
      { label: "Soundness", value: "Ultrasonic Class A/B" },
    ],
    availableGrades: ["Class 4 Forged", "EN8 Forged", "EN9 Forged", "EN24 Forged"],
    diameterRange: "200 mm to 600 mm dia",
    lengthRange: "1000 mm to 6000 mm",
    finishOptions: ["Black Forged", "Rough Turned"],
    applications: [
      "Heavy industrial rolls and gear blanks",
      "Forging hammer dies and press rams",
      "Shipboard machinery shafting",
      "Cement mill and crushing components",
    ],
    cutToSizeAvailable: true,
  },
  {
    slug: "hydraulic-shafts",
    title: "Hydraulic Shafts & Chrome Plated Rods",
    shortTitle: "Hydraulic Shafts",
    category: "RAW_MATERIAL",
    categoryLabel: "Fluid Power",
    tagline: "Hard chrome plated and induction hardened round bars for earthmoving, fluid power cylinders, and linear guide systems.",
    fullDescription:
      "Precision ground and hard chrome plated steel shafting. Provides superior corrosion resistance, low friction seal contact, and high surface hardness for hydraulic and pneumatic cylinder rods.",
    isFeatured: false,
    displayOrder: 7,
    specs: [
      { label: "Surface", value: "Hard Chrome Plated (20-30 µm)" },
      { label: "Hardness", value: "Induction Hardened (HRC 55-60)" },
      { label: "Usage", value: "Cylinders, Pumps, Earthmoving" },
      { label: "Base Steel", value: "EN8D, C45, 20MnV6" },
    ],
    availableGrades: ["EN8D Chrome Plated", "C45 Hard Chrome", "20MnV6"],
    diameterRange: "20 mm to 200 mm dia",
    lengthRange: "Standard 6m or cut to stroke length",
    finishOptions: ["Micro-inch Mirror Chrome Finish"],
    applications: [
      "Excavator and crane hydraulic cylinders",
      "Forklift mast rams and agricultural hydraulics",
      "Plastic injection moulding tie-bars",
      "Linear bearing guide rails",
    ],
    cutToSizeAvailable: true,
  },
  {
    slug: "roller-shafts",
    title: "Roller Shafts (Sugar & Crushing Mills)",
    shortTitle: "Roller Shafts",
    category: "RAW_MATERIAL",
    categoryLabel: "Heavy Drives",
    tagline: "Precision-machined shafts optimized for immense torque in sugar mills, steel re-rolling mills, and rubber crushers.",
    fullDescription:
      "Heavy roller shaft blanks manufactured to withstand continuous torsional fatigue and corrosive process fluids in sugar processing and mineral crushing plants.",
    isFeatured: false,
    displayOrder: 8,
    specs: [
      { label: "Material", value: "EN8, EN9, EN19 Forged" },
      { label: "Application", value: "Crushing & Milling Machinery" },
      { label: "Tolerance", value: "High Precision Turn & Cut" },
      { label: "Diameter", value: "Ø 150mm – 600mm" },
    ],
    availableGrades: ["EN8", "EN9", "EN19 Forged"],
    diameterRange: "150 mm to 600 mm dia",
    lengthRange: "2000 mm to 6000 mm",
    finishOptions: ["Rough Turned", "Finish Turned Stock"],
    applications: [
      "Sugar mill three-roller and four-roller drives",
      "Rubber mixing mill rolls",
      "Paper and textile calendering rollers",
      "Conveyor drive head pulleys",
    ],
    cutToSizeAvailable: true,
  },
  {
    slug: "heavy-seamless-pipes",
    title: "Heavy Seamless Pipes & Tubes",
    shortTitle: "Seamless Pipes",
    category: "RAW_MATERIAL",
    categoryLabel: "Pipes & Tubes",
    tagline: "Heavy wall seamless and ERW steel tubes offering high burst strength for industrial hydraulic lines and structural sleeves.",
    fullDescription:
      "Heavy wall seamless steel pipes and tubes for high pressure fluid conveyance, cylinder barrels, and structural fabrication. Conforms to ASTM, API, and IS specifications.",
    isFeatured: false,
    displayOrder: 9,
    specs: [
      { label: "Types", value: "Heavy Wall Seamless, ERW" },
      { label: "Schedule", value: "Sch 40, Sch 80, Sch 160, XXS" },
      { label: "Standard", value: "ASTM A106, IS 1239, API 5L" },
      { label: "Cut-to-size", value: "Available" },
    ],
    availableGrades: ["ASTM A106 Gr B", "IS 1239", "IS 3589", "API 5L"],
    diameterRange: "1/2 inch to 24 inch NB",
    lengthRange: "Random 6m or custom cut pieces",
    finishOptions: ["Black Plain End", "Beveled End"],
    applications: [
      "Hydraulic cylinder barrels and sleeves",
      "High-pressure steam and oil pipelines",
      "Heavy machinery structural columns",
      "Bushing and sleeve hollow stock",
    ],
    cutToSizeAvailable: true,
  },
  {
    slug: "iron-steel-plates",
    title: "Iron & Steel Plates (IS 2062 / Boiler Quality)",
    shortTitle: "Steel Plates",
    category: "RAW_MATERIAL",
    categoryLabel: "Plates",
    tagline: "Structural and boiler quality steel plates for heavy engineering, fabrication, marine vessels, and press beds.",
    fullDescription:
      "Hot rolled mild steel and carbon steel plates ranging from 5mm to 150mm thickness. Available in full sheets or profile cut to drawings.",
    isFeatured: false,
    displayOrder: 10,
    specs: [
      { label: "Grades", value: "IS 2062 E250 / ASTM A36 / BQ" },
      { label: "Thickness", value: "5mm – 150mm" },
      { label: "Profile Cutting", value: "Gas / Plasma available" },
      { label: "Form", value: "Hot Rolled Prime Plates" },
    ],
    availableGrades: ["IS 2062 Gr A/B", "ASTM A36", "ASTM A516 Gr 70"],
    diameterRange: "5 mm to 150 mm thickness",
    lengthRange: "Standard sheet sizes or profile cut",
    finishOptions: ["Mill Scale As Rolled", "Shot Blasted"],
    applications: [
      "Heavy machine base frames and press beds",
      "Marine hull structures and bulkhead plates",
      "Pressure vessel flanges and end covers",
      "Earthmoving equipment wear liners",
    ],
    cutToSizeAvailable: true,
  },
  {
    slug: "iron-steel-bars",
    title: "Iron & Steel Profile Bars (Flat, Square, Hex)",
    shortTitle: "Steel Profiles",
    category: "RAW_MATERIAL",
    categoryLabel: "Structural Profiles",
    tagline: "Versatile flat, square, and hexagonal steel profiles for toolmaking, general engineering, and fixture construction.",
    fullDescription:
      "Solid rectangular flats, square bars, and hexagonal bars in mild steel and EN8 carbon steel. Cut to size for workshop tooling, brackets, and fixtures.",
    isFeatured: false,
    displayOrder: 11,
    specs: [
      { label: "Profiles", value: "Flat, Square, Hexagonal" },
      { label: "Grades", value: "IS 2062, EN8, C45" },
      { label: "Lengths", value: "Custom Cut or 6m standard" },
      { label: "Finish", value: "Hot Rolled & Bright Drawn" },
    ],
    availableGrades: ["IS 2062", "EN8", "EN1A"],
    diameterRange: "Flats: 12x3mm to 300x50mm | Squares: 10mm to 150mm",
    lengthRange: "Custom cut lengths available",
    finishOptions: ["Black Rolled", "Bright Cold Drawn"],
    applications: [
      "Machinery brackets, clamps, and fixtures",
      "Shaft keys and drive couplings",
      "General architectural and industrial fabrication",
    ],
    cutToSizeAvailable: true,
  },
];

export const SEO_FAQS = [
  {
    question: "Where is Shah Industrial Enterprise located?",
    answer:
      "Shah Industrial Enterprise operates from Plot No. 156, 4th Lane, Darukhana, Mazgaon, Mumbai 400010 — a historic and central industrial metal and steel trading hub in India.",
  },
  {
    question: "What materials and steel grades does Shah Industrial Enterprise supply?",
    answer:
      "We supply heavy steamer shafts, mild steel rounds, carbon steel rounds, forged rounds (200mm to 600mm dia), alloy steel round bars (100mm to 1000mm dia), hydraulic shafts, heavy seamless pipes, and steel plates. Common grades include EN8, EN9, EN19, EN24, EN31, EN353, C45, and IS 2062.",
  },
  {
    question: "Does Shah Industrial Enterprise provide cut-to-size steel?",
    answer:
      "Yes. We specialize in custom hacksaw and bandsaw cutting with a ±1.0mm tolerance for shafts, rods, and heavy bars, saving machining setup time and eliminating scrap waste for workshops.",
  },
  {
    question: "How fast can I get a quotation for steel materials?",
    answer:
      "Our owner-led sales desk typically delivers quotations within 2 hours. You can request a quote via our website RFQ form, direct phone call, or instant WhatsApp inquiry with your grade, diameter, cut length, and quantity.",
  },
  {
    question: "Can you supply steel outside Mumbai and Maharashtra?",
    answer:
      "Yes. Shah Industrial Enterprise supplies materials to clients across 18 states in India, coordinating dispatch directly from our Mazgaon yard to engineering centers, sugar mills, and shipyards nationwide.",
  },
  {
    question: "Are Material Test Certificates (MTC) and Ultrasonic Testing (UT) reports available?",
    answer:
      "Yes. We supply materials with test certificates, chemical analysis, mechanical test reports, and ultrasonic testing (UT) certificates upon request for critical industrial and marine applications.",
  },
];
