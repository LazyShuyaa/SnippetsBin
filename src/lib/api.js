/**
 * API layer.
 *
 * Talks to the Express/Mongo backend under /api. When the backend cannot be
 * reached at all (e.g. running the UI on its own, or a static preview), it
 * transparently falls back to a local, offline "demo" store so the interface
 * stays fully usable. Real deployments are never affected: the fallback only
 * triggers on network failures / non-JSON responses / 5xx.
 */

const DEMO_KEY = 'snippetbin:demo:v1';
const DEMO_LIMIT = 40;

/* ------------------------------------------------------------------ *
 * Errors
 * ------------------------------------------------------------------ */
export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Snippet not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

class ApiUnreachable extends Error {}

/* ------------------------------------------------------------------ *
 * Demo-mode status (tiny external store)
 * ------------------------------------------------------------------ */
const status = { demo: false, reason: null };
const listeners = new Set();

export function isDemoMode() {
  return status.demo;
}

export function demoReason() {
  return status.reason;
}

export function subscribeApiStatus(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function enableDemoMode(reason) {
  if (status.demo) return;
  status.demo = true;
  status.reason = reason || null;
  listeners.forEach((listener) => listener(true, status.reason));
}

/* ------------------------------------------------------------------ *
 * Low level request helper
 * ------------------------------------------------------------------ */
const REQUEST_TIMEOUT = 12_000;

async function callApi(path, { method = 'GET', body } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  let response;
  try {
    response = await fetch(path, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (error) {
    throw new ApiUnreachable(error?.message || 'network request failed');
  } finally {
    clearTimeout(timeout);
  }

  const contentType = response.headers.get('content-type') || '';
  // A static host (or a proxy without a backend) answers with the SPA shell.
  if (!contentType.includes('application/json')) {
    throw new ApiUnreachable(`unexpected content-type "${contentType || 'unknown'}"`);
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new ApiUnreachable('response was not valid JSON');
  }

  if (!response.ok) {
    if (response.status === 404) throw new NotFoundError(payload?.message);
    throw new ApiError(payload?.message || `Request failed with status ${response.status}`, response.status);
  }

  return payload;
}

function shouldFallBack(error) {
  if (error instanceof ApiUnreachable) return true;
  // 5xx / 405 mean the backend is missing or broken, not that the user did
  // something wrong — keep the UI usable with the local store.
  return error instanceof ApiError && (error.status >= 500 || error.status === 405 || error.status === 403);
}

/* ------------------------------------------------------------------ *
 * Offline demo store
 * ------------------------------------------------------------------ */
const ALPHABET = '23456789abcdefghjkmnpqrstuvwxyz';

function randomCode(length = 5) {
  const bytes = new Uint8Array(length);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join('');
}

function readStore() {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store) {
  try {
    // Drop expired entries, then keep only the most recent DEMO_LIMIT items.
    const now = Date.now();
    const entries = Object.entries(store)
      .filter(([, item]) => !item.expiresAt || new Date(item.expiresAt).getTime() > now)
      .sort((a, b) => new Date(b[1].createdAt || 0) - new Date(a[1].createdAt || 0))
      .slice(0, DEMO_LIMIT);
    localStorage.setItem(DEMO_KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch {
    /* storage full or unavailable — demo mode simply won't persist */
  }
}

const demoStore = {
  create({ code, language, expireTime }) {
    const store = readStore();
    let uniqueCode = randomCode();
    let guard = 0;
    while (store[uniqueCode] && guard < 25) {
      uniqueCode = randomCode();
      guard += 1;
    }

    const minutes = Number.parseInt(expireTime, 10);
    const expiresAt =
      !expireTime || expireTime === 'never' || !Number.isFinite(minutes) || minutes <= 0
        ? null
        : new Date(Date.now() + minutes * 60_000).toISOString();

    const snippet = {
      code,
      language,
      uniqueCode,
      expiresAt,
      createdAt: new Date().toISOString(),
      demo: true,
    };

    store[uniqueCode] = snippet;
    writeStore(store);
    return snippet;
  },

  get(uniqueCode) {
    const store = readStore();
    const snippet = store[uniqueCode];
    if (!snippet) throw new NotFoundError('Snippet not found — it may have expired.');
    if (snippet.expiresAt && new Date(snippet.expiresAt).getTime() <= Date.now()) {
      delete store[uniqueCode];
      writeStore(store);
      throw new NotFoundError('This snippet has expired.');
    }
    return { ...snippet, demo: true };
  },
};

/* ------------------------------------------------------------------ *
 * Public API
 * ------------------------------------------------------------------ */
export async function createSnippet({ code, language, expireTime }) {
  try {
    const data = await callApi('/api/snippets', {
      method: 'POST',
      body: { code, language, expireTime },
    });
    return data;
  } catch (error) {
    if (!shouldFallBack(error)) throw error;
    enableDemoMode(error.message);
    return demoStore.create({ code, language, expireTime });
  }
}

export async function getSnippet(uniqueCode) {
  try {
    return await callApi(`/api/snippets/${encodeURIComponent(uniqueCode)}`);
  } catch (error) {
    if (!shouldFallBack(error)) throw error;
    enableDemoMode(error.message);
    return demoStore.get(uniqueCode);
  }
}
