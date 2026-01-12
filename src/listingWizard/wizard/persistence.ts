// src/listingWizard/wizard/persistence.ts
import type { ListingDraft } from "@/listingWizard/types";

const COOKIE_KEY = "listing_draft_v1";
const LS_KEY = "listing_draft_v1_local";

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

function safeJsonParse<T>(s: string | null): T | null {
  if (!s) return null;
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

// ~4KB cookie limit (practically). We'll guard and fallback to localStorage.
const MAX_COOKIE_BYTES = 3500;

export function loadDraft(): ListingDraft | null {
  const fromCookie = safeJsonParse<ListingDraft>(getCookie(COOKIE_KEY));
  if (fromCookie) return fromCookie;

  const fromLS = safeJsonParse<ListingDraft>(localStorage.getItem(LS_KEY));
  return fromLS;
}

export function saveDraft(draft: ListingDraft) {
  const payload = JSON.stringify(draft);
  const bytes = new TextEncoder().encode(payload).length;

  if (bytes <= MAX_COOKIE_BYTES) {
    setCookie(COOKIE_KEY, payload, 14);
    localStorage.removeItem(LS_KEY);
    return;
  }

  // fallback: keep a minimal cookie marker + store full draft in LS
  setCookie(
    COOKIE_KEY,
    JSON.stringify({ version: 1, mode: draft.mode, _ls: true }),
    14
  );
  localStorage.setItem(LS_KEY, payload);
}

export function clearDraft() {
  deleteCookie(COOKIE_KEY);
  localStorage.removeItem(LS_KEY);
}
