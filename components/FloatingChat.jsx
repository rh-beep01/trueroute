"use client";
import React, { useState } from "react";

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat Popup Box */}
      {isOpen && (
        <div className="mb-3 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden animate-fadeInUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral-500 to-amber-500 flex items-center justify-center text-lg shadow-sm" style={{ background: "linear-gradient(135deg, #E05A47 0%, #DFB15B 100%)" }}>
                  🧭
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight text-white">Roamify Support</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[11px] text-emerald-300 font-medium">Online · Direct Travel Specialist</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 space-y-3">
            {/* Friendly message */}
            <div className="bg-white p-3.5 rounded-2xl rounded-tl-sm border border-slate-200/80 shadow-sm text-xs leading-relaxed text-slate-700">
              👋 <strong>Hi there!</strong> Have questions about our custom family itineraries, toddler pacing, or senior accessibility?
              <br /><br />
              Connect with our travel team directly through any of our channels:
            </div>

            {/* Channels List */}
            <div className="space-y-2 pt-1">
              {/* WhatsApp Button (Active) */}
              <a
                href="https://wa.me/message/N3LN7Y5F5DFHA1"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 bg-white hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-500 rounded-xl transition-all shadow-sm hover:shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-sm">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xs text-slate-800 group-hover:text-emerald-700 transition-colors">WhatsApp Business</p>
                    <p className="text-[11px] text-emerald-600 font-medium">Instant messaging · Online</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-600 group-hover:translate-x-0.5 transition-transform">Chat →</span>
              </a>

              {/* Email Support Button (Active) */}
              <a
                href="mailto:hello@roamify.life"
                className="group flex items-center justify-between p-3 bg-white hover:bg-amber-50/80 border border-slate-200 hover:border-[#DFB15B] rounded-xl transition-all shadow-sm hover:shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-950 text-[#DFB15B] flex items-center justify-center shadow-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xs text-slate-800 group-hover:text-amber-700 transition-colors">Official Email</p>
                    <p className="text-[11px] text-slate-500 font-medium">hello@roamify.life</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-transform">Email →</span>
              </a>

              {/* Facebook Messenger (Placeholder) */}
              <div className="flex items-center justify-between p-3 bg-white/70 border border-slate-200/70 rounded-xl opacity-60 cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#0084FF] text-white flex items-center justify-center shadow-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.082.3 2.235.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.056-3.259-5.963 3.259 6.559-6.963 3.13 3.259 5.889-3.259-6.559 6.963z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-xs text-slate-700">Facebook Messenger</p>
                    <p className="text-[11px] text-slate-400">Coming Soon</p>
                  </div>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-500 font-medium px-2 py-0.5 rounded-full">Soon</span>
              </div>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/roamify.life/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 bg-white hover:bg-pink-50/60 border border-slate-200/80 hover:border-pink-200 rounded-xl transition-all shadow-sm hover:shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-xs text-slate-800 group-hover:text-pink-700">Instagram</p>
                    <p className="text-[11px] text-slate-400">@roamify.life</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-pink-700 group-hover:translate-x-0.5 transition-transform">DM →</span>
              </a>
            </div>
          </div>

          {/* Footer note */}
          <div className="px-4 py-2.5 bg-slate-100/80 border-t border-slate-200/60 text-center">
            <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
              <span>🔒</span> Direct human assistance · Reply in &lt;2 hours
            </p>
          </div>
        </div>
      )}

      {/* Floating Live Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:to-slate-700 text-white font-bold py-3.5 px-5 rounded-full shadow-xl hover:shadow-2xl border border-white/15 hover:scale-105 transition-all duration-200 ease-out"
        aria-label="Open live chat"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
        </span>

        {/* Generic Live Chat SVG Icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>

        <span className="text-sm font-bold tracking-tight text-white">Live Chat</span>
      </button>
    </div>
  );
}