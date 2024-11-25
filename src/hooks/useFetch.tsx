// import { useEffect, useState } from "react";

// type FetchFunction<T> = (fetchArg?: string) => Promise<T>;

// export default function useFetch<T>(
//   request: FetchFunction<T>,
//   fetchArg?: string
// ) {
//   const [isLoading, setIsLoading] = useState(true);
//   const [data, setData] = useState<T>();

//   const fetchData = async () => {
//     try {
//       setIsLoading(true);
//       // console.log("isLoading", isLoading);
//       // await new Promise((resolve) => setTimeout(resolve, 2000));
//       console.log("fetchArg", fetchArg);
//       const response = fetchArg ? await request(fetchArg) : await request();
//       // console.log("isLoading", isLoading);
//       if (response) {
//         setData(response);
//         // console.log("isLoading", isLoading);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchData();
//   }, [fetchArg]);
//   useEffect(() => {
//     console.log("isLoading", isLoading);
//   }, [isLoading]);
//   return { isLoading, data };
// }

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
      console.log("isLoading", isLoading);
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
