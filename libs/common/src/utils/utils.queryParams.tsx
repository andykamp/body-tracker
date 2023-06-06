import { useEffect, useState } from "react";

function useQueryParams() {
  const [queryParams, setQueryParams] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryObj: { [key: string]: string | null } = {};
    for (const key of params.keys()) {
      queryObj[key] = params.get(key);
    }
    setQueryParams(queryObj);
  }, []);


  return queryParams as any
}

export default useQueryParams;
