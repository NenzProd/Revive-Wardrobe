import axios from "axios";

export interface VisibleCategory {
  category: string;
  slug: string;
  enabled: boolean;
  sortOrder?: number;
}

export const FALLBACK_VISIBLE_CATEGORIES: VisibleCategory[] = [
  { category: "Graceful Abayas", slug: "graceful-abayas", enabled: true, sortOrder: 1 },
  { category: "Ethnic Elegance", slug: "ethnic-elegance", enabled: true, sortOrder: 2 },
  { category: "Jalabiya", slug: "jalabiya", enabled: true, sortOrder: 3 },
];

let categoriesEndpointMissing = false;
let categoriesCache: VisibleCategory[] | null = null;
let inflight: Promise<VisibleCategory[]> | null = null;

const normalizeCategories = (categories: VisibleCategory[] = []) =>
  categories
    .filter((entry) => entry?.category && entry?.slug)
    .map((entry) => ({
      category: String(entry.category),
      slug: String(entry.slug),
      enabled: Boolean(entry.enabled),
      sortOrder: Number.isFinite(Number(entry.sortOrder)) ? Number(entry.sortOrder) : 999,
    }));

export const getVisibleCategories = async (baseUrl: string): Promise<VisibleCategory[]> => {
  if (categoriesEndpointMissing && categoriesCache) {
    return categoriesCache;
  }

  if (inflight) {
    return inflight;
  }

  inflight = (async () => {
    try {
      const res = await axios.get(baseUrl + "/api/product/categories");
      if (res.data?.success && Array.isArray(res.data.categories)) {
        const normalized = normalizeCategories(res.data.categories);
        if (normalized.length > 0) {
          categoriesCache = normalized;
          return normalized;
        }
      }
    } catch (error: any) {
      const status = Number(error?.response?.status || 0);
      if (status === 404) {
        categoriesEndpointMissing = true;
      }
    }

    categoriesCache = FALLBACK_VISIBLE_CATEGORIES;
    return FALLBACK_VISIBLE_CATEGORIES;
  })().finally(() => {
    inflight = null;
  });

  return inflight;
};
