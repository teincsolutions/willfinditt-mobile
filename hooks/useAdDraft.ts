import { mmkvStorage } from "@/utils/mmkvStorage";

/**
 * Local autosave for the new-ad form (create flow only).
 * Persists form values + picker selections to MMKV as the user types so an
 * unfinished listing survives backgrounding, navigation, or process death.
 * Only uploaded image URLs are stored — never local file:// URIs, which die
 * with the process.
 */

const DRAFT_KEY = "ad_create_draft_v1";
const DRAFT_VERSION = 1;
const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface AdCreateDraft {
  version: number;
  updatedAt: number;
  categoryId: string | null;
  cityId: string | null;
  values: Record<string, any>;
}

/** Title/description count after stripping editor HTML; prefilled account contact info alone doesn't. */
export function isDraftWorthy(values: Record<string, any>): boolean {
  const title = (values.title || "").trim();
  const description = (values.description || "")
    .replace(/<[^>]*>/g, "")
    .trim();
  if (title || description) return true;
  if (Array.isArray(values.images) && values.images.length > 0) return true;
  if (values.categoryId || values.cityId) return true;
  if (Number.isFinite(Number(values.price)) && Number(values.price) > 0)
    return true;
  if ((values.address || "").trim()) return true;
  return false;
}

export function loadAdDraft(): AdCreateDraft | null {
  try {
    const draft = mmkvStorage.getJSON<AdCreateDraft>(DRAFT_KEY);
    if (!draft || draft.version !== DRAFT_VERSION) return null;
    if (Date.now() - draft.updatedAt > DRAFT_TTL_MS) {
      mmkvStorage.removeItem(DRAFT_KEY);
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}

export function saveAdDraft(
  values: Record<string, any>,
  categoryId: string | null,
  cityId: string | null,
): void {
  try {
    // Never persist transient submit state.
    const { status: _status, ...rest } = values;
    void _status;
    const draft: AdCreateDraft = {
      version: DRAFT_VERSION,
      updatedAt: Date.now(),
      categoryId: categoryId || null,
      cityId: cityId || null,
      // JSON round-trip drops NaN/undefined safely (price NaN -> null).
      values: JSON.parse(JSON.stringify(rest)),
    };
    mmkvStorage.setJSON(DRAFT_KEY, draft);
  } catch {
    // Storage full or unserializable — autosave is best-effort.
  }
}

export function clearAdDraft(): void {
  try {
    mmkvStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}
