"use client";

import rawData from "../../data/data.json";
import pubData from "../../data/pubs.json";
import { useState } from "react";
import ImageIcon from '@mui/icons-material/Image';
import SearchBar from "../search"; // adjust path as needed
import { DataRow, PubsRow } from "@/types/data";

const data: DataRow[] = rawData as DataRow[];
const pubs: PubsRow[] = pubData as PubsRow[];
const pubLabelMap = new Map(pubs.map(({ pub, label }) => [pub, label]));

function exportToCsv(data: DataRow[], query: string) {
  if (!data.length) return;

  const keys = Object.keys(data[0]) as (keyof DataRow)[];
  const csvRows = [
    keys.join(","), // header row
    ...data.map((row) =>
      keys
        .map((k) => `"${(row[k] ?? "").toString().replace(/"/g, '""')}"`)
        .join(",")
    ),
  ];
  const csvString = csvRows.join("\n");

  const blob = new Blob([csvString], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeQuery = query.replace(/\s+/g, "_").replace(/[^\w_-]/g, "");
  a.download = `results_${safeQuery || "all"}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Explorer() {
  const [results, setResults] = useState<DataRow[]>([]);
  const [searchStr, setSearchStr] = useState("");

  const handleResults = (newResults: DataRow[], query: string) => {
    setResults(newResults);
    setSearchStr(query);
  };

  return (
        <div>
            <SearchBar data={data} onResults={handleResults} threshold={0.5} useExtendedSearch={true}/>

            {results.length > 0 && (
                <p className="mt-4 font-semibold">
                    Found {results.length} matches for &quot;{searchStr}&quot;{" "}
                    <button
                        onClick={() => exportToCsv(results, searchStr)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                        Export
                    </button>
                </p>
            )}

            <ul className="mt-2 space-y-4">
                {results.map((row) => {
                    const pubLabel = pubLabelMap.get(row.pub) ?? row.pub;
                    const pubDateFormatted = row.pub_date
                        .toString()
                        .replace(/(\d{4})(\d{2})(\d{2})/, "$3.$2.$1");

                    return (
                        <li
                            key={row.uuid}
                            className="border p-4 rounded gap-6 min-h-20"
                        >
                            <div>
                                <span className="font-semibold">{pubLabel}</span>{" "}
                                <span className="text-xs text-gray-400">
                                    {" "}
                                    {pubDateFormatted}, page {row.page_num}&nbsp;
                                </span>
                                <span className="text-xs uppercase rounded-sm text-yellow-500 ">
                                    {row.label}
                                </span>
                                <a
                                    href={row.iiif}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <ImageIcon className="text-blue-600 text-xs" />
                                </a>
                            </div>
                            {row.positions.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {row.positions.map((pos, idx) => (
                                        <span
                                            key={idx}
                                            className="my-1 block rounded bg-zinc-100 px-2 pb-2 pt-2 text-xs font-medium uppercase leading-tight text-neutral-500 data-[twe-nav-active]:!bg-primary-100 data-[twe-nav-active]:text-primary-700 dark:bg-neutral-700 dark:text-white/50 dark:data-[twe-nav-active]:!bg-slate-900 dark:data-[twe-nav-active]:text-primary-500 md:me-4"
                                        >
                                            {pos}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="whitespace-pre-wrap">{row.text}</div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
