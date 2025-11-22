
export const formatCurrency = (amount: number, currency = 'JOD'): string => {
  return new Intl.NumberFormat('ar-JO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ar-JO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Colors for charts
export const CHART_COLORS = [
  '#10B981', // Emerald 500
  '#3B82F6', // Blue 500
  '#F59E0B', // Amber 500
  '#EF4444', // Red 500
  '#8B5CF6', // Violet 500
  '#EC4899', // Pink 500
  '#6366F1', // Indigo 500
];
