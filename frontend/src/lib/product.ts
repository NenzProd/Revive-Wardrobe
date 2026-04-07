import type { CartItem, Product, ProductVariant } from "../types/product";
import { deriveGeneralCategory } from "./category";

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const getVariantRetailPrice = (variant?: ProductVariant | null) =>
  Math.max(toNumber(variant?.retail_price), 0);

export const getVariantDiscount = (variant?: ProductVariant | null) =>
  Math.max(toNumber(variant?.discount), 0);

export const getVariantFinalPrice = (variant?: ProductVariant | null) =>
  Math.max(getVariantRetailPrice(variant) - getVariantDiscount(variant), 0);

export const isVariantSoldOut = (variant?: ProductVariant | null) =>
  toNumber(variant?.stock) === 0;

export const getPreferredVariant = (
  product?: Product | null,
  preferredSize?: string | null
) => {
  const variants = product?.variants || [];
  if (variants.length === 0) {
    return undefined;
  }

  if (preferredSize) {
    const preferredVariant = variants.find(
      (variant) => variant.filter_value === preferredSize
    );
    if (preferredVariant) {
      return preferredVariant;
    }
  }

  return (
    variants.find(
      (variant) =>
        getVariantRetailPrice(variant) > 0 && !isVariantSoldOut(variant)
    ) ||
    variants.find((variant) => getVariantRetailPrice(variant) > 0) ||
    variants.find((variant) => !isVariantSoldOut(variant)) ||
    variants[0]
  );
};

export const getProductDisplayPrice = (
  product?: Product | null,
  preferredSize?: string | null
) => getVariantRetailPrice(getPreferredVariant(product, preferredSize));

export const getProductFinalPrice = (
  product?: Product | null,
  preferredSize?: string | null
) => getVariantFinalPrice(getPreferredVariant(product, preferredSize));

export const getProductSalePrice = (
  product?: Product | null,
  preferredSize?: string | null
) => {
  const variant = getPreferredVariant(product, preferredSize);
  return getVariantDiscount(variant) > 0 ? getVariantFinalPrice(variant) : undefined;
};

export const getProductStock = (
  product?: Product | null,
  preferredSize?: string | null
) => toNumber(getPreferredVariant(product, preferredSize)?.stock);

export const isProductSoldOut = (product?: Product | null) => {
  const variants = product?.variants || [];
  return variants.length > 0 && variants.every((variant) => isVariantSoldOut(variant));
};

export const getCartItemVariant = (item?: CartItem | null) =>
  getPreferredVariant(item, item?.selectedSize);

export const getCartItemDisplayPrice = (item?: CartItem | null) =>
  getVariantRetailPrice(getCartItemVariant(item));

export const getCartItemFinalPrice = (item?: CartItem | null) =>
  getVariantFinalPrice(getCartItemVariant(item));

export const getCartItemLineTotal = (item?: CartItem | null) =>
  getCartItemFinalPrice(item) * Math.max(toNumber(item?.quantity), 0);

export const mapProductForUi = <T extends Product>(product: T) => ({
  ...product,
  sub_category: deriveGeneralCategory(product.category, product.sub_category),
  price: getProductDisplayPrice(product),
  salePrice: getProductSalePrice(product),
  sizes: product.variants
    ? Array.from(new Set(product.variants.map((variant) => variant.filter_value).filter(Boolean)))
    : [],
});
