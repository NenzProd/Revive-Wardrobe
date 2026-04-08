import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { backendUrl } from "../config/constants";

export interface VisibleCategory {
  category: string;
  slug: string;
  enabled: boolean;
  sortOrder?: number;
}

const FALLBACK_CATEGORIES: VisibleCategory[] = [
  { category: "Graceful Abayas", slug: "graceful-abayas", enabled: true, sortOrder: 1 },
  { category: "Ethnic Elegance", slug: "ethnic-elegance", enabled: true, sortOrder: 2 },
  { category: "Jalabiya", slug: "jalabiya", enabled: true, sortOrder: 3 },
];

export const useVisibleCategories = () => {
  const [categories, setCategories] = useState<VisibleCategory[]>(FALLBACK_CATEGORIES);

  useEffect(() => {
    let mounted = true;
    const fetchCategories = async () => {
      try {
        const res = await axios.get(backendUrl + "/api/product/categories");
        if (!mounted) return;
        if (res.data?.success && Array.isArray(res.data.categories)) {
          setCategories(res.data.categories);
        }
      } catch (_) {}
    };

    fetchCategories();
    return () => {
      mounted = false;
    };
  }, []);

  const enabledCategories = useMemo(
    () => categories.filter((entry) => entry.enabled),
    [categories]
  );

  return { categories, enabledCategories };
};
