import Link from "next/link";
import { ArrowRight, Code2, GitBranch, Search, Zap, Shield, Layers, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* NAV */}
      <nav className="nav-bar px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center shadow-md shadow-orange-200">
            <Code2 size={18} className="text-white" />
          </div>
          <span className="text-gray-900 text-lg font-bold tracking-tight">CodexAI</span>
          <span className="hidden sm:block text-[10px] px-2 py-0.5 bg-orange-50 border border-orange-200 text-orange-600 rounded-full font-semibold tracking-wide uppercase">
            Free · Gemini
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <a href="#features" className="hover:text-orange-500 transition-colors font-medium hidden sm:block">Features</a>
          <a href="#how" className="hover:text-orange-500 transition-colors font-medium hidden sm:block">How it works</a>
          <Link href="/dashboard" className="btn-primary text-sm px-5 py-2">
            Open App →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="grid-bg">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-20 animate-fadeIn text-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse2" />
            Free · Google Gemini AI · No credit card needed
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight mb-6 text-gray-900">
            Understand any codebase<br />
            <span className="text-orange-500">instantly with AI.</span>
          </h1>
          <p className="text-gray-500 text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Import any GitHub repo, ZIP, or Git URL. CodexAI indexes every file,
            maps the architecture using <strong className="text-gray-700">Google Gemini</strong>,
            and lets you chat with your codebase using RAG.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Link href="/dashboard" className="btn-primary text-base px-8 py-3.5">
              Start for free <ArrowRight size={17} />
            </Link>
            <Link href="/import" className="btn-ghost text-base px-8 py-3.5">
              <GitBranch size={16} /> Import a repo
            </Link>
          </div>

          {/* Demo card */}
          <div className="max-w-3xl mx-auto bg-gray-900 rounded-2xl overflow-hidden shadow-2xl text-left">
            <div className="flex items-center gap-2 px-5 py-3.5 bg-gray-800 border-b border-gray-700">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="ml-2 text-[11px] text-gray-400 font-mono tracking-wider">
                CodexAI Terminal
              </span>
            </div>
            <div className="p-6 text-[13px] leading-[2] font-mono text-gray-300">
              <p><span className="text-orange-400">$</span> codex analyze https://github.com/tiangolo/fastapi</p>
              <p className="text-gray-500">✓ Cloned 847 files — Python 78% · TypeScript 14%</p>
              <p className="text-gray-500">✓ Generated 4,820 semantic chunks (Google embeddings)</p>
              <p className="text-gray-500">✓ Architecture analysis via Gemini 1.5 Flash</p>
              <div className="mt-2 pl-4 border-l-2 border-orange-500 space-y-0.5">
                <p className="text-orange-400">→ Pattern: Layered ASGI + Pydantic v2</p>
                <p className="text-orange-400">→ Entry: <span className="text-white">fastapi/applications.py</span></p>
                <p className="text-orange-400">→ 14 modules documented · 2 security findings</p>
              </div>
              <p className="mt-3 text-white font-semibold">✦ Ready — ask anything about this codebase</p>
              <p><span className="text-orange-400">›</span> <span className="text-white">How does FastAPI handle dependency injection?</span></p>
              <p className="text-gray-400 pl-3 border-l border-orange-500/30 mt-0.5">
                FastAPI uses <span className="text-orange-400">Depends()</span> in fastapi/dependencies/utils.py...
              </p>
              <p><span className="text-orange-400">›</span> <span className="animate-blink text-white">█</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-orange-500 text-xs font-bold tracking-[.25em] uppercase mb-2">Capabilities</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Everything to grok a codebase</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: GitBranch, t: "Universal Import",      d: "GitHub, GitLab, Bitbucket, any Git URL or ZIP. Works with any public repo instantly." },
              { icon: Layers,    t: "Architecture Analysis", d: "Detect MVC, microservices, hexagonal patterns. Auto-generate docs with Gemini." },
              { icon: Search,    t: "Semantic Code Search",  d: "Natural language search across every file using Google text-embedding-004." },
              { icon: Zap,       t: "AI Chat + RAG",         d: "Chat with your codebase. Get answers with exact file and line number citations." },
              { icon: Shield,    t: "Security Scanning",     d: "Detect hardcoded secrets, injection risks, and insecure patterns automatically." },
              { icon: Sparkles,  t: "100% Free",             d: "Powered by Google Gemini 1.5 Flash — 1,500 free requests/day. No billing ever." },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="glow-card p-6 group cursor-default">
                <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-all">
                  <Icon size={20} className="text-orange-500 group-hover:text-white transition-colors" />
                </div>
                <p className="text-gray-900 font-bold mb-2">{t}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-orange-500 text-xs font-bold tracking-[.25em] uppercase mb-2">Pipeline</p>
            <h2 className="text-3xl font-extrabold text-gray-900">How CodexAI works</h2>
          </div>
          <div className="flex flex-col gap-0">
            {[
              { n:"01", t:"Import",  d:"Clone a Git repo or extract a ZIP. Files are walked recursively with smart language detection." },
              { n:"02", t:"Parse",   d:"Language-aware splitters create semantic chunks at function and class boundaries." },
              { n:"03", t:"Embed",   d:"Google text-embedding-004 converts chunks to 768-dim vectors stored in ChromaDB — free." },
              { n:"04", t:"Analyse", d:"Gemini 1.5 Flash generates architecture overview, file summaries, and dependency analysis." },
              { n:"05", t:"Explore", d:"Browse files, view AI explanations, run semantic search, and chat with full RAG context." },
            ].map(({ n, t, d }, i, arr) => (
              <div key={t} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 bg-orange-500 text-white text-sm font-extrabold rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-orange-200">
                    {n}
                  </div>
                  {i < arr.length - 1 && (
                    <div className="w-0.5 flex-1 bg-orange-200 my-2" />
                  )}
                </div>
                <div className={`pb-8 pt-2 ${i < arr.length - 1 ? "" : ""}`}>
                  <p className="text-gray-900 font-bold mb-1">{t}</p>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-lg">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-500 py-20 text-center">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float">
          <Sparkles size={28} className="text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-3">Ready to understand your codebase?</h2>
        <p className="text-orange-100 text-lg mb-8">
          Get a free key at <span className="text-white font-semibold">aistudio.google.com</span> and start in 2 minutes.
        </p>
        <Link href="/dashboard"
          className="inline-flex items-center gap-2 bg-white text-orange-500 font-bold text-base px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-all shadow-lg">
          Open Dashboard <ArrowRight size={17} />
        </Link>
      </section>

      <footer className="bg-gray-50 border-t border-gray-200 py-6 text-center text-gray-400 text-sm">
        CodexAI v2 — FastAPI + Next.js 14 + Google Gemini (Free)
      </footer>
    </div>
  );
}
