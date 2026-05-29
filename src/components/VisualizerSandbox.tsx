/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronRight, RotateCcw, Plus, Minus, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type SandboxMode = 'bubble-sort' | 'binary-search' | 'stack-queue' | 'bst';

interface TreeNode {
  val: number;
  x: number;
  y: number;
  left?: number;
  right?: number;
}

export default function VisualizerSandbox() {
  const [activeTab, setActiveTab] = useState<SandboxMode>('bubble-sort');

  return (
    <div className="space-y-6">
      {/* Tab Selectors */}
      <div className="flex border-b border-slate-800 bg-[#0c0c0e] p-1.5 rounded-xl gap-2 overflow-x-auto">
        {(['bubble-sort', 'binary-search', 'stack-queue', 'bst'] as const).map((tab) => {
          const displayNames: Record<SandboxMode, string> = {
            'bubble-sort': 'Sorting Animations',
            'binary-search': 'Binary Search Trace',
            'stack-queue': 'Stack & Queue Sandbox',
            'bst': 'BST Multi-Tree Operator'
          };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex-shrink-0 ${
                activeTab === tab
                  ? 'bg-slate-850 text-indigo-400 shadow-sm border border-slate-700/80 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {displayNames[tab]}
            </button>
          );
        })}
      </div>

      <div className="bg-[#0c0c0e] border border-slate-800 rounded-xl p-6 shadow-xl min-h-[500px] flex flex-col justify-between">
        {activeTab === 'bubble-sort' && <BubbleSortVisualizer />}
        {activeTab === 'binary-search' && <BinarySearchVisualizer />}
        {activeTab === 'stack-queue' && <StackQueueVisualizer />}
        {activeTab === 'bst' && <BSTVisualizer />}
      </div>
    </div>
  );
}

/* ==========================================
   1. BUBBLE SORT VISUALIZER
   ========================================== */
