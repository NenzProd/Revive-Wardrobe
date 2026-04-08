const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const getVariantRetailPrice = (variant) =>
  Math.max(toNumber(variant?.retail_price), 0);

export const getVariantDiscount = (variant) =>
  Math.max(toNumber(variant?.discount), 0);

export const getVariantFinalPrice = (variant) =>
  Math.max(getVariantRetailPrice(variant) - getVariantDiscount(variant), 0);

export const normalizeStock = (stock) => Math.max(toNumber(stock), 0);

export const getPreferredVariant = (variants = [], preferredSize) => {
  if (!Array.isArray(variants) || variants.length === 0) {
    return null;
  }

  if (preferredSize) {
    const preferred = variants.find((variant) => variant?.filter_value === preferredSize);
    if (preferred) {
      return preferred;
    }
  }

  return (
    variants.find(
      (variant) => getVariantRetailPrice(variant) > 0 && normalizeStock(variant?.stock) > 0
    ) ||
    variants.find((variant) => getVariantRetailPrice(variant) > 0) ||
    variants.find((variant) => normalizeStock(variant?.stock) > 0) ||
    variants[0]
  );
};
