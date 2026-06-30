import { useState, useEffect, useRef, useCallback } from "react";
import { apiRequest } from "@services/api";

interface UsePaginatedFetchOptions<T, R> {
  url: string;
  extractData: (response: R) => { content: T[]; totalPages: number };
  onError?: (err: unknown) => void;
}

interface UsePaginatedFetchReturn<T> {
  data: T[];
  loading: boolean;
  totalPages: number;
  refresh: () => void;
}

export default function usePaginatedFetch<T, R = unknown>({
  url,
  extractData,
  onError,
}: UsePaginatedFetchOptions<T, R>): UsePaginatedFetchReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const extractDataRef = useRef(extractData);
  extractDataRef.current = extractData;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiRequest<R>(url, null, { method: "GET", signal: controller.signal });
        if (!cancelled) {
          const { content, totalPages: tp } = extractDataRef.current(response);
          setData(content);
          setTotalPages(tp);
        }
      } catch (err) {
        if (!cancelled && (err as Error)?.name !== "AbortError") {
          onErrorRef.current?.(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; controller.abort(); };
  }, [url, refreshKey]);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  return { data, loading, totalPages, refresh };
}