function BubbleSortVisualizer() {
  const [array, setArray] = useState<number[]>([45, 90, 15, 60, 30, 75, 5, 55, 20, 80]);
  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [speed, setSpeed] = useState<number>(300); // ms
  const [stepCount, setStepCount] = useState(0);
  const sortingRef = useRef<boolean>(false);

  const resetArray = () => {
    setIsSorting(false);
    sortingRef.current = false;
    setArray(Array.from({ length: 10 }, () => Math.floor(Math.random() * 90) + 10));
    setComparing([]);
    setSwapping([]);
    setSortedIndices([]);
    setStepCount(0);
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const startBubbleSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    sortingRef.current = true;

    const arr = [...array];
    const n = arr.length;
    let localSorted: number[] = [];

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (!sortingRef.current) return;

        setComparing([j, j + 1]);
        setStepCount((prev) => prev + 1);
        await delay(speed);

        if (arr[j] > arr[j + 1]) {
          setSwapping([j, j + 1]);
          // swap
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]);
          await delay(speed);
        }
        setSwapping([]);
      }
      localSorted.push(n - i - 1);
      setSortedIndices([...localSorted]);
    }
    setSortedIndices(Array.from({ length: n }, (_, i) => i));
    setComparing([]);
    setIsSorting(false);
    sortingRef.current = false;
  };

  const stopSorting = () => {
    setIsSorting(false);
    sortingRef.current = false;
  };

  return (
    <div className="space-y-6 flex-1 flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-semibold text-slate-200">Sorting Visualizer (Bubble Sort)</h3>
        <p className="text-xs text-slate-400 mt-1">
          Visualizes bubble sort algorithm comparing adjacent values. Time Complexity: <code className="text-rose-400 font-mono">O(N²)</code>, Space Complexity: <code className="text-emerald-400 font-mono">O(1)</code>.
        </p>
      </div>

      {/* Render bars */}
      <div className="flex h-64 items-end justify-center gap-2 px-4 border border-slate-800 bg-[#09090b] rounded-lg py-6 relative">
        <div className="absolute top-4 left-4 text-xs font-mono text-slate-550 select-none">
          Steps Counter: {stepCount}
        </div>
        {array.map((val, idx) => {
          let bgColor = 'bg-zinc-800'; // Default
          if (comparing.includes(idx)) bgColor = 'bg-indigo-500'; // Comparing
          if (swapping.includes(idx)) bgColor = 'bg-rose-500'; // Swapping
          if (sortedIndices.includes(idx)) bgColor = 'bg-emerald-500'; // Sorted

          return (
            <div key={idx} className="flex flex-col items-center flex-1 max-w-[40px]">
              <span className="text-[10px] font-mono text-slate-500 mb-1.5">{val}</span>
              <motion.div
                layout
                style={{ height: `${val * 2}px` }}
                className={`w-full rounded-t-md transition-colors duration-200 ${bgColor}`}
              />
              <span className="text-[10px] font-mono text-slate-500 mt-1 select-none">{idx}</span>
            </div>
          );
        })}
      </div>

      {/* Speed Slider & Control Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-4">
        <div className="flex items-center gap-4">
          <label className="text-xs text-slate-400 select-none">
            Speed ({speed}ms):
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="ml-2 accent-indigo-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
          </label>
        </div>

        <div className="flex gap-2">
          {isSorting ? (
            <button
              onClick={stopSorting}
              className="px-4 py-2 bg-[#09090b] border border-slate-800 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Pause size={14} /> Halt
            </button>
          ) : (
            <button
              onClick={startBubbleSort}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-950/20"
            >
              <Play size={14} /> Start Sort
            </button>
          )}

          <button
            onClick={resetArray}
            className="px-4 py-2 bg-[#09090b] border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   2. BINARY SEARCH VISUALIZER
   ========================================== */
function BinarySearchVisualizer() {
  const sortedArray = [12, 18, 24, 30, 37, 45, 52, 63, 71, 80, 88, 95];
  const [target, setTarget] = useState<number>(45);
  const [low, setLow] = useState<number>(0);
  const [high, setHigh] = useState<number>(sortedArray.length - 1);
  const [mid, setMid] = useState<number | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [stepLog, setStepLog] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const resetSearch = () => {
    setLow(0);
    setHigh(sortedArray.length - 1);
    setMid(null);
    setFoundIndex(null);
    setNotFound(false);
    setStepLog([]);
    setIsSearching(false);
  };

  const nextStep = () => {
    if (foundIndex !== null || notFound) return;
    setIsSearching(true);

    if (low > high) {
      setNotFound(true);
      setStepLog((prev) => [...prev, `Search complete: Low (${low}) > High (${high}). Target ${target} not found.`]);
      return;
    }

    const currentMid = Math.floor((low + high) / 2);
    setMid(currentMid);
    const midVal = sortedArray[currentMid];

    if (midVal === target) {
      setFoundIndex(currentMid);
      setStepLog((prev) => [...prev, `Split trace: Mid element index ${currentMid} (${midVal}) matches target ${target}! Found!`]);
    } else if (midVal < target) {
      setStepLog((prev) => [
        ...prev,
        `Index ${currentMid} value (${midVal}) is < Target (${target}). Slide low bounds to mid + 1 (${currentMid + 1}).`
      ]);
      setLow(currentMid + 1);
    } else {
      setStepLog((prev) => [
        ...prev,
        `Index ${currentMid} value (${midVal}) is > Target (${target}). Slide high bounds to mid - 1 (${currentMid - 1}).`
      ]);
      setHigh(currentMid - 1);
    }
  };

  return (
    <div className="space-y-6 flex-1 flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-semibold text-slate-200">Binary Search Trace Visualizer</h3>
        <p className="text-xs text-slate-400 mt-1">
          Displays search limits inside sorted arrays. Highlights the halving mechanics of <code className="text-emerald-400 font-mono">O(log N)</code> recursion.
        </p>
      </div>

      {/* Target input */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400">Choose Target:</span>
        <div className="flex gap-1.5 flex-wrap">
          {[12, 30, 45, 63, 80, 95, 55].map((val) => (
            <button
              key={val}
              onClick={() => {
                setTarget(val);
                resetSearch();
              }}
              disabled={isSearching}
              className={`px-2.5 py-1 text-xs rounded border transition-all ${
                target === val
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-[#09090b] text-slate-400 border-slate-850 hover:text-slate-200'
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      {/* Trace Block Boxes */}
      <div className="flex flex-wrap gap-2 justify-center py-6 px-4 bg-[#09090b] rounded-lg border border-slate-800">
        {sortedArray.map((val, idx) => {
          const isDiscarded = idx < low || idx > high;
          const isMid = mid === idx;
          const isFound = foundIndex === idx;

          let blockStyles = 'bg-slate-800/60 border-slate-700 text-slate-200';
          if (isDiscarded) blockStyles = 'bg-[#09090b]/80 border-slate-900/40 text-slate-600 opacity-20';
          else if (isFound) blockStyles = 'bg-emerald-600 border-emerald-500 text-white shadow-lg font-bold scale-105';
          else if (isMid) blockStyles = 'bg-amber-600 border-amber-500 text-white font-semibold';

          return (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-[9px] font-mono text-slate-500 mb-1">
                {idx === low && 'Low'}
                {idx === high && idx !== low && 'High'}
              </span>
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-lg border text-sm font-mono transition-all duration-300 ${blockStyles}`}
              >
                {val}
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-1">
                {isMid ? 'Mid' : `#${idx}`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Console log list */}
      <div className="bg-[#09090b] border border-slate-800 rounded-lg p-3 h-24 overflow-y-auto text-xs font-mono text-slate-400 space-y-1">
        {stepLog.length === 0 ? (
          <p className="text-slate-650 select-none">Console ready. Click "Execute Step" to trace binary search bounds.</p>
        ) : (
          stepLog.map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-indigo-400">[Step {i + 1}]</span>
              <span>{log}</span>
            </div>
          ))
        )}
      </div>

      {/* Control Actions */}
      <div className="flex gap-2 justify-end border-t border-slate-800/80 pt-4">
        <button
          onClick={nextStep}
          disabled={foundIndex !== null || notFound}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
        >
          Execute Step <ChevronRight size={14} />
        </button>

        <button
          onClick={resetSearch}
          className="px-4 py-2 bg-[#09090b] border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>
    </div>
  );
}

/* ==========================================
   3. STACK AND QUEUE VISUALIZER
   ========================================== */
function StackQueueVisualizer() {
  const [structure, setStructure] = useState<'stack' | 'queue'>('stack');
  const [items, setItems] = useState<number[]>([10, 20, 30]);

  const popOrDequeue = () => {
    if (items.length === 0) return;
    if (structure === 'stack') {
      // Stack is LIFO: takes from top (end of array)
      setItems((prev) => prev.slice(0, -1));
    } else {
      // Queue is FIFO: takes from front (start of array)
      setItems((prev) => prev.slice(1));
    }
  };

  const pushOrEnqueue = () => {
    if (items.length >= 8) return; // Limit size for visual constraints
    const val = (items.length + 1) * 10;
    setItems((prev) => [...prev, val]);
  };

  return (
    <div className="space-y-6 flex-1 flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          Stack & Queue Simulator
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Compares **LIFO** (Last In, First Out) vertical stack controls against **FIFO** (First In, First Out) horizontal conveyor pipelines.
        </p>
      </div>

      {/* Toggle stack vs queue */}
      <div className="flex bg-[#09090b] p-1 rounded-lg self-start border border-slate-800 text-xs select-none">
        <button
          onClick={() => {
            setStructure('stack');
            setItems([10, 20, 30]);
          }}
          className={`px-3 py-1.5 rounded-md font-medium transition-all ${
            structure === 'stack' ? 'bg-slate-800/80 text-indigo-400 border border-slate-700/50 shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Stack (LIFO)
        </button>
        <button
          onClick={() => {
            setStructure('queue');
            setItems([10, 20, 30]);
          }}
          className={`px-3 py-1.5 rounded-md font-medium transition-all ${
            structure === 'queue' ? 'bg-slate-800/80 text-indigo-400 border border-slate-700/50 shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Queue (FIFO)
        </button>
      </div>

      {/* Dynamic interactive stage */}
      <div className="flex-1 flex items-center justify-center min-h-[220px]">
        {structure === 'stack' ? (
          /* Stack Container Layout */
          <div className="relative border-x-4 border-b-4 border-slate-700 rounded-b-xl w-36 h-48 flex flex-col justify-end p-2 gap-1.5 bg-[#09090b]/40">
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-500">Stack Top</span>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-500">Stack Base</span>
            <AnimatePresence>
              {[...items].reverse().map((item, idx) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-mono py-2 rounded border border-indigo-500/40 text-center relative font-semibold"
                >
                  Val: {item}
                  {idx === 0 && (
                    <span className="absolute -right-12 top-1/2 -translate-y-1/2 bg-indigo-950 flex items-center gap-0.5 text-[8px] font-semibold text-indigo-400 border border-indigo-900/50 px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                      Top
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {items.length === 0 && (
              <span className="text-xs text-slate-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center select-none">
                Stack Empty
              </span>
            )}
          </div>
        ) : (
          /* Queue Container Layout */
          <div className="flex flex-col items-center gap-2">
            <div className="relative flex items-center border-y-4 border-slate-705 w-96 h-20 p-2 gap-2 bg-[#09090b]/40 rounded-md">
              <span className="absolute -left-12 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 text-right">FIFO Out<br/>(Front)</span>
              <span className="absolute -right-12 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500">FIFO In<br/>(Back)</span>
              <AnimatePresence>
                {items.map((item, idx) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 bg-teal-600/90 hover:bg-teal-650 text-white text-xs font-mono h-12 flex flex-col items-center justify-center rounded border border-teal-500/45 text-center relative font-semibold"
                  >
                    <span>{item}</span>
                    <span className="text-[8px] opacity-75">
                      {idx === 0 ? 'Front' : idx === items.length - 1 ? 'Back' : `Pos {idx}`}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {items.length === 0 && (
                <span className="text-xs text-slate-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center select-none">
                  Queue Empty
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Push/Pop triggers */}
      <div className="flex gap-2 justify-end border-t border-slate-800/85 pt-4">
        <button
          onClick={pushOrEnqueue}
          disabled={items.length >= 8}
          className="px-4 py-2 bg-slate-800/60 border border-slate-750 hover:bg-slate-850 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
        >
          <Plus size={14} /> {structure === 'stack' ? 'Push Item' : 'Enqueue Item'}
        </button>

        <button
          onClick={popOrDequeue}
          disabled={items.length === 0}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:hover:bg-rose-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
        >
          <Minus size={14} /> {structure === 'stack' ? 'Pop (LIFO)' : 'Dequeue (FIFO)'}
        </button>
      </div>
    </div>
  );
}

/* ==========================================
   4. BINARY SEARCH TREE (BST) VISUALIZER
   ========================================== */
function BSTVisualizer() {
  // Pre-configured elegant SVG Tree layout
  const [tree, setTree] = useState<Record<number, TreeNode>>({
    50: { val: 50, x: 250, y: 30, left: 30, right: 70 },
    30: { val: 30, x: 130, y: 90, left: 15, right: 40 },
    70: { val: 70, x: 370, y: 90, left: 60, right: 90 },
    15: { val: 15, x: 70, y: 150 },
    40: { val: 40, x: 190, y: 150 },
    60: { val: 60, x: 310, y: 150 },
    90: { val: 90, x: 430, y: 150 },
  });

  const [searchVal, setSearchVal] = useState<number>(40);
  const [visPath, setVisPath] = useState<number[]>([]);
  const [currNode, setCurrNode] = useState<number | null>(null);
  const [matchNode, setMatchNode] = useState<number | null>(null);
  const [searchOutput, setSearchOutput] = useState<string>('');
  const [isSearchingTree, setIsSearchingTree] = useState(false);

  const resetBST = () => {
    setVisPath([]);
    setCurrNode(null);
    setMatchNode(null);
    setSearchOutput('');
    setIsSearchingTree(false);
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const startBSTSearch = async () => {
    if (isSearchingTree) return;
    setIsSearchingTree(true);

    setVisPath([]);
    setCurrNode(50);
    setMatchNode(null);
    setSearchOutput('BST Search Starting at Root (50)');
    await delay(1000);

    let currKey = 50;
    const path: number[] = [50];

    while (currKey !== undefined) {
      setVisPath([...path]);
      setCurrNode(currKey);

      if (currKey === searchVal) {
        setMatchNode(currKey);
        setSearchOutput(`Target ${searchVal} matches current node (${currKey})! Match found!`);
        setIsSearchingTree(false);
        return;
      }

      if (searchVal < currKey) {
        const leftNodeKey = tree[currKey]?.left;
        if (leftNodeKey !== undefined) {
          setSearchOutput(`Since Target ${searchVal} < ${currKey}, traverse LEFT to ${leftNodeKey}`);
          await delay(1200);
          currKey = leftNodeKey;
          path.push(leftNodeKey);
        } else {
          setSearchOutput(`Since Target ${searchVal} < ${currKey}, but left is empty, Target does not exist in BST. Code: return null`);
          currKey = undefined as any;
        }
      } else {
        const rightNodeKey = tree[currKey]?.right;
        if (rightNodeKey !== undefined) {
          setSearchOutput(`Since Target ${searchVal} > ${currKey}, traverse RIGHT to ${rightNodeKey}`);
          await delay(1200);
          currKey = rightNodeKey;
          path.push(rightNodeKey);
        } else {
          setSearchOutput(`Since Target ${searchVal} > ${currKey}, but right is empty, Target does not exist in BST. Code: return null`);
          currKey = undefined as any;
        }
      }
    }

    setCurrNode(null);
    setIsSearchingTree(false);
  };

  return (
    <div className="space-y-6 flex-1 flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-semibold text-slate-200">BST Tree Tracing Operator</h3>
        <p className="text-xs text-slate-400 mt-1">
          Demonstrates spatial search routing in a Binary Search Tree. Time Complexity: <code className="text-emerald-400 font-mono">O(log N)</code> average case.
        </p>
      </div>

      {/* Target input select */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400">Search TargetNode:</span>
        <div className="flex gap-1.5 flex-wrap">
          {[15, 30, 40, 50, 60, 70, 90, 85].map((val) => (
            <button
              key={val}
              onClick={() => {
                setSearchVal(val);
                resetBST();
              }}
              disabled={isSearchingTree}
              className={`px-2 py-0.5 text-xs rounded border transition-all font-mono ${
                searchVal === val
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-[#09090b] text-slate-400 border-slate-805 hover:text-slate-200'
              }`}
            >
              Node({val})
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas depicting tree branches and nodes */}
      <div className="bg-[#09090b] border border-slate-800 rounded-lg p-2 overflow-x-auto flex items-center justify-center min-h-[190px]">
        <svg width="500" height="190" className="max-w-md aspect-[5/1.9] overflow-visible select-none">
          {/* Connector lines behind nodes */}
          {Object.values(tree).map((node) => {
            return (
              <g key={`lines-${node.val}`}>
                {node.left && tree[node.left] && (
                  <line
                    x1={node.x}
                    y1={node.y}
                    x2={tree[node.left].x}
                    y2={tree[node.left].y}
                    stroke={
                      visPath.includes(node.val) && visPath.includes(node.left)
                        ? '#6366f1'
                        : '#27272a'
                    }
                    strokeWidth={visPath.includes(node.val) && visPath.includes(node.left) ? 3 : 1.5}
                    className="transition-colors duration-300"
                  />
                )}
                {node.right && tree[node.right] && (
                  <line
                    x1={node.x}
                    y1={node.y}
                    x2={tree[node.right].x}
                    y2={tree[node.right].y}
                    stroke={
                      visPath.includes(node.val) && visPath.includes(node.right)
                        ? '#6366f1'
                        : '#27272a'
                    }
                    strokeWidth={visPath.includes(node.val) && visPath.includes(node.right) ? 3 : 1.5}
                    className="transition-colors duration-300"
                  />
                )}
              </g>
            );
          })}

          {/* Render Nodes */}
          {Object.values(tree).map((node) => {
            const isPath = visPath.includes(node.val);
            const isCurr = currNode === node.val;
            const isMatch = matchNode === node.val;

            let circleFill = '#09090b';
            let strokeColor = '#27272a';
            let textFill = '#71717a';

            if (isMatch) {
              circleFill = '#064e3b';
              strokeColor = '#10b981';
              textFill = '#ffffff';
            } else if (isCurr) {
              circleFill = '#78350f';
              strokeColor = '#fbbf24';
              textFill = '#ffffff';
            } else if (isPath) {
              circleFill = '#1e1b4b';
              strokeColor = '#6366f1';
              textFill = '#e0e7ff';
            }

            return (
              <g key={`node-${node.val}`} className={`cursor-default ${isCurr ? 'animate-node-pulse' : ''} transition-all duration-300`}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={18}
                  fill={circleFill}
                  stroke={strokeColor}
                  strokeWidth={2}
                />
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fill={textFill}
                  className="text-[11px] font-bold font-mono"
                >
                  {node.val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Execution Tracker Output Console */}
      <div className="bg-[#09090b] border border-[#1e1e20] rounded-lg p-3 h-16 flex items-center justify-center text-center text-xs font-mono text-slate-300">
        {searchOutput || 'Console ready. Select a target and press Trace Search.'}
      </div>

      {/* Control Actions */}
      <div className="flex gap-2 justify-end border-t border-slate-800/85 pt-4">
        <button
          onClick={startBSTSearch}
          disabled={isSearchingTree}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-950/20"
        >
          <Play size={14} /> Trace Search
        </button>

        <button
          onClick={resetBST}
          className="px-4 py-2 bg-[#09090b] border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>
    </div>
  );
}
