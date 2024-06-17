import { useEffect, useState } from "react";

type FetchFunction<T> = (fetchArg?: string) => Promise<T>;

export default function useFetch<T>(
  request: FetchFunction<T>,
  fetchArg?: string
) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T>();

  const fetchData = async () => {
    try {
      const response = fetchArg ? await request(fetchArg) : await request();

      if (response) {
        setData(response);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [fetchArg]);

  return { isLoading, data };
}
