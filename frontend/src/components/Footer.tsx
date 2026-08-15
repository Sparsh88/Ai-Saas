import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Phone, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const socialLinks = [
    {
      name: 'WhatsApp',
      handle: '+91 7088951914',
      url: 'https://wa.me/917088951914',
      badgeColor: 'hover:border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400 group-hover:text-emerald-300',
      glowColor: 'group-hover:shadow-[0_0_15px_rgba(16,185,129,0.35)]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.98-.276-.1-.477-.15-.678.15s-.779.98-.954 1.18c-.176.2-.351.226-.653.075-.301-.15-1.272-.469-2.423-1.496-.897-.8-1.502-1.788-1.678-2.089-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.101-.201.05-.377-.025-.527s-.678-1.634-.929-2.239c-.245-.588-.493-.509-.678-.518l-.578-.01c-.2 0-.527.075-.803.376s-1.055 1.03-1.055 2.512c0 1.482 1.08 2.913 1.231 3.114.15.201 2.125 3.245 5.15 4.551.72.311 1.282.497 1.72.636.723.23 1.381.197 1.901.12.579-.087 1.782-.728 2.033-1.431.251-.703.251-1.306.176-1.431-.075-.126-.276-.201-.577-.352zm-5.452 7.618h-.008C10.153 22 8.32 21.503 6.71 20.558l-.481-.285-3.568.936.953-3.479-.313-.498C2.26 15.614 1.71 13.845 1.71 12c0-5.679 4.62-10.29 10.301-10.29 2.75 0 5.337 1.072 7.283 3.018 1.946 1.946 3.016 4.533 3.016 7.282 0 5.68-4.62 10.29-10.29 10.29zm8.383-18.664C18.17 1.104 15.22.001 12.02.001 5.412.001.035 5.378.035 11.986c0 2.11.55 4.167 1.597 5.981L0 24l6.195-1.625c1.743.95 3.705 1.45 5.825 1.45h.005c6.608 0 11.985-5.377 11.985-11.985 0-3.201-1.246-6.21-3.607-8.508z" />
        </svg>
      )
    },
    {
      name: 'Telegram',
      handle: '+91 7088951914',
      url: 'https://t.me/+917088951914',
      badgeColor: 'hover:border-sky-500/50 hover:bg-sky-500/10 text-sky-400 group-hover:text-sky-300',
      glowColor: 'group-hover:shadow-[0_0_15px_rgba(14,165,233,0.35)]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.326-1.383 4.017-1.624 4.469-1.632z" />
        </svg>
      )
    },
    {
      name: 'Instagram',
      handle: '@sparshchauhan050',
      url: 'https://www.instagram.com/sparshchauhan050/',
      badgeColor: 'hover:border-pink-500/50 hover:bg-pink-500/10 text-pink-400 group-hover:text-pink-300',
      glowColor: 'group-hover:shadow-[0_0_15px_rgba(236,72,153,0.35)]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    }
  ];

  return (
    <footer className="mt-auto pt-8 pb-4 border-t border-white/5 bg-slate-950/40 backdrop-blur-md relative z-10 select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Author Info */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 font-bold font-heading text-sm text-slate-300">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              SkillForge AI
            </span>
          </div>
          <span className="hidden sm:inline text-slate-700">•</span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            Engineered with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" /> by <strong className="text-slate-200 font-semibold">Sparsh Chauhan</strong>
          </span>
        </div>

        {/* Social Connect Icons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          {socialLinks.map((social) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 transition-all text-xs duration-200 cursor-pointer ${social.badgeColor} ${social.glowColor}`}
              title={`Connect on ${social.name}: ${social.handle}`}
            >
              <span className="shrink-0">{social.icon}</span>
              <span className="font-semibold text-[11px] text-slate-300 group-hover:text-white transition-colors">
                {social.name}
              </span>
              <ExternalLink className="w-2.5 h-2.5 opacity-40 group-hover:opacity-100 transition-opacity" />
            </motion.a>
          ))}
        </div>

      </div>

      {/* Subtle Copyright & Live Status Indicator */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-4 pt-3 border-t border-white/[0.03] flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>All AI Models & Services Operational</span>
        </div>
        <div>
          © {new Date().getFullYear()} SkillForge AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
