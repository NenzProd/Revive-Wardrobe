const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const getVariantRetailPrice = (variant) =>
  Math.max(toNumber(variant?.retail_price), 0);

export const getVariantDiscount = (variant) => {
  const discount = Math.max(toNumber(variant?.discount), 0);
  return Math.min(discount, 100);
};

export const getVariantOfferPrice = (variant) => {
  const retailPrice = getVariantRetailPrice(variant);
  const explicitOffer = Math.max(toNumber(variant?.offer_price), 0);

  if (explicitOffer > 0 && explicitOffer <= retailPrice) {
    return explicitOffer;
  }

  const discount = getVariantDiscount(variant);
  return Math.max(Math.round(retailPrice - (retailPrice * discount) / 100), 0);
};

export const getVariantFinalPrice = (variant) =>
  getVariantOfferPrice(variant);

export const normalizeStock = (stock) => Math.max(toNumber(stock), 0);

export const calculatePricing = ({ retailPrice, discount, offerPrice }) => {
  const normalizedRetail = Math.max(toNumber(retailPrice), 0);
  const normalizedDiscount = Math.min(Math.max(toNumber(discount), 0), 100);
  const normalizedOffer = Math.max(toNumber(offerPrice), 0);

  if (normalizedRetail <= 0) {
    return { offerPrice: 0, discount: 0 };
  }

  if (normalizedDiscount > 0) {
    const calculatedOffer = normalizedRetail - (normalizedRetail * normalizedDiscount) / 100;
    return {
      offerPrice: Math.round(Math.max(calculatedOffer, 0)),
      discount: normalizedDiscount,
    };
  }

  if (normalizedOffer > 0 && normalizedOffer <= normalizedRetail) {
    const calculatedDiscount = ((normalizedRetail - normalizedOffer) / normalizedRetail) * 100;
    return {
      offerPrice: Math.round(normalizedOffer),
      discount: Math.round(Math.max(calculatedDiscount, 0)),
    };
  }

  return { offerPrice: normalizedRetail, discount: 0 };
};

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
