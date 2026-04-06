"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Code2, ChevronLeft, BookOpen, Zap, Copy, Check, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

type Tab = "architecture" | "readme" | "apidocs";

export default function DocsPage() {
  const { repoId } = useParams<{ repoId: string }>();
  const [tab,      setTab]     = useState<Tab>("architecture");
  const [repoName, setRepoName]= useState("");
  const [content,  setContent] = useState<Record<Tab, string | null>>({ architecture:null, readme:null, apidocs:null });
  const [loading,  setLoading] = useState(false);
  const [copied,   setCopied]  = useState(false);

  useEffect(() => {
    api.repos.get(repoId).then(r => { setRepoName(r.name); setContent(c => ({ ...c, architecture: r.architecture || null })); });
  }, [repoId]);

  async function handleTab(t: Tab) {
    setTab(t);
    if (content[t] !== null) return;
    setLoading(true);
    try {
      if (t === "readme") { const d = await api.search.readme(repoId); setContent(c => ({ ...c, readme: d.content })); }
      else if (t === "apidocs") { const d = await api.search.apidocs(repoId); setContent(c => ({ ...c, apidocs: d.content })); }
    } catch (e: unknown) { setContent(c => ({ ...c, [t]: `Error: ${e instanceof Error ? e.message : "Failed"}` })); }
    finally { setLoading(false); }
  }

  async function copy() {
    await navigator.clipboard.writeText(content[tab] || "");
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  const cur = content[tab];

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="nav-bar px-5 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href={`/explorer/${repoId}`} className="text-gray-400 hover:text-orange-500 transition-colors"><ChevronLeft size={16} /></Link>
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
            <Code2 size={12} className="text-white" />
          </div>
          <span className="text-gray-400 text-sm">{repoName}</span>
          <span className="text-gray-200">/</span>
          <span className="text-gray-900 font-semibold text-sm">Docs</span>
        </div>
        {cur && (
          <button onClick={copy} className="btn-ghost text-xs py-2 px-3">
            {copied ? <><Check size={12} className="text-green-500" />Copied!</> : <><Copy size={12} />Copy Markdown</>}
          </button>
        )}
      </header>

      <div className="flex border-b border-gray-200 shrink-0 bg-white">
        {([["architecture", BookOpen, "Architecture"], ["readme", Code2, "README.md"], ["apidocs", Zap, "API Docs"]] as const).map(([id, Icon, label]) => (
          <button key={id} onClick={() => handleTab(id)}
            className={`flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium transition-all border-b-2
              ${tab === id ? "border-orange-500 text-orange-500" : "border-transparent text-gray-400 hover:text-gray-900"}`}>
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-gray-400 gap-2">
              <Loader2 size={20} className="animate-spin text-orange-400" />
              <span className="text-sm">Generating with Gemini…</span>
            </div>
          ) : cur ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <div className="ai-prose"><ReactMarkdown remarkPlugins={[remarkGfm]}>{cur}</ReactMarkdown></div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-gray-300">
              <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mb-5 animate-float">
                <BookOpen size={36} className="text-orange-300" />
              </div>
              <p className="text-sm text-gray-400 mb-6 text-center max-w-xs">
                {tab === "architecture"
                  ? "Architecture analysis not yet generated. Import and process a repo first."
                  : "Click below to generate this documentation with Gemini AI."}
              </p>
              {tab !== "architecture" && (
                <button onClick={() => handleTab(tab)} className="btn-primary">
                  <Zap size={14} /> Generate {tab === "readme" ? "README" : "API Docs"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
