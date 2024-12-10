import { useEffect, useState } from 'react'

function QueryParams() {
  const [queryParams, setQueryParams] = useState(null);

  useEffect(() => {
    if (typeof window !== undefined) {
      const searchParams = new URLSearchParams(window.location.search);
      setQueryParams(searchParams);
    }
  }, []);

  useEffect(() => {}, [queryParams]);

  return queryParams
}

export default QueryParams