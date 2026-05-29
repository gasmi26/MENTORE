/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { useState } from 'react';
import { MessageSquare, Sliders, Award, Zap, Library, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ChatInstructor from './components/ChatInstructor';
import ProblemSolver from './components/ProblemSolver';
import VisualizerSandbox from './components/VisualizerSandbox';
import ComplexityCheatsheet from './components/ComplexityCheatsheet';

type ViewMode = 'instructor' | 'solver' | 'sandbox' | 'cheatsheet';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('instructor');

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-200 flex flex-col justify-start selection:bg-indigo-600/30 selection:text-white">
      {/* Absolute top subtle ambient gradient glowing background */}
      <div className="absolute top-0 left-1/4 right-1/4 h-80 bg-gradient-to-b from-indigo-900/10 via-zinc-950/5 to-transparent blur-3xl pointer-events-none select-none" />

      {/* Header component */}
      <header className="relative z-10 border-b border-slate-800 bg-[#0c0c0e]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-950/40">
              <Zap size={20} className="text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-base font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                DSA AI Instructor Workspace
              </h1>
              <span className="text-[9.5px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1">
                Google Gemini Model Core <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              </span>
            </div>
          </div>

          {/* Core Tab items Selector */}
          <nav className="flex flex-wrap bg-[#070708] border border-slate-800 p-1 rounded-xl gap-1">
            {([
              { key: 'instructor', label: 'AI Chat Tutor', icon: <MessageSquare size={13} /> },
              { key: 'solver', label: 'Step Solver', icon: <Award size={13} /> },
              { key: 'sandbox', label: 'Playground Trace', icon: <Sliders size={13} /> },
              { key: 'cheatsheet', label: 'Big O Guide', icon: <Library size={13} /> }
            ] as const).map((tab) => {
              const isActive = currentView === tab.key;
              return (
                <button
                  key={tab.key}
                  id={`tab-btn-${tab.key}`}
                  onClick={() => setCurrentView(tab.key)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all select-none ${
                    isActive
                      ? 'bg-slate-800/60 text-indigo-400 shadow-sm border border-slate-700/80 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main stage viewport */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="w-full h-full"
          >
            {currentView === 'instructor' && <ChatInstructor />}
            {currentView === 'solver' && <ProblemSolver />}
            {currentView === 'sandbox' && <VisualizerSandbox />}
            {currentView === 'cheatsheet' && <ComplexityCheatsheet />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Subtle compact human footer */}
      <footer className="relative z-10 border-t border-slate-950 bg-slate-950/20 py-4 px-6 text-center text-[10px] font-mono text-slate-600 select-none">
        DSA AI Class Workspace // Space-Slate Interactive Dark Theme v1.0
      </footer>
    </div>
  );
}
