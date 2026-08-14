export type ShapeRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export function shapeRadiusValue(radius: ShapeRadius): string {
  return radius === 'none' ? 'var(--radius-0)' : `var(--radius-${radius})`;
}
