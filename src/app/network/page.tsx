/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { DataRow, GraphNode } from "@/types/data";
import { CosmographProvider, Cosmograph, CosmographTimeline } from '@cosmograph/react'
import { useRef, useState, useMemo } from 'react'
import rawData from "../../data/data.json";
import SearchBar from "../search";


const data: DataRow[] = rawData as DataRow[];
const labelColors: Record<string, string> = {
    job_search: "#1f77b4",     // blue
    job_offer: "#2ca02c",      // green
    service_offer: "#ff7f0e",  // orange
    vermittlung: "#9467bd",    // purple
    position: "goldenrod",       // grey
};
function Legend() {
  return (
    <div className="absolute top-20 right-10 bg-gray shadow p-4 rounded text-sm space-y-2 z-10">
      {Object.entries(labelColors).map(([label, color]) => (
        <div key={label} className="flex items-center space-x-2">
          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}


function formatDate(yyyymmdd: number): string {
  const s = yyyymmdd.toString();
  const year = s.slice(0, 4);
  const month = s.slice(4, 6);
  const day = s.slice(6, 8);
  return `${day}-${month}-${year}`;
}


function buildGraph(data: DataRow[]) {
    const nodes = new Map<string, GraphNode>();
    const links: {
        source: string; target: string;  pub_date?: number;
    }[] = [];
    const degree = new Map<string, number>();


    for (const row of data) {
      if (Array.isArray(row.positions) && row.positions.length === 0) {
          continue; // Skip this row
      }
      const rowId = `row-${row.uuid}`;
      const colour = labelColors[row.label] || "#cccccc"; // Default to grey if label not found;
      nodes.set(rowId, {
          id: rowId,
          text: row.text,
          positions: row.positions,
          iiif: row.iiif,
          label: row.pub_name + "<br/>" + formatDate(row.pub_date) + ", p." + row.page_num,
          pub: row.pub,
          pub_name: row.pub_name,
          adtype: row.label,
          colour: colour,
          pub_date: row.pub_date,
        page_num: row.page_num
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
              pub_name: "",
              colour: labelColors.position,
          });
          }
        links.push({
          source: rowId, target: posId, pub_date: row.pub_date,
        });

          // Count degrees
          degree.set(rowId, (degree.get(rowId) ?? 0) + 1);
      degree.set(posId, (degree.get(posId) ?? 0) + 1);
    }
  }
    // Assign sizes
    for (const node of nodes.values()) {
        //node.size = 4 + Math.log2((degree.get(node.id) ?? 1) + 1); //logarithmic scale for size
        //node.size = 4 + Math.sqrt(degree.get(node.id) ?? 1);
        node.size = Math.min(20, 5 + Math.sqrt(degree.get(node.id) ?? 1)); // capped size

    }

    return { nodes: [...nodes.values()], links };
}

export default function Network() {
    const cosmographRef = useRef(null)
    const graphRef = useRef<HTMLDivElement>(null);

    const [results, setResults] = useState<DataRow[]>([]);
    const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

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
    const resetView = () => {
        handleResults([]);
    }
    const handleNodeClick = (node: GraphNode) => {
        setSelectedNode(node);
    }
    const parseDateString = (yyyymmdd: string) => {
            const s = yyyymmdd.toString();
  const year = parseInt(s.slice(0, 4));
      return year.toString();
    };


    const graph = useMemo(() => buildGraph(results.length > 0 ? results : data), [results]);

    return (
        <div className="mt-2 relative left-1/2 right-1/2 -mx-[50vw] w-[99.5vw]" >
            <SearchBar data={data} onResults={handleResults} threshold={0} useExtendedSearch={true} />
            <div ref={graphRef}>
                <CosmographProvider>

                    {/* Cosmograph now “inset-0” to kill all margins */}
                    <Cosmograph
                        ref={cosmographRef}
                        nodes={graph.nodes}
                        links={graph.links}
                        linkArrows={false}
                        nodeColor={(d) => d.colour ?? "#999"}
                        nodeLabelColor={(d) => d.colour ?? "#cccccc"}
                        hoveredNodeLabelColor={(d) => d.colour ?? "#cccccc"}
                        nodeLabelAccessor={(d: GraphNode) =>
                            d.id.startsWith("row-") ? d.label : d.label}
                        className="w-full max-w-[90rem] mx-auto"
                        scaleNodesOnZoom={false}
                        nodeSize={(d: GraphNode) => d.size ?? 5}
                        backgroundColor="#002b36"
                        onLabelClick={handleNodeClick}

                    />

                    {/* Pause/Fit buttons in top-left */}
                    <div className="absolute p-4 top-20 left-10 flex space-x-2 z-10">
                        <button
                            onClick={resetView}
                            className="px-4 py-1 bg-white border border-gray-300 text-gray-800 rounded bg-yellow-500 hover:bg-yellow-300"
                        >
                            Reset
                        </button>

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
                        <div className="absolute left-0 top-full mt-1 w-64 text-white p-3 rounded shadow-lg text-xs">
                            {selectedNode ? (
                                <div>
                                    <h5 className="text-base mb-2">{selectedNode.pub_name !== "" ? selectedNode.pub_name : selectedNode.label.toUpperCase()}<br />
                                        {selectedNode.pub_date ? formatDate(selectedNode.pub_date) : ""}
                                        {selectedNode.page_num ? `, p. ${selectedNode.page_num}` : ""}

                                    </h5>
                                    <p className="mt-2 text-left tracking-wideCan I">
                                        {selectedNode.text}
                                    </p>
                                    {selectedNode.iiif && (
                                        <div className="relative inline-block group">
                                            <a
                                                href={selectedNode.iiif}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View original image
                                            </a>
                                            <div className="absolute hidden group-hover:block top-full left-0 mt-2 w-64 border rounded shadow-lg bg-white">
                                                <img
                                                    src={selectedNode.iiif}
                                                    alt="Preview"
                                                    className="w-full h-auto rounded"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p>Select a node to see details</p>
                            )}
                        </div>

                    </div>
                    <Legend />
                    <CosmographTimeline
                        accessor={d => (d as any).pub_date}
                        animationSpeed={20}
                        showAnimationControls
                        formatter={d => parseDateString(d.toString())}
                        barCount={100}
                        onAnimationPlay={() => console.log('Animation started')}
                    />
                </CosmographProvider>
            </div>

        </div>
    );
}
