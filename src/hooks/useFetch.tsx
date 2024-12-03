import { useEffect, useState, useCallback } from "react";

type FetchFunction<T> = (fetchArg?: string) => Promise<T>;

export default function useFetch<T>(
  request: FetchFunction<T>,
  fetchArg?: string
) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T>();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await request(fetchArg);
      if (response) {
        setData(response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchArg, request]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { isLoading, data };
}
