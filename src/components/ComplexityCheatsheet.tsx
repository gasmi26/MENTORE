/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Calendar, Search, Sparkles, Zap, Shield, Database, Layout } from 'lucide-react';
import { motion } from 'motion/react';

interface StructureInfo {
  name: string;
  avgAccess: string;
  avgSearch: string;
  avgInsert: string;
  avgDelete: string;
  worstAccess: string;
  worstSearch: string;
  worstInsert: string;
  worstDelete: string;
  spaceComplexity: string;
}

const DATA_STRUCTURES: StructureInfo[] = [
  { name: 'Array / Vector', avgAccess: 'O(1)', avgSearch: 'O(N)', avgInsert: 'O(N)', avgDelete: 'O(N)', worstAccess: 'O(1)', worstSearch: 'O(N)', worstInsert: 'O(N)', worstDelete: 'O(N)', spaceComplexity: 'O(N)' },
  { name: 'Stack', avgAccess: 'O(N)', avgSearch: 'O(N)', avgInsert: 'O(1)', avgDelete: 'O(1)', worstAccess: 'O(N)', worstSearch: 'O(N)', worstInsert: 'O(1)', worstDelete: 'O(1)', spaceComplexity: 'O(N)' },
  { name: 'Queue', avgAccess: 'O(N)', avgSearch: 'O(N)', avgInsert: 'O(1)', avgDelete: 'O(1)', worstAccess: 'O(N)', worstSearch: 'O(N)', worstInsert: 'O(1)', worstDelete: 'O(1)', spaceComplexity: 'O(N)' },
  { name: 'Singly Linked List', avgAccess: 'O(N)', avgSearch: 'O(N)', avgInsert: 'O(1)', avgDelete: 'O(1)', worstAccess: 'O(N)', worstSearch: 'O(N)', worstInsert: 'O(1)', worstDelete: 'O(1)', spaceComplexity: 'O(N)' },
  { name: 'Hash Table', avgAccess: 'N/A', avgSearch: 'O(1)', avgInsert: 'O(1)', avgDelete: 'O(1)', worstAccess: 'N/A', worstSearch: 'O(N)', worstInsert: 'O(N)', worstDelete: 'O(N)', spaceComplexity: 'O(N)' },
  { name: 'Binary Search Tree (BST)', avgAccess: 'O(log N)', avgSearch: 'O(log N)', avgInsert: 'O(log N)', avgDelete: 'O(log N)', worstAccess: 'O(N)', worstSearch: 'O(N)', worstInsert: 'O(N)', worstDelete: 'O(N)', spaceComplexity: 'O(N)' },
  { name: 'AVL Tree (Balanced)', avgAccess: 'O(log N)', avgSearch: 'O(log N)', avgInsert: 'O(log N)', avgDelete: 'O(log N)', worstAccess: 'O(log N)', worstSearch: 'O(log N)', worstInsert: 'O(log N)', worstDelete: 'O(log N)', spaceComplexity: 'O(N)' },
];

