export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

const UTM_KEYS: (keyof UtmParams)[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

const STORAGE_KEY = "euv_utm_params";

export function captureUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};

  const searchParams = new URLSearchParams(window.location.search);
  const fromUrl: UtmParams = {};

  UTM_KEYS.forEach((key) => {
    const value = searchParams.get(key);
    if (value) fromUrl[key] = value;
  });

  if (Object.keys(fromUrl).length > 0) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
    return fromUrl;
  }

  return getStoredUtmParams();
}

export function getStoredUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmParams) : {};
  } catch {
    return {};
  }
}

export function appendUtmParams(url: string): string {
  const utm = getStoredUtmParams();
  const entries = Object.entries(utm).filter(([, v]) => Boolean(v));
  if (entries.length === 0 || !url) return url;

  try {
    const target = new URL(url, typeof window !== "undefined" ? window.location.href : undefined);
    entries.forEach(([key, value]) => target.searchParams.set(key, value as string));
    return target.toString();
  } catch {
    return url;
  }
}
