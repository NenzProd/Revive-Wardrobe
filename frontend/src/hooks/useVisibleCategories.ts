import { useEffect, useMemo, useState } from "react";
import { backendUrl } from "../config/constants";
import {
  FALLBACK_VISIBLE_CATEGORIES,
  getVisibleCategories,
  type VisibleCategory,
} from "@/lib/categoryVisibility";

export const useVisibleCategories = () => {
  const [categories, setCategories] = useState<VisibleCategory[]>(FALLBACK_VISIBLE_CATEGORIES);

  useEffect(() => {
    let mounted = true;
    const fetchCategories = async () => {
      const nextCategories = await getVisibleCategories(backendUrl);
      if (!mounted) return;
      setCategories(nextCategories);
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
