import type { CatalogProduct } from './config';

export function getPrefill(productSlug: string | undefined, gradeCode: string | undefined, products: CatalogProduct[], grades: string[]) {
  const product = products.find(p => p.slug === productSlug);
  const grade = grades.find(g => g.toLowerCase() === gradeCode?.toLowerCase());
  return { ...(product && { productType: product.title }), ...(grade && { materialGrade: grade }) };
}

export function getDimensionLabels(productType: string) {
  const plate = /plate/i.test(productType);
  return { plate, primary: plate ? 'Primary size / OD (if applicable)' : /profile|hex|square|flat/i.test(productType) ? 'Across flats / profile width' : 'Outer diameter' };
}

export function buildItemRemarks(item: { remarks: string; condition: string; thickness: string; width: string; standard: string }) {
  return [item.condition && `Material condition: ${item.condition}`, item.thickness && `Thickness: ${item.thickness} mm`, item.width && `Width: ${item.width} mm`, item.standard && `Standard: ${item.standard}`, item.remarks && `Notes: ${item.remarks}`].filter(Boolean).join('; ');
}

