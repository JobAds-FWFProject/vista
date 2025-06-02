/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { DataRow, GraphNode } from "@/types/data";
import { Cosmograph } from '@cosmograph/react'
import { useRef, useState } from 'react'
import rawData from "../../data/data.json";
import SearchBar from "../search";


const data: DataRow[] = rawData as DataRow[];
const labelColors: Record<string, string> = {
    job_search: "#1f77b4",     // blue
    job_offer: "#2ca02c",      // green
    service_offer: "#ff7f0e",  // orange
    indicator: "#d62728",      // red
    vermittlung: "#9467bd",    // purple
    heading: "#8c564b",        // brown
    default: "#7f7f7f",        // grey
};
function Legend() {
  return (
    <div className="absolute top-10 right-10 bg-gray shadow p-4 rounded text-sm space-y-2 z-10">
      {Object.entries(labelColors).map(([label, color]) => (
        <div key={label} className="flex items-center space-x-2">
          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}




function buildGraph(data: DataRow[]) {
    const nodes = new Map<string, GraphNode>();
    const links: { source: string; target: string }[] = [];


    for (const row of data) {
        const rowId = `row-${row.uuid}`;
    const colour = labelColors[row.label] || labelColors.default;
      nodes.set(rowId, {
          id: rowId,
          text: row.text,
          positions: row.positions,
          label: row.iiif,
          pub: row.pub,
          pub_date: row.pub_date,
          adtype: row.label,
        colour: colour,
      });

    for (const pos of row.positions) {
      const posId = `${pos}`;
      if (!nodes.has(posId)) {
        nodes.set(posId, {
            id: posId,
            text: "",
            positions: [],
            label: pos,
            pub: "",
            colour: "#cccccc",
        });
        }
      links.push({ source: rowId, target: posId });
    }
  }

  return { nodes: [...nodes.values()], links };
}

export default function Network() {
    const cosmographRef =   useRef(null)

    const [results, setResults] = useState<DataRow[]>([]);

    const handleResults = (newResults: DataRow[]) => {
    setResults(newResults);
  };

  const playPause = () => {
    if ((cosmographRef.current as any)?.isSimulationRunning){
        (cosmographRef.current as any)?.pause();
    } else {
          (cosmographRef.current as any)?.start();
      }
  }
  const fitView = () => {
        (cosmographRef.current as any)?.fitView();
    }

    const graph = buildGraph(results.length > 0 ? results : data);

    return (
        <div
            className="mt-2 relative left-1/2 right-1/2 -mx-[50vw] w-[100vw]"
        >
            <SearchBar data={data} onResults={handleResults} threshold={0.5} useExtendedSearch={true} />

            {/* Cosmograph now “inset-0” to kill all margins */}
            <Cosmograph
                ref={cosmographRef}
                nodes={graph.nodes}
                links={graph.links}
                nodeColor={(d) => d.colour ?? "#999"}
                nodeLabelAccessor={(d: GraphNode) =>
                  d.id.startsWith("row-") ? "" : d.label}
                className="w-full"
                scaleNodesOnZoom={false}
            />

            {/* Pause/Fit buttons in top-left */}
            <div className="absolute p-4 top-10 left-10 flex space-x-2 z-10">
                <button
                    onClick={playPause}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded hover:bg-gray-100"
                >
                    Pause/Play
                </button>
                <button
                    onClick={fitView}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded hover:bg-gray-100"
                >
                    Fit
                </button>
            </div>
            <Legend />

        </div>
    );
}
