"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Code2, GitBranch, Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

export default function ImportPage() {
  const router = useRouter();
  const [mode,    setMode]    = useState<"git" | "zip">("git");
  const [url,     setUrl]     = useState("");
  const [branch,  setBranch]  = useState("main");
  const [name,    setName]    = useState("");
  const [file,    setFile]    = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const autoName = (u: string) => { try { return u.replace(/\.git$/, "").split("/").at(-1) || ""; } catch { return ""; } };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (mode === "git") {
        if (!url.trim()) throw new Error("Git URL is required");
        await api.repos.importGit({ url: url.trim(), branch: branch || "main", name: name || autoName(url) });
      } else {
        if (!file) throw new Error("Please select a ZIP file");
        const fd = new FormData();
        fd.append("file", file);
        fd.append("name", name || file.name.replace(/\.zip$/, ""));
        await api.repos.importZip(fd);
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="nav-bar px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors text-sm font-medium">
          <ArrowLeft size={15} /> Back
        </Link>
        <span className="text-gray-300">|</span>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Code2 size={15} className="text-white" />
          </div>
          <span className="text-gray-900 font-bold">CodexAI</span>
        </Link>
      </nav>

      <main className="max-w-lg mx-auto px-6 py-16">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Import Repository</h1>
          <p className="text-gray-400 text-sm">Analyse any public Git repo or ZIP archive with Google Gemini AI — free.</p>
        </div>

        <div className="flex bg-white border border-gray-200 rounded-xl mb-8 overflow-hidden shadow-sm">
          {(["git", "zip"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-all
                ${mode === m ? "bg-orange-500 text-white" : "text-gray-500 hover:text-orange-500 hover:bg-orange-50"}`}>
              {m === "git" ? <><GitBranch size={15} /> Git URL</> : <><Upload size={15} /> ZIP Upload</>}
            </button>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <form onSubmit={submit} className="space-y-5">
            {mode === "git" ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Git URL</label>
                  <input type="url" value={url}
                    onChange={e => { setUrl(e.target.value); if (!name) setName(autoName(e.target.value)); }}
                    placeholder="https://github.com/owner/repository"
                    className="input-field" />
                  <p className="text-xs text-gray-400 mt-1.5">Any public GitHub, GitLab, Bitbucket or bare Git URL</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Branch</label>
                    <input value={branch} onChange={e => setBranch(e.target.value)} placeholder="main" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Name (optional)</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="auto-detected" className="input-field" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">ZIP Archive</label>
                  <div onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-orange-200 bg-orange-50 hover:border-orange-400 transition-colors py-14 rounded-xl text-center cursor-pointer">
                    {file ? (
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle size={28} className="text-orange-500" />
                        <span className="text-gray-900 font-semibold">{file.name}</span>
                        <span className="text-gray-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2.5 text-gray-400">
                        <Upload size={28} className="text-orange-300" />
                        <span className="text-sm font-medium">Click to select ZIP file</span>
                        <span className="text-xs text-gray-300">Max 200 MB</span>
                      </div>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept=".zip" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); if (!name) setName(f.name.replace(/\.zip$/, "")); } }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Repository Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="my-project" className="input-field" />
                </div>
              </>
            )}

            {error && (
              <div className="flex items-start gap-3 px-4 py-3 border border-red-200 bg-red-50 rounded-xl">
                <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Importing…</> : <><GitBranch size={16} /> Begin Analysis</>}
            </button>
          </form>
        </div>

        <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">What happens next</p>
          <ol className="space-y-3">
            {[
              "Repository cloned or extracted securely",
              "Files parsed and chunked by language",
              "Gemini AI generates summaries and architecture analysis",
              "Chunks embedded with Google text-embedding-004",
              "Chat and semantic search become available",
            ].map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-500">
                <span className="w-6 h-6 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </main>
    </div>
  );
}
