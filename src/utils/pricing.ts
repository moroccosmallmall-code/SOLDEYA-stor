/**
 * Store Pricing Calculations
 * Master Specification:
 * - Principal Price (e.g. 199 DH)
 * - Compare Price: Principal * (330 / 199)
 * - Wholesale Price: Principal * (150 / 199)
 * - Wholesale rule: Quantity >= 3 applies wholesale price
 */

export function calculateComparePrice(principal: number): number {
  if (!principal || principal <= 0) return 0;
  return Math.round(principal * (330 / 199));
}

export function calculateWholesalePrice(principal: number): number {
  if (!principal || principal <= 0) return 0;
  return Math.round(principal * (150 / 199));
}

export function getEffectiveUnitPrice(principal: number, quantity: number): {
  unitPrice: number;
  isWholesale: boolean;
  total: number;
  savedAmount: number;
} {
  const isWholesale = quantity >= 3;
  const wholesale = calculateWholesalePrice(principal);
  const unitPrice = isWholesale ? wholesale : principal;
  const total = unitPrice * quantity;
  const regularTotal = principal * quantity;
  const savedAmount = isWholesale ? regularTotal - total : 0;

  return {
    unitPrice,
    isWholesale,
    total,
    savedAmount,
  };
}
