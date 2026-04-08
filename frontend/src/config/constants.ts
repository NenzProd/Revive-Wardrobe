
// Global application constants
export const priceSymbol = "AED";

const normalizeBackendUrl = (rawUrl?: string) => {
  const fallback = "http://localhost:4000";
  const source = (rawUrl || fallback).trim();
  if (!source) return fallback;

  const withoutTrailingSlash = source.replace(/\/+$/, "");
  // Support environments that already provide .../api
  if (/\/api$/i.test(withoutTrailingSlash)) {
    return withoutTrailingSlash.replace(/\/api$/i, "");
  }

  return withoutTrailingSlash;
};

export const backendUrl = normalizeBackendUrl(import.meta.env.VITE_BACKEND_URL);
