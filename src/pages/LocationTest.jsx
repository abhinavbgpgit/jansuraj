import React, { useEffect, useState } from "react";

export default function LocationTest() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      setError("");
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const url =
          `https://nominatim.openstreetmap.org/search` +
          `?q=${encodeURIComponent(query + ", Bihar, India")}` +
          `&format=jsonv2` +
          `&addressdetails=1` +
          `&limit=5` +
          `&countrycodes=in`;

        console.log("Nominatim URL:", url);

        const response = await fetch(url);

        console.log("Status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        console.log("Nominatim response:", data);

        setResults(data);

        if (data.length === 0) {
          setError("कोई location नहीं मिली");
        }
      } catch (err) {
        console.error("Nominatim Error:", err);
        setError("Location search failed: " + err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-5">
          Test Location Search
        </h2>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Khalifabagh Chowk, Bhagalpur"
          className="w-full rounded-lg border px-4 py-3"
        />

        {loading && (
          <p className="text-white mt-3">
            🔎 Location खोजी जा रही है...
          </p>
        )}

        {error && (
          <p className="text-red-400 mt-3">
            {error}
          </p>
        )}

        <div className="mt-4 space-y-2">
          {results.map((item) => (
            <button
              key={item.place_id}
              type="button"
              onClick={() => {
                console.log("SELECTED:", item);

                setQuery(item.display_name);
                setResults([]);
              }}
              className="w-full bg-white text-left rounded-lg p-4 hover:bg-slate-100"
            >
              <p className="font-semibold">
                {item.display_name}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {item.lat}, {item.lon}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}