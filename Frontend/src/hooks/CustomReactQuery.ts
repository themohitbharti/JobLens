import { useEffect, useState, useCallback } from "react";

interface ApiResponse<T> {
  data?: T;
  [key: string]: unknown;
}

export const CustomReactQuery = <T = unknown>(
  apiFunction: () => Promise<ApiResponse<T> | T>
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFunction();

      // Handle both wrapped responses ({ data: ... }) and direct responses
      if (response && typeof response === "object" && "data" in response) {
        setData((response as ApiResponse<T>).data || null);
      } else {
        setData(response as T);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setError(errorMessage);
      console.error("CustomReactQuery error:", error);
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    if (!apiFunction) return;

    fetchData();
  }, [apiFunction, fetchData]);

  return {
    data,
    error,
    loading,
    refetch: fetchData,
  };
};
