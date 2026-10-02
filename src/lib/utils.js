/** Tiny helpers shared across components. */

/** Join conditional class names. */
export function cn(...values) {
  return values.filter(Boolean).join(' ');
}

/** Copy text to the clipboard, with a legacy fallback. */
export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the execCommand path */
  }

  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Parse an API date into a timestamp.
 *
 * The backend appends a "Z" to `toISOString()` output, which can produce
 * values like "…00.000ZZ" — invalid in strict engines (Safari). Normalise
 * to a single trailing "Z" before parsing.
 */
export function parseDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  const normalised = String(value)
    .trim()
    .replace(/(\.\d{3})\d*Z+$/i, '$1Z')
    .replace(/Z+$/i, 'Z');
  const date = new Date(normalised);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Human friendly "time ago" for ISO date strings. */
export function timeAgo(iso) {
  const parsed = parseDate(iso);
  if (!parsed) return null;
  const then = parsed.getTime();
  const diff = Date.now() - then;
  const abs = Math.abs(diff);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (abs < 45_000) return 'just now';
  if (abs < 45 * minute) return plural(Math.round(abs / minute), 'minute');
  if (abs < 22 * hour) return plural(Math.round(abs / hour), 'hour');
  if (abs < 26 * day) return plural(Math.round(abs / day), 'day');
  if (abs < 320 * day) return plural(Math.round(abs / (30 * day)), 'month');
  return plural(Math.round(abs / (365 * day)), 'year');
}

function plural(count, unit) {
  const value = Math.max(count, 1);
  return `${value} ${unit}${value === 1 ? '' : 's'}`;
}

/** "in 4h 12m" style countdown for an expiry timestamp. */
export function timeUntil(iso) {
  const parsed = parseDate(iso);
  if (!parsed) return null;
  const diff = parsed.getTime() - Date.now();
  if (diff <= 0) return 'expired';

  const seconds = Math.floor(diff / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

export function formatDateTime(iso) {
  const date = parseDate(iso);
  if (!date) return null;
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function countLines(text) {
  if (!text) return 0;
  return text.split('\n').length;
}

export function formatCount(value) {
  return new Intl.NumberFormat().format(value);
}

/** "1.2 kB" style byte formatting, useful for the snippet footer. */
export function formatBytes(text) {
  const bytes = new Blob([text || '']).size;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Guess a syntax hint for the free-text search box. */
export function matchesSearch(haystack, needle) {
  if (!needle) return true;
  return String(haystack).toLowerCase().includes(String(needle).toLowerCase());
}

/** Platform-aware keyboard shortcut label (⌘ vs Ctrl). */
export const IS_APPLE =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || '');

export function modifierKey() {
  return IS_APPLE ? '⌘' : 'Ctrl';
}

/** Trigger a client-side file download. */
export function downloadFile(filename, contents, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
