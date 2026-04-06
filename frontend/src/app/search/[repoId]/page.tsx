"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Search, Code2, ChevronLeft, Loader2, Filter, ChevronDown } from "lucide-react";
import { api, type SearchHit } from "@/lib/api";

const EXAMPLES = ["JWT token validation","database connection","authentication middleware",
  "error handling","file upload handler","rate limiting","password hashing","async task processing"];
const LANG_DOT: Record<string, string> = {
  python:"#3572A5", javascript:"#f1e05a", typescript:"#2b7489", go:"#00ADD8", rust:"#dea584", java:"#b07219",
};

export default function SearchPage() {
  const { repoId }  = useParams<{ repoId: string }>();
  const [q,        setQ]        = useState("");
  const [lang,     setLang]     = useState("");
  const [results,  setResults]  = useState<SearchHit[]>([]);
  const [langs,    setLangs]    = useState<string[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [searched, setSearched] = useState(false);
  const [repoName, setRepoName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.repos.get(repoId).then(r => { setRepoName(r.name); setLangs(Object.keys(r.languages || {})); });
    inputRef.current?.focus();
  }, [repoId]);

  async function search(query = q) {
    if (!query.trim()) return;
    setLoading(true); setSearched(true);
    try { const res = await api.search.query(repoId, query.trim(), 15, lang || undefined); setResults(res.results); }
    catch { /* silent */ }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="nav-bar px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/explorer/${repoId}`} className="text-gray-400 hover:text-orange-500 transition-colors"><ChevronLeft size={16} /></Link>
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
            <Code2 size={12} className="text-white" />
          </div>
          <span className="text-gray-400 text-sm truncate max-w-[160px]">{repoName}</span>
          <span className="text-gray-200">/</span>
          <span className="text-gray-900 font-semibold text-sm">Semantic Search</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1.5">Semantic Code Search</h1>
          <p className="text-gray-400 text-sm">Search in natural language — powered by Google text-embedding-004.</p>
        </div>

        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
            <input ref={inputRef} value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => e.key === "Enter" && search()}
              placeholder="Search code with natural language…"
              className="input-field pl-10 shadow-sm" />
          </div>
          {langs.length > 0 && (
            <div className="relative">
              <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <select value={lang} onChange={e => setLang(e.target.value)} className="input-field pl-8 pr-4 appearance-none w-36 shadow-sm">
                <option value="">All langs</option>
                {langs.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          )}
          <button onClick={() => search()} disabled={!q.trim() || loading} className="btn-primary shadow-sm">
            {loading ? <Loader2 size={15} className="animate-spin" /> : "Search"}
          </button>
        </div>

        {!searched && (
          <div className="mb-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map(ex => (
                <button key={ex} onClick={() => { setQ(ex); search(ex); }}
                  className="px-3.5 py-1.5 bg-white border border-gray-200 text-sm text-gray-500 hover:text-orange-500 hover:border-orange-300 hover:bg-orange-50 transition-all rounded-full shadow-sm">
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
            <Loader2 size={20} className="animate-spin text-orange-400" />
            <span className="text-sm">Searching {repoName}…</span>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-20 text-gray-300">
            <Search size={32} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm text-gray-400">No results found for &ldquo;{q}&rdquo;</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{results.length} results</p>
            {results.map((hit, i) => <HitCard key={i} hit={hit} repoId={repoId} />)}
          </div>
        )}
      </main>
    </div>
  );
}

function HitCard({ hit, repoId }: { hit: SearchHit; repoId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-orange-300 hover:shadow-md transition-all">
      <div className="flex items-center justify-between px-4 py-3.5 cursor-pointer" onClick={() => setOpen(v => !v)}>
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: LANG_DOT[hit.language] || "#9ca3af" }} />
          <Link href={`/explorer/${repoId}`} onClick={e => e.stopPropagation()}
            className="text-sm text-gray-800 font-medium hover:text-orange-500 transition-colors truncate">
            {hit.file_path}
          </Link>
          <span className="text-xs text-gray-300 shrink-0">L{hit.start_line}–{hit.end_line}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          <span className="text-xs text-orange-400 font-bold">{(hit.score * 100).toFixed(0)}%</span>
          <ChevronDown size={13} className={`text-gray-300 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </div>
      {open && (
        <div className="border-t border-gray-100 px-4 py-3.5 bg-gray-50">
          <pre className="text-xs text-gray-600 overflow-x-auto leading-relaxed whitespace-pre-wrap break-words font-mono">
            {hit.snippet}
          </pre>
        </div>
      )}
    </div>
  );
}
