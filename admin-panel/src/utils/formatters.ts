export const formatCurrency = (val: number | string, currency: string = 'INR'): string => {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatDate = (val: any): string => {
  if (!val) return 'N/A';
  try {
    return new Date(val).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return String(val);
  }
};
