"use client";
import { useEffect } from "react";
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, type Node, type Edge } from "reactflow";

type TN = { name: string; type: string; path?: string; children?: TN[] };

function buildGraph(tree: TN | null, repoName: string) {
  const nodes: Node[] = [], edges: Edge[] = [];
  if (!tree) return { nodes, edges };
  nodes.push({
    id: "root", position: { x: 500, y: 0 }, data: { label: repoName },
    style: { background:"#f97316", border:"2px solid #ea580c", color:"#fff",
              fontSize:13, fontFamily:"Inter,sans-serif", padding:"8px 20px",
              borderRadius:10, fontWeight:700, boxShadow:"0 4px 12px rgba(249,115,22,.3)" },
  });
  const dirs = (tree.children || []).filter(c => c.type === "directory").slice(0, 10);
  dirs.forEach((dir, i) => {
    const id  = `d${i}`;
    const x   = (i - (dirs.length - 1) / 2) * 185 + 500;
    const svc = /service|api|route|handler|controller/.test(dir.name.toLowerCase());
    const db  = /db|database|model|schema|store/.test(dir.name.toLowerCase());
    const ui  = /component|view|page|screen|ui/.test(dir.name.toLowerCase());
    const bg  = svc ? "#fff7ed" : db ? "#eff6ff" : ui ? "#f5f3ff" : "#f9fafb";
    const border = svc ? "#fed7aa" : db ? "#bfdbfe" : ui ? "#ddd6fe" : "#e5e7eb";
    const color  = svc ? "#c2410c" : db ? "#1d4ed8" : ui ? "#6d28d9" : "#374151";
    nodes.push({
      id, position: { x, y: 140 }, data: { label: dir.name },
      style: { background: bg, border: `1.5px solid ${border}`, color, fontSize: 12,
                fontFamily: "Inter,sans-serif", padding: "6px 14px", borderRadius: 8 },
    });
    edges.push({ id: `r-${id}`, source: "root", target: id,
      style: { stroke: svc ? "#f97316" : "#e5e7eb", strokeWidth: svc ? 2 : 1.5 }, animated: svc });
    (dir.children || []).filter(c => c.type === "directory").slice(0, 4).forEach((sub, j) => {
      const sid = `${id}s${j}`;
      nodes.push({
        id: sid, position: { x: x + (j - 1.5) * 125, y: 280 }, data: { label: sub.name },
        style: { background:"#ffffff", border:"1px solid #f3f4f6", color:"#6b7280",
                  fontSize:11, fontFamily:"Inter,sans-serif", padding:"4px 10px", borderRadius:6 },
      });
      edges.push({ id:`${id}-${sid}`, source:id, target:sid, style:{ stroke:"#f3f4f6", strokeWidth:1 } });
    });
  });
  return { nodes, edges };
}

export default function FlowView({ fileTree, repoName }: { fileTree: unknown; repoName: string }) {
  const [nodes, setNodes, onNC] = useNodesState([]);
  const [edges, setEdges, onEC] = useEdgesState([]);
  useEffect(() => {
    const { nodes: n, edges: e } = buildGraph(fileTree as TN | null, repoName);
    setNodes(n); setEdges(e);
  }, [fileTree, repoName]);
  return (
    <div style={{ width:"100%", height:"100%", background:"#f9fafb" }}>
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNC} onEdgesChange={onEC}
        fitView fitViewOptions={{ padding:0.2 }} style={{ background:"#f9fafb" }}>
        <Background color="#e5e7eb" gap={32} size={1} />
        <Controls style={{ background:"#ffffff", border:"1px solid #e5e7eb", borderRadius:8 }} />
        <MiniMap style={{ background:"#ffffff", border:"1px solid #e5e7eb", borderRadius:8 }} nodeColor="#fed7aa" />
      </ReactFlow>
    </div>
  );
}
