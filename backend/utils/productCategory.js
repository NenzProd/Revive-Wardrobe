import productModel from "../models/productModel.js";
import {
  getPreferredVariant,
  getVariantFinalPrice,
  getVariantRetailPrice,
  normalizeStock,
} from "./pricing.js";

const CATEGORY_SUBCATEGORY_MAP = {
  "Graceful Abayas": "Abaya",
  "Ethnic Elegance": "Pakistani Wear",
  Jalabiya: "Jalabiya",
  "Intimate Collection": "Intimate Wear",
  "Stitching Services": "Stitching Service",
};

const normalizeLabel = (value) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";

export const deriveGeneralCategory = (category, subCategory) => {
  const normalizedCategory = normalizeLabel(category);
  const normalizedSubCategory = normalizeLabel(subCategory);

  if (normalizedSubCategory) {
    return normalizedSubCategory;
  }

  if (!normalizedCategory) {
    return "";
  }

  if (CATEGORY_SUBCATEGORY_MAP[normalizedCategory]) {
    return CATEGORY_SUBCATEGORY_MAP[normalizedCategory];
  }

  const lowerCategory = normalizedCategory.toLowerCase();

  if (lowerCategory.includes("abaya")) {
    return "Abaya";
  }

  if (lowerCategory.includes("ethnic") || lowerCategory.includes("pakistani")) {
    return "Pakistani Wear";
  }

  if (lowerCategory.includes("jalabiya")) {
    return "Jalabiya";
  }

  if (lowerCategory.includes("intimate")) {
    return "Intimate Wear";
  }

  if (lowerCategory.includes("stitching")) {
    return "Stitching Service";
  }

  return normalizedCategory;
};

export const normalizeProductCategoryFields = ({ category, sub_category }) => ({
  category: normalizeLabel(category),
  sub_category: deriveGeneralCategory(category, sub_category),
});

export const normalizeProductDocument = (product) => {
  const productObject =
    typeof product?.toObject === "function" ? product.toObject() : product;
  const variants = productObject?.variants || [];
  const primaryVariant = getPreferredVariant(variants);
  const price = getVariantRetailPrice(primaryVariant);
  const salePrice = getVariantFinalPrice(primaryVariant);
  const isSoldOut =
    Array.isArray(variants) &&
    variants.length > 0 &&
    variants.every((variant) => normalizeStock(variant?.stock) === 0);

  return {
    ...productObject,
    ...normalizeProductCategoryFields(productObject || {}),
    price,
    salePrice: salePrice < price ? salePrice : undefined,
    isSale: salePrice < price,
    isSoldOut,
  };
};

export const backfillMissingProductSubCategories = async () => {
  const products = await productModel.find({
    $or: [
      { sub_category: { $exists: false } },
      { sub_category: null },
      { sub_category: "" },
    ],
  });

  const operations = products
    .map((product) => {
      const normalized = normalizeProductCategoryFields(product);

      if (!normalized.category || !normalized.sub_category) {
        return null;
      }

      return {
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: normalized,
          },
        },
      };
    })
    .filter(Boolean);

  if (operations.length === 0) {
    return { updatedCount: 0 };
  }

  const result = await productModel.bulkWrite(operations);

  return {
    updatedCount: result.modifiedCount ?? operations.length,
  };
};
