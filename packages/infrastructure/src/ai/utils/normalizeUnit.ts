import type { Unit } from '@maestro/domain';

export function normalizeUnit(unit?: string): Unit {
  if (!unit) return 'u';

  const v = unit.toLowerCase().trim();

  switch (v) {
    case 'm2':
    case 'm²':
    case 'mètre carré':
      return 'm²';
    case 'm3':
    case 'm³':
      return 'm³';
    case 'ml':
      return 'ml';
    case 'kg':
      return 'kg';
    case 'h':
    case 'heure':
    case 'heures':
      return 'h';
    case 'forfait':
      return 'forfait';
    default:
      return 'u';
  }
}
