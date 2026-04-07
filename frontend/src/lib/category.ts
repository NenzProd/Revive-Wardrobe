import type { Product } from "../types/product";

const CATEGORY_SUBCATEGORY_MAP: Record<string, string> = {
  "Graceful Abayas": "Abaya",
  "Ethnic Elegance": "Pakistani Wear",
  Jalabiya: "Jalabiya",
  "Intimate Collection": "Intimate Wear",
  "Stitching Services": "Stitching Service",
};

const PRIMARY_BADGE_STYLES: Record<string, string> = {
  "Graceful Abayas": "border-rose-200 bg-rose-50 text-rose-700",
  "Ethnic Elegance": "border-emerald-200 bg-emerald-50 text-emerald-700",
  Jalabiya: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  "Intimate Collection": "border-violet-200 bg-violet-50 text-violet-700",
  "Stitching Services": "border-amber-200 bg-amber-50 text-amber-700",
};

const SECONDARY_BADGE_STYLES: Record<string, string> = {
  Abaya: "border-slate-200 bg-slate-50 text-slate-700",
  "Pakistani Wear": "border-orange-200 bg-orange-50 text-orange-700",
  Jalabiya: "border-pink-200 bg-pink-50 text-pink-700",
  "Intimate Wear": "border-purple-200 bg-purple-50 text-purple-700",
  "Stitching Service": "border-yellow-200 bg-yellow-50 text-yellow-700",
};

const normalizeLabel = (value?: string | null) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";

export const deriveGeneralCategory = (
  category?: string | null,
  subCategory?: string | null
) => {
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

const getCategoryBadgeStyle = (label: string, kind: "primary" | "secondary") => {
  if (kind === "primary") {
    return PRIMARY_BADGE_STYLES[label] || "border-revive-red/20 bg-revive-red/5 text-revive-red";
  }

  return SECONDARY_BADGE_STYLES[label] || "border-gray-200 bg-gray-50 text-gray-700";
};

export const getProductCategoryBadges = (
  product?: Pick<Product, "category" | "sub_category"> | null
) => {
  const category = normalizeLabel(product?.category);
  const subCategory = deriveGeneralCategory(category, product?.sub_category);

  const badges = [];

  if (category) {
    badges.push({
      label: category,
      kind: "primary" as const,
      className: getCategoryBadgeStyle(category, "primary"),
    });
  }

  if (subCategory && subCategory !== category) {
    badges.push({
      label: subCategory,
      kind: "secondary" as const,
      className: getCategoryBadgeStyle(subCategory, "secondary"),
    });
  }

  return badges;
};
