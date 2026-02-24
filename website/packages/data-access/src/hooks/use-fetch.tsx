import { useState, useCallback } from "react";

type FetchResponse<T> = {
  response: Response | null;
  json: T | null;
};

type RequestOptions = RequestInit;

export const useFetch = <T = unknown>() => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const request = useCallback(async (url: string, options?: RequestOptions): Promise<FetchResponse<T>> => {
    setError(null);
    setLoading(true);

    let response: Response | null = null;
    let json: T | null = null;

    try {
      response = await fetch(url, options);
      const parsed: unknown = await response.json();

      if (!response.ok) {
        const errorMessage =
          typeof parsed === "object" && parsed !== null && "message" in parsed
            ? String((parsed as { message?: string }).message)
            : "Erro na requisição";

        throw new Error(errorMessage);
      }

      json = parsed as T;
      setData(json);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido");
      }
    } finally {
      setLoading(false);
    }

    return { response, json };
  }, []);

  return {
    data,
    error,
    loading,
    request,
  };
};
