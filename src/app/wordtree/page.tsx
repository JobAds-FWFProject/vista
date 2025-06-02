"use client";
import { useState } from "react";
import { DataRow } from "@/types/data";
import SearchBar from "../search";
import rawData from "../../data/data.json";
import { useEffect, useRef } from 'react';

const data: DataRow[] = rawData as DataRow[];

interface WordTreeChart {
  draw: (data: google.visualization.DataTable, options: object) => void;
}


declare global {
    interface Window {
    google: typeof google;
  }
}

function WordTree({ data, rootWord }: { data: string[][]; rootWord: string }) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data.length || !rootWord) return;

    const loadGoogleCharts = () => {
      window.google.charts.load("current", { packages: ["wordtree"] });
      window.google.charts.setOnLoadCallback(drawChart);
    };

    const drawChart = () => {
      const chartData = window.google.visualization.arrayToDataTable([
        ["Phrases"],
        ...data,
      ]);

     const chart = new (window.google.visualization as unknown as {
         WordTree: new (element: HTMLElement) => WordTreeChart;
        }).WordTree(chartRef.current!);
     chart.draw(chartData, {
         wordtree: {
             backgroundColor: "#ffffff",
             format: "implicit",
             word: rootWord,
             type: "double",
          },
     });
    };

    if (!window.google || !window.google.charts) {
      const script = document.createElement("script");
      script.src = "https://www.gstatic.com/charts/loader.js";
      script.onload = loadGoogleCharts;
      document.head.appendChild(script);
    } else {
      loadGoogleCharts();
    }
  }, [data, rootWord]);

  return (
        <div
            ref={chartRef}
            className="w-full h-[80vh] bg-white"
            style={{
                backgroundColor: "white",
                width: "100vw",  // Full viewport width
                padding: "1rem", // Optional: adds spacing
                boxSizing: "border-box", // Ensures padding doesn't shrink content
            }}
        />
    );

}




export default function Wordtree() {
    const [results, setResults] = useState<DataRow[]>([]);
  const [rootWord, setRootWord] = useState("");

  const handleResults = (newResults: DataRow[], query: string) => {
      setResults(newResults);
      setRootWord(query.toLowerCase().trim().split(/\s+/)[0]);
    }


  return (

        < div >
      <SearchBar data={data} onResults={handleResults} threshold={0.5} useExtendedSearch={true} />
            <div
                className="mt-2 relative left-1/2 right-1/2 -mx-[50vw] w-[100vw] h-screen"
            >
                <WordTree
                    data={results.map(r => [r.text.toLowerCase()])}
                    rootWord={rootWord || "Search for a word to start"}
                />
            </div>


        </div >
    );
}