export default function ComplexityCheatsheet() {
  const [hoveredComplexity, setHoveredComplexity] = useState<string | null>(null);

  // SVG dimensions for Big O visualizer graph
  const width = 500;
  const height = 300;
  const padding = 40;

  // Generate curves
  const getPoints = (type: string) => {
    const points: [number, number][] = [];
    const step = 5;
    for (let x = 1; x <= 100; x += step) {
      let y = 0;
      const xPct = x / 100;
      switch (type) {
        case 'O(1)':
          y = 15; // constant low line
          break;
        case 'O(log N)':
          y = Math.log2(x + 1) * 12;
          break;
        case 'O(N)':
          y = xPct * (height - 3 * padding);
          break;
        case 'O(N log N)':
          y = xPct * Math.log2(x + 1) * 32;
          break;
        case 'O(N^2)':
          y = Math.pow(xPct, 2) * (height - padding * 2.5);
          break;
      }
      // transform math coordinates to SVG viewport coordinates
      const svgX = padding + (x / 100) * (width - 2 * padding);
      const svgY = height - padding - y;
      points.push([svgX, Math.max(padding / 2, svgY)]);
    }
    return points.map(([px, py]) => `${px},${py}`).join(' ');
  };

  const complexities = [
    { label: 'O(1)', color: '#6366f1', text: 'Constant - Speed stays the same regardless of data size. Excellent!', desc: 'Examples: Array indexing, push/pop on stack, hashmap lookups (average).' },
    { label: 'O(log N)', color: '#0d9488', text: 'Logarithmic - Problem size halves each step. Superior structure speed!', desc: 'Examples: Binary Search, searching in balanced BSTs.' },
    { label: 'O(N)', color: '#d97706', text: 'Linear - Runs proportional to elements count. Standard scanning speed.', desc: 'Examples: Single loop search, array copy, reversing list.' },
    { label: 'O(N log N)', color: '#ea580c', text: 'Linearithmic - Logarithmic work nested inside linear. Solid Sorting speed.', desc: 'Examples: Merge Sort, Quick Sort (average), Heap Sort.' },
    { label: 'O(N^2)', color: '#dc2626', text: 'Quadratic - Work scales exponentially with nested iterations. Avoid for large N.', desc: 'Examples: Double nested loops, bubble sort, insertion sort.' },
  ];

  return (
    <div className="space-y-8">
      {/* Intro section */}
      <div className="bg-[#0c0c0e] border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 scale-150 text-slate-800/10 pointer-events-none">
          <Zap size={140} />
        </div>
        <div className="relative z-10 space-y-2">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-100">
            <Zap className="text-amber-500" size={20} />
            Understanding Algorithmic Efficiency (Big O)
          </h2>
          <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
            Big O Notation measures the rate of growth of an algorithm's execution time or storage requirement as the input dataset size (<code className="text-indigo-400 font-bold font-mono">N</code>) increases. It describes worst-case guarantees.
          </p>
        </div>
      </div>

      {/* Grid Layout containing Interactive Graph and Explanation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive SVG Chart */}
        <div className="lg:col-span-7 bg-[#0c0c0e] border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
              Growth Complexity Chart Comparison
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Hover over names in the sidebar or check out how curves diverge over large input scales (<code className="text-slate-335">N</code>).
            </p>
          </div>

          <div className="bg-[#09090b] border border-[#1d1d20] rounded-lg p-2 flex items-center justify-center">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full max-w-lg aspect-[5/3] overflow-visible animate-fade-in"
            >
              {/* Grid Lines */}
              <line x1={padding} y1={height - padding} x2={width - padding / 2} y2={height - padding} stroke="#27272a" strokeWidth={1.5} />
              <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#27272a" strokeWidth={1.5} />

              {[0.25, 0.5, 0.75, 1.0].map((tick, i) => {
                const xVal = padding + tick * (width - 1.5 * padding);
                const yVal = height - padding - tick * (height - 2 * padding);
                return (
                  <g key={i} className="opacity-30">
                    <line x1={xVal} y1={height - padding} x2={xVal} y2={padding} stroke="#3f3f46" strokeDasharray="3,3" />
                    <line x1={padding} y1={yVal} x2={width - padding / 2} y2={yVal} stroke="#3f3f46" strokeDasharray="3,3" />
                  </g>
                );
              })}

              {/* Curve Drawing */}
              {complexities.map((c) => {
                const isHovered = hoveredComplexity === c.label;
                const isAnyHovered = hoveredComplexity !== null;
                return (
                  <polyline
                    key={c.label}
                    fill="none"
                    stroke={c.color}
                    strokeWidth={isHovered ? 4 : isAnyHovered ? 1.5 : 2.5}
                    strokeOpacity={isHovered ? 1.0 : isAnyHovered ? 0.3 : 0.85}
                    points={getPoints(c.label)}
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredComplexity(c.label)}
                    onMouseLeave={() => setHoveredComplexity(null)}
                  />
                );
              })}

              {/* Labels for graph directions */}
              <text x={padding + 10} y={padding + 10} fill="#52525b" className="text-[10px] font-mono select-none">Time Complexity (t)</text>
              <text x={width - 100} y={height - padding + 15} fill="#52525b" className="text-[10px] font-mono select-none">Input Size (N) ➔</text>
            </svg>
          </div>

          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {complexities.map((c) => (
              <button
                key={c.label}
                onMouseEnter={() => setHoveredComplexity(c.label)}
                onMouseLeave={() => setHoveredComplexity(null)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-medium flex items-center gap-1.5 transition-all outline-none ${
                  hoveredComplexity === c.label
                    ? 'bg-slate-850 text-indigo-400 border border-slate-700/80'
                    : 'bg-[#09090b] text-slate-400 hover:text-slate-300 border border-slate-800'
                }`}
                style={{ borderLeft: `3px solid ${c.color}` }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Informative Side-list */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {complexities.map((c) => (
            <motion.div
              layout
              key={c.label}
              onMouseEnter={() => setHoveredComplexity(c.label)}
              onMouseLeave={() => setHoveredComplexity(null)}
              className={`p-4 rounded-xl border transition-all duration-200 cursor-default ${
                hoveredComplexity === c.label
                  ? 'bg-slate-850/60 border-slate-700 shadow-md scale-[1.01]'
                  : 'bg-[#0c0c0e] border-slate-850'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="px-2 py-0.5 rounded text-xs font-mono font-bold text-white shadow-sm"
                  style={{ backgroundColor: c.color }}
                >
                  {c.label}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {c.label === 'O(1)' || c.label === 'O(log N)' ? 'Excellent' : c.label === 'O(N)' ? 'Fair' : 'Inefficient'}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-200">{c.text}</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Standard complexity tables */}
      <div className="bg-[#0c0c0e] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 bg-[#09090b] border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Database size={16} className="text-indigo-400" />
            Common Data Structure Operation Complexities
          </h3>
          <span className="text-xs text-slate-500 font-mono">Worst-case is often the limiting factor</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0c0c0e] border-b border-slate-800 text-slate-400 font-semibold select-none">
                <th className="p-4">Data Structure</th>
                <th className="p-4 text-center">Avg Access</th>
                <th className="p-4 text-center">Avg Search</th>
                <th className="p-4 text-center">Avg Insert</th>
                <th className="p-4 text-center">Avg Delete</th>
                <th className="p-4 text-center text-rose-400">Worst Search</th>
                <th className="p-4 text-center text-rose-400">Worst Insert</th>
                <th className="p-4 text-center">Space Complexity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-805 font-mono">
              {DATA_STRUCTURES.map((ds, idx) => (
                <tr key={idx} className="hover:bg-slate-850/40 text-slate-300">
                  <td className="p-4 font-sans font-medium text-slate-100">{ds.name}</td>
                  <td className="p-4 text-center text-indigo-300">{ds.avgAccess}</td>
                  <td className="p-4 text-center text-teal-300">{ds.avgSearch}</td>
                  <td className="p-4 text-center text-amber-300">{ds.avgInsert}</td>
                  <td className="p-4 text-center text-amber-300">{ds.avgDelete}</td>
                  <td className="p-4 text-center text-orange-400">{ds.worstSearch}</td>
                  <td className="p-4 text-center text-orange-400">{ds.worstInsert}</td>
                  <td className="p-4 text-center text-slate-500">{ds.spaceComplexity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
