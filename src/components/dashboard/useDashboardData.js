import { useEffect, useState } from "react";
import axios from "axios";

// ==========================================
// Shared data-fetch hook for every dashboard
// section. Har section ek alag backend endpoint
// se apna data leta hai (abhi ye endpoints backend
// me nahi bane hain, isliye "error" state pe
// component apna empty-state dikhata hai).
// ==========================================
export default function useDashboardData(endpoint, params) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const paramsKey = params ? JSON.stringify(params) : "";

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(false);

      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        if (!backendUrl) {
          throw new Error("Backend URL is not configured.");
        }

        const response = await axios.get(`${backendUrl}${endpoint}`, {
          withCredentials: true,
          params,
        });

        if (cancelled) return;

        if (response.data?.success) {
          setData(response.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(`Dashboard fetch error [${endpoint}]:`, {
          message: err.message,
          status: err.response?.status,
        });

        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, paramsKey]);

  return { data, loading, error };
}
