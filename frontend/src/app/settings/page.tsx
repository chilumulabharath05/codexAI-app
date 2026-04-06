"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Code2, Eye, EyeOff, Save, CheckCircle, ExternalLink, Sparkles } from "lucide-react";

export default function SettingsPage() {
  const [saved,   setSaved]   = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [gemini,  setGemini]  = useState("");

  async function save() {
    await new Promise(r => setTimeout(r, 500));
    setSaved(true); setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="nav-bar px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors text-sm font-medium">
          <ArrowLeft size={15} /> Back
        </Link>
        <span className="text-gray-200">|</span>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Code2 size={14} className="text-white" />
          </div>
          <span className="text-gray-900 font-bold">CodexAI</span>
        </Link>
      </nav>

      <main className="max-w-lg mx-auto px-6 py-14">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-400 text-sm mb-8">Configure your Google Gemini API key.</p>

        <div className="space-y-5">
          {/* CTA Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg shadow-orange-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <p className="font-bold mb-1">Get your free Gemini API key</p>
                <p className="text-orange-100 text-sm leading-relaxed mb-4">
                  Google Gemini is 100% free — 1,500 requests/day with Gemini 1.5 Flash. No credit card.
                </p>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-orange-500 font-bold text-sm px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors">
                  <ExternalLink size={13} /> Get API Key at Google AI Studio
                </a>
              </div>
            </div>
          </div>

          {/* Key field */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">API Key</p>
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Gemini API Key</label>
            <div className="relative">
              <input type={showKey ? "text" : "password"} value={gemini}
                onChange={e => setGemini(e.target.value)} placeholder="AIzaSy…"
                className="input-field pr-11" />
              <button onClick={() => setShowKey(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors">
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Used for all AI analysis, chat, and embeddings.</p>
          </div>

          {/* Dev note */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Local Development</p>
            <p className="text-sm text-gray-500 leading-relaxed mb-3">
              Add your key to the backend <code className="text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded text-xs font-mono">.env</code> file:
            </p>
            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm">
              <span className="text-gray-500"># backend/.env</span><br />
              <span className="text-orange-400">GEMINI_API_KEY</span><span className="text-gray-400">=AIzaSy…</span>
            </div>
            <p className="text-xs text-gray-400 mt-3">Restart the backend server after updating the .env file.</p>
          </div>

          <button onClick={save} className="btn-primary w-full justify-center py-3.5 text-base">
            {saved ? <><CheckCircle size={16} />Saved!</> : <><Save size={16} />Save Settings</>}
          </button>
        </div>
      </main>
    </div>
  );
}
