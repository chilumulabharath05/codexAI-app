"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, GitBranch, Loader2, Trash2, Code2, MessageSquare, BarChart2, Search, RefreshCw, Sparkles } from "lucide-react";
import { api, type Repo } from "@/lib/api";

const S: Record<string, { label: string; cls: string; spin: boolean }> = {
  pending:   { label: "Queued",   cls: "badge-pending",   spin: false },
  cloning:   { label: "Cloning",  cls: "badge-cloning",   spin: true  },
  parsing:   { label: "Parsing",  cls: "badge-parsing",   spin: true  },
  embedding: { label: "Indexing", cls: "badge-embedding", spin: true  },
  ready:     { label: "Ready",    cls: "badge-ready",     spin: false },
  failed:    { label: "Failed",   cls: "badge-failed",    spin: false },
};
const LANG_DOT: Record<string, string> = {
  python:"#3572A5", javascript:"#f1e05a", typescript:"#2b7489",
  go:"#00ADD8", rust:"#dea584", java:"#b07219", cpp:"#f34b7d",
  ruby:"#cc342d", php:"#4f5d95",
};

export default function Dashboard() {
  const [repos,   setRepos]   = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try { setRepos(await api.repos.list()); }
    catch { /* silent */ }
    finally { setLoading(false); }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
  }, []);

  async function del(id: string, e: React.MouseEvent) {
    e.preventDefault();
    if (!confirm("Delete this repository and all its data?")) return;
    await api.repos.delete(id);
    setRepos(r => r.filter(x => x.id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="nav-bar px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm shadow-orange-200">
            <Code2 size={17} className="text-white" />
          </div>
          <span className="text-gray-900 text-lg font-bold">CodexAI</span>
        </Link>
        <div className="flex items-center gap-5 text-sm">
          <span className="text-gray-900 font-semibold">Dashboard</span>
          <Link href="/settings" className="text-gray-500 hover:text-orange-500 transition-colors">Settings</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Repositories</h1>
            <p className="text-sm text-gray-400">{repos.length} total · powered by Google Gemini</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={load} className="btn-ghost p-2.5" title="Refresh">
              <RefreshCw size={14} />
            </button>
            <Link href="/import" className="btn-primary">
              <Plus size={14} /> Import Repository
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-28 w-full" />)}
          </div>
        ) : repos.length === 0 ? (
          <div className="border-2 border-dashed border-orange-200 bg-white rounded-2xl py-24 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-5 animate-float">
              <Sparkles size={28} className="text-orange-400" />
            </div>
            <p className="text-gray-900 text-lg font-bold mb-2">No repositories yet</p>
            <p className="text-gray-400 text-sm mb-7 max-w-xs mx-auto">
              Import a public Git repo or ZIP to start exploring with Gemini AI.
            </p>
            <Link href="/import" className="btn-primary">
              <Plus size={14} /> Import your first repository
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {repos.map(r => {
              const cfg   = S[r.status] ?? S.pending;
              const ready = r.status === "ready";
              const lang  = r.language || Object.keys(r.languages)[0];
              return (
                <div key={r.id} className={`bg-white rounded-2xl border border-gray-200 p-5 hover:border-orange-300 hover:shadow-md transition-all ${!ready ? "opacity-75" : ""}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                          <GitBranch size={14} className="text-orange-500" />
                        </div>
                        {ready
                          ? <Link href={`/explorer/${r.id}`} className="text-gray-900 font-bold text-base hover:text-orange-500 transition-colors truncate">{r.name}</Link>
                          : <span className="text-gray-900 font-bold text-base truncate">{r.name}</span>
                        }
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold ${cfg.cls}`}>
                          {cfg.spin && <Loader2 size={10} className="animate-spin" />}
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        {lang && (
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: LANG_DOT[lang] || "#999" }} />
                            {lang}
                          </span>
                        )}
                        {ready && (
                          <><span>{r.total_files.toLocaleString()} files</span><span>{(r.total_lines / 1000).toFixed(1)}k lines</span></>
                        )}
                        {r.url && <span className="truncate max-w-xs hidden md:block text-xs text-gray-300">{r.url}</span>}
                        {r.error && <span className="text-red-500 text-xs truncate max-w-sm">{r.error}</span>}
                      </div>
                      {ready && Object.keys(r.languages).length > 0 && (
                        <div className="flex rounded-full overflow-hidden h-1.5 w-48 mt-3 gap-px">
                          {Object.entries(r.languages).slice(0, 6).map(([l, p]) => (
                            <div key={l} style={{ width: `${p}%`, background: LANG_DOT[l] || "#ccc" }} />
                          ))}
                        </div>
                      )}
                      {ready && r.tech_stack?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {r.tech_stack.slice(0, 6).map(t => (
                            <span key={t} className="px-2.5 py-0.5 bg-orange-50 border border-orange-200 text-orange-600 text-xs rounded-full font-medium">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {ready && (
                        <div className="hidden sm:flex items-center gap-1.5">
                          <Link href={`/search/${r.id}`}      className="btn-ghost py-1.5 px-3 text-xs"><Search size={12} />Search</Link>
                          <Link href={`/chat/${r.id}`}         className="btn-ghost py-1.5 px-3 text-xs"><MessageSquare size={12} />Chat</Link>
                          <Link href={`/architecture/${r.id}`} className="btn-ghost py-1.5 px-3 text-xs"><BarChart2 size={12} />Arch</Link>
                        </div>
                      )}
                      <button onClick={e => del(r.id, e)} className="p-2.5 text-gray-300 hover:text-red-400 transition-colors rounded-lg hover:bg-red-50" title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
