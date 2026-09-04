export const isOutStatus = value => ['out', 'out-of-stock', 'out_of_stock', 'sold-out', 'sold_out', 'out-and-notify'].includes(String(value || '').toLowerCase());

export function isOutOfStock(product = {}) {
  if (product.is_available === false || product.is_out_of_stock === true) return true;
  if (product.is_available === true || product.unlimited_quantity === true) return false;
  if (isOutStatus(product.status)) return true;
  const quantity = product.quantity == null || product.quantity === '' ? NaN : Number(product.quantity);
  return Number.isFinite(quantity) && quantity <= 0 && !['donating', 'financial_support'].includes(product.type);
}

export function mergeProductDetails(fallback, full) {
  const merged = { ...fallback, ...full };
  // Stock fields form one snapshot. Never combine new stock with old availability.
  const keys = ['is_available', 'is_out_of_stock', 'unlimited_quantity', 'status', 'quantity'];
  if (keys.some(key => full[key] !== undefined && full[key] !== null && full[key] !== '')) {
    keys.forEach(key => { delete merged[key]; });
    keys.forEach(key => { if (full[key] != null) merged[key] = full[key]; });
  }
  return merged;
}
