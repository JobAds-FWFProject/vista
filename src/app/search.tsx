
"use client";

import Fuse from "fuse.js";
import { useState } from "react";

import { DataRow } from "@/types/data";

type SearchBarProps = {
  data: DataRow[];
  onResults: (results: DataRow[], query: string) => void;
  threshold:number;
  useExtendedSearch: boolean,

};

export default function Search({ data, onResults, threshold = 0.5, useExtendedSearch= true}: SearchBarProps) {
    const [query, setQuery] = useState("");

  const fuse = new Fuse(data, {
      keys: ["text"],
      threshold: threshold,
      useExtendedSearch: useExtendedSearch
  });

    const handleSearch = () => {
    if (query.trim().length === 0) {
      onResults([], query);
      return;
    }
    const searchResults = fuse.search(query).map(({ item }) => item);
    onResults(searchResults, query);
  };

  return (
        <div className="flex w-full max-w-4xl mx-auto gap-2">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                }}
                placeholder="Enter search term"
                className="flex-grow border p-2"
            />
            <button
                onClick={handleSearch}
                className="w-24 bg-blue-600 text-white px-4 py-2"
            >
                Go
            </button>
        </div>
    );
}
