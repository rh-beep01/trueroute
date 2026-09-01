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
              {/* WhatsApp Button */}
              <a
                href="https://wa.me/message/N3LN7Y5F5DFHA1"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 bg-white hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-400 rounded-xl transition-all shadow-sm hover:shadow"
              >
                <div className="flex items-center gap-3">
                  <img src="/logos/whatsapp.svg" alt="WhatsApp" className="w-9 h-9 rounded-xl shadow-sm group-hover:scale-105 transition-transform" />
                  <div className="text-left">
                    <p className="font-bold text-xs text-slate-800 group-hover:text-emerald-700 transition-colors">WhatsApp Business</p>
                    <p className="text-[11px] text-emerald-600 font-medium">Instant messaging · Online</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-600 group-hover:translate-x-0.5 transition-transform">Chat →</span>
              </a>

              {/* Email Support Button */}
              <a
                href="mailto:hello@roamify.life"
                className="group flex items-center justify-between p-3 bg-white hover:bg-green-50/80 border border-slate-200 hover:border-green-400 rounded-xl transition-all shadow-sm hover:shadow"
              >
                <div className="flex items-center gap-3">
                  <img src="/logos/email.svg" alt="Email" className="w-9 h-9 rounded-xl shadow-sm group-hover:scale-105 transition-transform" />
                  <div className="text-left">
                    <p className="font-bold text-xs text-slate-800 group-hover:text-green-700 transition-colors">Official Email</p>
                    <p className="text-[11px] text-slate-500 font-medium">hello@roamify.life</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-green-700 group-hover:translate-x-0.5 transition-transform">Email →</span>
              </a>

              {/* Facebook Page */}
              <a
                href="https://www.facebook.com/share/1FQTVLfs94/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 bg-white hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-300 rounded-xl transition-all shadow-sm hover:shadow"
              >
                <div className="flex items-center gap-3">
                  <img src="/logos/facebook.svg" alt="Facebook" className="w-9 h-9 rounded-xl shadow-sm group-hover:scale-105 transition-transform" />
                  <div className="text-left">
                    <p className="font-semibold text-xs text-slate-800 group-hover:text-blue-700 transition-colors">Facebook Page</p>
                    <p className="text-[11px] text-blue-500 font-medium">Follow & message us</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-transform">Visit →</span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/roamify.life/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 bg-white hover:bg-pink-50/60 border border-slate-200/80 hover:border-pink-300 rounded-xl transition-all shadow-sm hover:shadow"
              >
                <div className="flex items-center gap-3">
                  <img src="/logos/instagram.svg" alt="Instagram" className="w-9 h-9 rounded-xl shadow-sm group-hover:scale-105 transition-transform" />
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