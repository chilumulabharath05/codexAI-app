"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import { Code2, ChevronLeft, BookOpen, GitBranch, Shield, Loader2, Layers, MessageSquare } from "lucide-react";
import { api, type Repo, type Analysis } from "@/lib/api";

const FlowView = dynamic(() => import("./FlowView"), { ssr: false });
type Tab = "architecture" | "graph" | "dependencies" | "security";

export default function ArchPage() {
  const { repoId } = useParams<{ repoId: string }>();
  const [repo,     setRepo]     = useState<Repo | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [tab,      setTab]      = useState<Tab>("architecture");
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([api.repos.get(repoId), api.analysis.list(repoId)])
      .then(([r, a]) => { setRepo(r); setAnalyses(a); setLoading(false); });
  }, [repoId]);

  const archA = analyses.find(a => a.type === "architecture");
  const depA  = analyses.find(a => a.type === "dependency");
  const secAs = analyses.filter(a => a.type === "security");

  const TABS = [
    { id:"architecture" as Tab, Icon:BookOpen,  label:"Architecture" },
    { id:"graph"        as Tab, Icon:Layers,    label:"Module Graph"  },
    { id:"dependencies" as Tab, Icon:GitBranch, label:"Dependencies"  },
    { id:"security"     as Tab, Icon:Shield,    label:"Security"      },
  ];

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="nav-bar px-5 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href={`/explorer/${repoId}`} className="text-gray-400 hover:text-orange-500 transition-colors">
            <ChevronLeft size={16} />
          </Link>
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
            <Code2 size={12} className="text-white" />
          </div>
          <span className="text-gray-400 text-sm truncate max-w-[160px]">{repo?.name}</span>
          <span className="text-gray-200">/</span>
          <span className="text-gray-900 font-semibold text-sm">Architecture</span>
        </div>
        <Link href={`/chat/${repoId}`} className="btn-ghost text-xs py-2 px-3">
          <MessageSquare size={12} /> Ask AI
        </Link>
      </header>

      {repo && (
        <div className="flex items-center gap-4 px-5 py-2.5 border-b border-gray-100 bg-gray-50 text-xs text-gray-400 overflow-x-auto shrink-0">
          <span className="shrink-0"><span className="text-gray-300">lang: </span>{repo.language || "—"}</span>
          <span className="shrink-0"><span className="text-gray-300">files: </span>{repo.total_files.toLocaleString()}</span>
          <span className="shrink-0"><span className="text-gray-300">lines: </span>{(repo.total_lines / 1000).toFixed(1)}k</span>
          {repo.tech_stack?.slice(0, 5).map(t => (
            <span key={t} className="shrink-0 px-2.5 py-0.5 bg-orange-100 text-orange-500 text-xs rounded-full font-medium">{t}</span>
          ))}
        </div>
      )}

      <div className="flex border-b border-gray-200 shrink-0 bg-white">
        {TABS.map(({ id, Icon, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium transition-all border-b-2
              ${tab === id ? "border-orange-500 text-orange-500" : "border-transparent text-gray-400 hover:text-gray-900"}`}>
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 gap-2">
          <Loader2 size={20} className="animate-spin text-orange-400" />Loading analysis…
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          {tab === "graph" && (
            <FlowView fileTree={(repo as Repo & { file_tree: unknown })?.file_tree ?? null} repoName={repo?.name ?? ""} />
          )}
          {tab === "architecture" && (
            <div className="h-full overflow-y-auto p-8">
              <div className="max-w-3xl mx-auto">
                {archA?.content || repo?.architecture
                  ? <div className="ai-prose"><ReactMarkdown>{archA?.content || repo?.architecture || ""}</ReactMarkdown></div>
                  : <p className="text-gray-400 text-sm">Architecture analysis not yet available.</p>
                }
              </div>
            </div>
          )}
          {tab === "dependencies" && (
            <div className="h-full overflow-y-auto p-8">
              <div className="max-w-3xl mx-auto">
                {depA
                  ? <div className="ai-prose"><ReactMarkdown>{depA.content}</ReactMarkdown></div>
                  : <p className="text-gray-400 text-sm">No dependency analysis found.</p>
                }
              </div>
            </div>
          )}
          {tab === "security" && (
            <div className="h-full overflow-y-auto p-8">
              <div className="max-w-3xl mx-auto space-y-4">
                {secAs.length > 0
                  ? secAs.map((s, i) => (
                    <div key={i} className="border border-red-200 bg-red-50 p-5 rounded-2xl">
                      <p className="text-sm text-red-600 font-bold mb-3">{s.title || s.target_path}</p>
                      <div className="ai-prose"><ReactMarkdown>{s.content.slice(0, 900)}</ReactMarkdown></div>
                    </div>
                  ))
                  : (
                    <div className="flex items-center gap-3 px-5 py-4 border border-green-200 bg-green-50 rounded-2xl">
                      <Shield size={16} className="text-green-500 shrink-0" />
                      <p className="text-sm text-green-700">No critical security issues detected in sampled files.</p>
                    </div>
                  )
                }
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
