export type SteelShape = 'ROUND_BAR' | 'HOLLOW_PIPE' | 'SQUARE_BAR' | 'FLAT_BAR' | 'HEX_BAR' | 'PLATE';

export interface DensityPreset {
  name: string;
  density: number; // g/cm³ or kg/dm³
}

export const DENSITY_PRESETS: Record<string, DensityPreset> = {
  CARBON_STEEL: { name: 'Carbon Steel (EN8, EN9, C45, MS)', density: 7.85 },
  ALLOY_STEEL: { name: 'Alloy Steel (EN19, EN24, EN31, EN353)', density: 7.85 },
  STAINLESS_304: { name: 'Stainless Steel (AISI 304 / 316)', density: 7.93 },
  TOOL_STEEL: { name: 'Tool & Die Steel (D2, H13)', density: 7.80 },
};

export interface CalculationInput {
  shape: SteelShape;
  density: number; // in g/cm³
  // Dimensions in mm
  diameter?: number;
  outerDiameter?: number;
  innerDiameter?: number;
  wallThickness?: number;
  side?: number;
  width?: number;
  thickness?: number;
  acrossFlats?: number;
  lengthMm: number;
  quantity: number;
}

export interface CalculationResult {
  singleWeightKg: number;
  totalWeightKg: number;
  totalWeightTons: number;
  volumeCm3: number;
  formulaDescription: string;
}

/**
 * Calculates weight of steel profiles based on dimensions in millimeters and density in g/cm³.
 */
export function calculateSteelWeight(input: CalculationInput): CalculationResult {
  const { shape, density, lengthMm, quantity } = input;
  const lengthCm = lengthMm / 10;
  let volumeCm3 = 0;
  let formulaDesc = '';

  switch (shape) {
    case 'ROUND_BAR': {
      const dMm = input.diameter || 0;
      const rCm = dMm / 20; // radius in cm
      volumeCm3 = Math.PI * rCm * rCm * lengthCm;
      formulaDesc = `π × (${dMm}/2)² × ${lengthMm} × ${density} × 10⁻⁶`;
      break;
    }
    case 'HOLLOW_PIPE': {
      const odMm = input.outerDiameter || 0;
      let idMm = input.innerDiameter || 0;
      if (input.wallThickness && !input.innerDiameter) {
        idMm = Math.max(0, odMm - 2 * input.wallThickness);
      }
      const rOutCm = odMm / 20;
      const rInCm = idMm / 20;
      volumeCm3 = Math.PI * (rOutCm * rOutCm - rInCm * rInCm) * lengthCm;
      formulaDesc = `π × [(${odMm}/2)² - (${idMm}/2)²] × ${lengthMm} × ${density} × 10⁻⁶`;
      break;
    }
    case 'SQUARE_BAR': {
      const sideMm = input.side || 0;
      const sideCm = sideMm / 10;
      volumeCm3 = sideCm * sideCm * lengthCm;
      formulaDesc = `${sideMm}² × ${lengthMm} × ${density} × 10⁻⁶`;
      break;
    }
    case 'FLAT_BAR':
    case 'PLATE': {
      const wMm = input.width || 0;
      const tMm = input.thickness || 0;
      const wCm = wMm / 10;
      const tCm = tMm / 10;
      volumeCm3 = wCm * tCm * lengthCm;
      formulaDesc = `${wMm} × ${tMm} × ${lengthMm} × ${density} × 10⁻⁶`;
      break;
    }
    case 'HEX_BAR': {
      const afMm = input.acrossFlats || 0;
      const afCm = afMm / 10;
      // Area of regular hexagon = (3 * sqrt(3) / 2) * (AF / sqrt(3))^2 = (sqrt(3) / 2) * AF^2 = 0.866025 * AF^2
      const areaCm2 = 0.866025404 * afCm * afCm;
      volumeCm3 = areaCm2 * lengthCm;
      formulaDesc = `0.866 × ${afMm}² × ${lengthMm} × ${density} × 10⁻⁶`;
      break;
    }
  }

  // Weight in kg = volume (cm³) * density (g/cm³) / 1000
  const singleWeightKg = (volumeCm3 * density) / 1000;
  const totalWeightKg = singleWeightKg * Math.max(1, quantity);
  const totalWeightTons = totalWeightKg / 1000;

  return {
    singleWeightKg: Number(singleWeightKg.toFixed(3)),
    totalWeightKg: Number(totalWeightKg.toFixed(2)),
    totalWeightTons: Number(totalWeightTons.toFixed(4)),
    volumeCm3: Number(volumeCm3.toFixed(2)),
    formulaDescription: formulaDesc,
  };
}
