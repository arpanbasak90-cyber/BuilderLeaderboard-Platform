'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, Download, ShieldCheck, Palette, Sparkles, Layers, Code, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function BrandPage() {
  const { toast } = useToast();
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const colors = [
    { name: 'Stellar Indigo', hex: '#6366F1', bg: 'bg-[#6366F1]', usage: 'Primary brand accent & active states' },
    { name: 'Galactic Purple', hex: '#8B5CF6', bg: 'bg-[#8B5CF6]', usage: 'Secondary gradients & rank badges' },
    { name: 'Cyan Pulse', hex: '#06B6D4', bg: 'bg-[#06B6D4]', usage: 'Highlight accents & quest rewards' },
    { name: 'Stellar Gold', hex: '#EAB308', bg: 'bg-[#EAB308]', usage: 'Trophy rank 1 & gold tier rewards' },
    { name: 'Deep Cosmos', hex: '#030712', bg: 'bg-[#030712]', usage: 'Dark theme background surface' },
    { name: 'Pure Slate', hex: '#F8FAFC', bg: 'bg-[#F8FAFC]', border: true, usage: 'Light theme card background' },
  ];

  const handleCopy = (hex: string, name: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    toast({
      title: 'Hex Copied!',
      description: `Copied ${name} (${hex}) to clipboard.`,
    });
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const downloadSVG = (path: string, filename: string) => {
    const link = document.createElement('a');
    link.href = path;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: 'Asset Downloaded',
      description: `Downloaded ${filename}`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Leaderboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            BuilderBoard Brand Assets & Media Kit
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 max-w-2xl text-sm md:text-base">
            Official logos, vector badges, color palettes, and brand guidelines for BuilderBoard on the Stellar Network.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => downloadSVG('/logo.svg', 'builderboard-logo.svg')}
            className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm px-4 py-2.5 shadow-md shadow-purple-500/20 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" /> Download Vector Pack
          </button>
        </div>
      </div>

      {/* Brand Logos Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Official Brand Logos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Light Theme Logo Card */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-gray-100 text-gray-800 uppercase tracking-wider">
                Primary Logo (Light Theme)
              </span>
              <p className="text-xs text-gray-500">For use on white or light backgrounds.</p>
            </div>
            <div className="p-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center min-h-[160px]">
              <img src="/logo.svg" alt="BuilderBoard Logo Light" className="h-16 w-auto object-contain" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-gray-500">public/logo.svg</span>
              <button
                onClick={() => downloadSVG('/logo.svg', 'builderboard-logo-light.svg')}
                className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
              >
                <Download className="w-3.5 h-3.5" /> SVG Vector
              </button>
            </div>
          </div>

          {/* Dark Theme Logo Card */}
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-gray-800 text-purple-300 uppercase tracking-wider">
                Primary Logo (Dark Theme)
              </span>
              <p className="text-xs text-gray-400">For use on dark, black or high-contrast backgrounds.</p>
            </div>
            <div className="p-8 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center min-h-[160px]">
              <img src="/logo-dark.svg" alt="BuilderBoard Logo Dark" className="h-16 w-auto object-contain" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-gray-400">public/logo-dark.svg</span>
              <button
                onClick={() => downloadSVG('/logo-dark.svg', 'builderboard-logo-dark.svg')}
                className="flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:underline"
              >
                <Download className="w-3.5 h-3.5" /> SVG Vector
              </button>
            </div>
          </div>
        </div>

        {/* Emblem & Icon Mark */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Icon Emblem</h3>
              <span className="text-xs text-gray-500 font-mono">SVG</span>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-900/10 to-indigo-900/10 dark:bg-gray-950 border border-purple-100 dark:border-gray-800 flex items-center justify-center">
              <img src="/logo-icon.svg" alt="BuilderBoard Emblem" className="w-20 h-20 object-contain" />
            </div>
            <button
              onClick={() => downloadSVG('/logo-icon.svg', 'builderboard-icon.svg')}
              className="w-full py-2 rounded-xl border border-purple-200 dark:border-purple-900/40 text-purple-600 dark:text-purple-400 text-xs font-bold hover:bg-purple-50 dark:hover:bg-purple-950/30 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Download Emblem SVG
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Builder Ecosystem Badge</h3>
              <span className="text-xs text-gray-500 font-mono">Embeddable Vector</span>
            </div>
            <div className="p-6 rounded-xl bg-gray-950 border border-gray-800 flex flex-col items-center justify-center gap-3">
              <img src="/brand/builderboard-badge.svg" alt="Built with BuilderBoard Badge" className="h-10 w-auto" />
              <p className="text-xs text-gray-400 text-center font-mono">
                &lt;img src="https://builderboard.stellar.org/brand/builderboard-badge.svg" alt="Built with BuilderBoard" /&gt;
              </p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => downloadSVG('/brand/builderboard-badge.svg', 'builderboard-badge.svg')}
                className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download Badge SVG
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Color Palette Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Brand Color Palette</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {colors.map((c) => (
            <div
              key={c.hex}
              onClick={() => handleCopy(c.hex, c.name)}
              className="group cursor-pointer rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className={`h-24 w-full ${c.bg} ${c.border ? 'border-b border-gray-200' : ''} flex items-end justify-end p-3`}>
                <span className="rounded-lg bg-black/40 backdrop-blur px-2.5 py-1 text-xs font-mono font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  {copiedHex === c.hex ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedHex === c.hex ? 'COPIED' : 'COPY'}
                </span>
              </div>
              <div className="p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">{c.name}</h3>
                  <span className="font-mono text-xs font-semibold text-purple-600 dark:text-purple-400">{c.hex}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{c.usage}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography & Brand Rules */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Typography & Typeface</h3>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800">
              <span className="text-xs font-mono text-gray-400">Primary Font Family</span>
              <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mt-1">Inter Display</p>
              <p className="text-xs text-gray-500 mt-1">Clean, modern geometric sans-serif tuned for web3 analytics and high-density leaderboards.</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-gray-600 dark:text-gray-300">
              <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">Black 900</span>
              <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">ExtraBold 800</span>
              <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">SemiBold 600</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Brand Usage Guidelines</h3>
          </div>
          <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5" />
              <span><strong>Maintain Clear Space:</strong> Keep minimum margin equal to the height of the emblem around all logos.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5" />
              <span><strong>Color Integrity:</strong> Do not stretch, recolor, or distort the gradient background of the BuilderBoard logo.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5" />
              <span><strong>Stellar Alliance:</strong> Always pair BuilderBoard branding with official Soroban / Stellar network badges when presenting bounties.</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
