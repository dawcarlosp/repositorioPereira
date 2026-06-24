// src/services/api.ts
import { API_BASE_URL } from "@/app/config/api";

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface ApiRequestOptions {
  method?:     "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD";
  isFormData?: boolean;
  signal?:     AbortSignal;
}

interface StoredAuth {
  token: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredAuth;
    return parsed.token ?? null;
  } catch {
    return null;
  }
};

const isPublicEndpoint = (endpoint: string): boolean =>
  endpoint.includes("auth/login") || endpoint.includes("auth/register");

const buildUrl = (endpoint: string): string => {
  const base       = API_BASE_URL.replace(/\/+$/, "");
  const normalized = endpoint.replace(/^\/+/, "");
  return `${base}/${normalized}`;
};

// ── Core ──────────────────────────────────────────────────────────────────────

export const apiRequest = async <T = unknown>(
  endpoint: string,
  data:     unknown,
  options:  ApiRequestOptions = {}
): Promise<T> => {
  const { method = "POST", isFormData = false, signal } = options;

  const headers: Record<string, string> = {};
  const token = getToken();

  if (token && !isPublicEndpoint(endpoint)) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const requestInit: RequestInit = {
    method,
    headers,
    credentials: "include",
    signal,
  };

  const isBodyAllowed = method !== "GET" && method !== "HEAD";
  if (isBodyAllowed && data != null) {
    if (isFormData) {
      requestInit.body = data as FormData;
    } else {
      requestInit.body                = JSON.stringify(data);
      headers["Content-Type"] = "application/json";
    }
  }

  const response = await fetch(buildUrl(endpoint), requestInit);
  const text     = await response.text();

  let result: unknown;
  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    result = text || {};
  }

  if (!response.ok) {
    throw result;
  }

  return result as T;
};