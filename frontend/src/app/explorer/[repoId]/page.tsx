"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { ChevronDown, ChevronRight, File, Folder, FolderOpen, Code2, Loader2, MessageSquare, BarChart2, Search, Sparkles, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { api, type TreeNode, type RepoFileData } from "@/lib/api";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const LANG_MAP: Record<string, string> = {
  python:"python", javascript:"javascript", typescript:"typescript",
  java:"java", go:"go", rust:"rust", cpp:"cpp", c:"c",
  csharp:"csharp", ruby:"ruby", yaml:"yaml", json:"json",
  markdown:"markdown", html:"html", css:"css", scss:"scss",
  sql:"sql", bash:"shell", toml:"ini",
};

export default function ExplorerPage() {
  const { repoId }  = useParams<{ repoId: string }>();
  const [tree,      setTree]      = useState<TreeNode | null>(null);
  const [repoName,  setRepoName]  = useState("");
  const [selected,  setSelected]  = useState<RepoFileData | null>(null);
  const [loadingF,  setLoadingF]  = useState(false);
  const [expanded,  setExpanded]  = useState<Set<string>>(new Set());
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    api.repos.get(repoId).then(r => setRepoName(r.name));
    api.repos.fileTree(repoId).then(d => setTree(d.file_tree));
  }, [repoId]);

  const openFile = useCallback(async (path: string) => {
    setLoadingF(true);
    try { setSelected(await api.repos.file(repoId, path)); }
    finally { setLoadingF(false); }
  }, [repoId]);

  async function analyzeFile() {
    if (!selected) return;
    setAnalyzing(true);
    try {
      const r = await api.analysis.file(repoId, selected.path);
      setSelected(prev => prev ? { ...prev, summary: r.content } : prev);
    } catch (e: unknown) {
      alert("Analysis failed: " + (e instanceof Error ? e.message : "error"));
    } finally { setAnalyzing(false); }
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="nav-bar px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Code2 size={14} className="text-white" />
            </div>
          </Link>
          <span className="text-gray-400 text-sm">/</span>
          <span className="text-gray-900 font-semibold text-sm truncate max-w-[200px]">{repoName}</span>
        </div>
        <div className="flex items-center gap-2">
          {[
            { href: `/search/${repoId}`,      Icon: Search,        label: "Search" },
            { href: `/chat/${repoId}`,         Icon: MessageSquare, label: "Chat"   },
            { href: `/architecture/${repoId}`, Icon: BarChart2,     label: "Arch"   },
            { href: `/docs/${repoId}`,         Icon: BookOpen,      label: "Docs"   },
          ].map(({ href, Icon, label }) => (
            <Link key={href} href={href} className="btn-ghost py-1.5 px-3 text-xs">
              <Icon size={12} />{label}
            </Link>
          ))}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* File tree */}
        <aside className="w-60 border-r border-gray-200 overflow-y-auto bg-gray-50 shrink-0">
          <div className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 bg-white">
            Explorer
          </div>
          {tree
            ? <TreeView node={tree} depth={0} expanded={expanded} setExpanded={setExpanded}
                selectedPath={selected?.path} onOpen={openFile} />
            : <div className="flex justify-center py-12"><Loader2 size={18} className="animate-spin text-orange-400" /></div>
          }
        </aside>

        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selected ? (
            <>
              <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-200 bg-white text-xs shrink-0">
                <File size={12} className="text-orange-400 shrink-0" />
                <span className="text-gray-700 font-medium truncate flex-1">{selected.path}</span>
                <span className="text-gray-300 shrink-0">{selected.line_count} lines</span>
                {selected.language && (
                  <span className="px-2.5 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full font-semibold shrink-0">
                    {selected.language}
                  </span>
                )}
              </div>
              {loadingF
                ? <div className="flex-1 flex items-center justify-center"><Loader2 size={22} className="animate-spin text-orange-400" /></div>
                : <MonacoEditor height="100%"
                    language={LANG_MAP[selected.language || ""] || "plaintext"}
                    value={selected.content || "// Content unavailable"}
                    theme="vs"
                    options={{ readOnly: true, fontSize: 13,
                      fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
                      minimap: { enabled: true }, scrollBeyondLastLine: false,
                      padding: { top: 16 }, wordWrap: "off" }} />
              }
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-4">
              <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center animate-float">
                <Code2 size={36} className="text-orange-300" />
              </div>
              <p className="text-sm text-gray-400 font-medium">Select a file to view its code</p>
            </div>
          )}
        </div>

        {/* AI sidebar */}
        {selected && (
          <aside className="w-64 border-l border-gray-200 bg-white flex flex-col shrink-0 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles size={13} className="text-orange-500" />
                <span className="text-xs font-bold text-gray-600">AI Analysis</span>
              </div>
              {!selected.summary && !analyzing && (
                <button onClick={analyzeFile} className="text-xs text-orange-500 font-bold hover:text-orange-600 transition-colors">
                  Analyse →
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {analyzing && (
                <div className="flex items-center gap-2 text-gray-400 text-xs p-3 bg-orange-50 rounded-xl">
                  <Loader2 size={13} className="animate-spin text-orange-400" />Analysing with Gemini…
                </div>
              )}
              {selected.summary && !analyzing && (
                <div className="ai-prose"><ReactMarkdown>{selected.summary}</ReactMarkdown></div>
              )}
              {!selected.summary && !analyzing && (
                <p className="text-xs text-gray-400 p-3 bg-gray-50 rounded-xl">
                  Click &ldquo;Analyse →&rdquo; to get an AI explanation of this file.
                </p>
              )}
              {selected.functions?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Functions ({selected.functions.length})
                  </p>
                  <ul className="space-y-1">
                    {selected.functions.slice(0, 20).map((fn, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-600 py-1 px-2 rounded-lg hover:bg-orange-50">
                        <span className="text-orange-400 font-bold shrink-0">ƒ</span>
                        <span className="truncate">{typeof fn === "string" ? fn : fn.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selected.classes?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Classes ({selected.classes.length})
                  </p>
                  <ul className="space-y-1">
                    {selected.classes.slice(0, 10).map((cls, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-600 py-1 px-2 rounded-lg hover:bg-orange-50">
                        <span className="text-blue-400 shrink-0">◆</span>
                        <span className="truncate">{typeof cls === "string" ? cls : cls.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function TreeView({ node, depth, expanded, setExpanded, selectedPath, onOpen }: {
  node: TreeNode; depth: number; expanded: Set<string>;
  setExpanded: (fn: (p: Set<string>) => Set<string>) => void;
  selectedPath?: string; onOpen: (p: string) => void;
}) {
  const key = node.path || node.name;
  const isExp = expanded.has(key);
  if (node.type === "file") return (
    <div onClick={() => onOpen(node.path!)}
      className={`flex items-center gap-2 py-1.5 cursor-pointer text-xs transition-all
        ${selectedPath === node.path
          ? "bg-orange-100 text-orange-600 font-semibold border-r-2 border-orange-500"
          : "text-gray-600 hover:text-gray-900 hover:bg-white"}`}
      style={{ paddingLeft: `${16 + depth * 14}px` }}>
      <File size={10} className="shrink-0 opacity-60" />
      <span className="truncate">{node.name}</span>
    </div>
  );
  return (
    <div>
      <div onClick={() => setExpanded(p => { const n = new Set(p); n.has(key) ? n.delete(key) : n.add(key); return n; })}
        className="flex items-center gap-1.5 py-1.5 cursor-pointer text-xs text-gray-500 hover:text-gray-900 hover:bg-white transition-all"
        style={{ paddingLeft: `${10 + depth * 14}px` }}>
        {isExp ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
        {isExp ? <FolderOpen size={12} className="text-orange-400 shrink-0" /> : <Folder size={12} className="text-orange-300 shrink-0" />}
        <span className="truncate font-medium">{node.name}</span>
      </div>
      {isExp && node.children?.map(c => (
        <TreeView key={c.name} node={c} depth={depth + 1}
          expanded={expanded} setExpanded={setExpanded}
          selectedPath={selectedPath} onOpen={onOpen} />
      ))}
    </div>
  );
}
