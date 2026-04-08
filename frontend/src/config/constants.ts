
// Global application constants
export const priceSymbol = "AED";

const normalizeBackendUrl = (rawUrl?: string) => {
  const fallback = "http://localhost:4000";
  const source = (rawUrl || fallback).trim();
  if (!source) return fallback;

  const withoutTrailingSlash = source.replace(/\/+$/, "");
  // Allow env values that already include "/api" while code appends "/api/..."
  if (/\/api$/i.test(withoutTrailingSlash)) {
    return withoutTrailingSlash.replace(/\/api$/i, "");
  }

  return withoutTrailingSlash;
};

export const backendUrl = normalizeBackendUrl(import.meta.env.VITE_BACKEND_URL);
