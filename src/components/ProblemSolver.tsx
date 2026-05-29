/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { HelpCircle, Sparkles, BookOpen, Clock, Code2, Play, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { DSA_PROBLEMS } from '../data/problems';
import { DSAProblem, SolverStep } from '../types';

export default function ProblemSolver() {
  const [selectedProblem, setSelectedProblem] = useState<DSAProblem>(DSA_PROBLEMS[0]);
  const [language, setLanguage] = useState<'javascript' | 'python' | 'typescript' | 'cpp' | 'java'>('javascript');
  const [activeStep, setActiveStep] = useState<SolverStep>('brainstorm');

  // Step answers cache
  const [stepResponses, setStepResponses] = useState<Record<string, Record<SolverStep, string>>>({});
  const [loadingSteps, setLoadingSteps] = useState<Record<SolverStep, boolean>>({
    brainstorm: false,
    complexity: false,
    pseudocode: false,
    solution: false
  });
  const [errorText, setErrorText] = useState<string | null>(null);

  // Custom user parameters
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');

  // Handle preset problem changes
  const handleProblemChange = (problem: DSAProblem) => {
    setSelectedProblem(problem);
    setIsCustomMode(false);
    setErrorText(null);
  };

  const loadCustomProblem = () => {
    if (!customTitle.trim() || !customDesc.trim()) return;
    const customProblem: DSAProblem = {
      id: 'custom-' + Math.random().toString(36).substring(2, 6),
      title: customTitle,
      difficulty: 'Medium',
      category: 'Arrays & Hashing',
      description: customDesc,
      examples: [],
      starters: {
        javascript: '// Start coding here\n',
        python: '# Start coding here\n',
        typescript: '// Start coding here\n',
        cpp: '// Start coding here\n',
        java: '// Start coding here\n'
      }
    };
    setSelectedProblem(customProblem);
  };

  const triggerStepQuery = async (step: SolverStep) => {
    const probId = selectedProblem.id;
    // Set loading
    setLoadingSteps((prev) => ({ ...prev, [step]: true }));
    setErrorText(null);

    // Initial message context
    const introPromptMap: Record<SolverStep, string> = {
      brainstorm: `Tutor, I want help brainstorming and visualizing input base cases and edge cases for "${selectedProblem.title}". Please ask me guiding questions to build a working recursion base or dictionary layout.`,
      complexity: `Tutor, please analyze the Time and Space Complexity comparison profiles for "${selectedProblem.title}". Break down why optimal is better than bruteforce.`,
      pseudocode: `Tutor, please outline high-level language-agnostic pseudocode for "${selectedProblem.title}" and carry out a manual tracing dry-run with a small mock array.`,
      solution: `Tutor, please write and explain the optimal code implementation in ${language.toUpperCase()} for "${selectedProblem.title}".`
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentStep: step,
          problemContext: selectedProblem,
          messages: [{ role: 'user', text: introPromptMap[step] }]
        })
      });

      if (!response.ok) {
        throw new Error('Tutor backend responded with error.');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setStepResponses((prev) => ({
        ...prev,
        [probId]: {
          ...prev[probId],
          [step]: data.text || 'Tutor session failed to write response.'
        }
      }));
    } catch (err: any) {
      console.error(err);
      setErrorText(`Error: ${err.message || 'Connecting to backend tutor failed'}`);
    } finally {
      setLoadingSteps((prev) => ({ ...prev, [step]: false }));
    }
  };

  const probId = selectedProblem.id;
  const currentSavedText = stepResponses[probId]?.[activeStep] || '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* List / Selection panel sidebar - spans 4 cols */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-[#0c0c0e] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest select-none">
            Choose Challenge Problems
          </h3>

          <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
            {DSA_PROBLEMS.map((prob) => {
              const diffColors: Record<string, string> = {
                Easy: 'text-emerald-400 border-emerald-950/40 bg-emerald-950/15',
                Medium: 'text-amber-400 border-amber-950/40 bg-amber-950/15',
                Hard: 'text-rose-400 border-rose-950/40 bg-rose-950/15'
              };
              const isSelected = selectedProblem.id === prob.id;

              return (
                <button
                  key={prob.id}
                  onClick={() => handleProblemChange(prob)}
                  className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all select-none border ${
                    isSelected
                      ? 'bg-slate-800/40 border-indigo-500/50 text-indigo-400 shadow shadow-indigo-950/50 border-l-2'
                      : 'bg-[#070708] border-slate-800/80 hover:border-slate-750'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{prob.title}</h4>
                    <span className="text-[10px] text-slate-500">{prob.category}</span>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${diffColors[prob.difficulty]}`}>
                    {prob.difficulty}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-800 pt-3.5 space-y-3.5">
            <h4 className="text-xs font-semibold text-slate-400">Paste Your Own Custom Problem</h4>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Problem Title"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full bg-[#09090b] border border-slate-750 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-650 outline-none focus:border-indigo-500 transition-colors"
              />
              <textarea
                placeholder="Paste your LeetCode markdown description..."
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                rows={3}
                className="w-full bg-[#09090b] border border-slate-750 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-650 outline-none focus:border-indigo-500 transition-colors resize-none h-20"
              />
              <button
                onClick={loadCustomProblem}
                disabled={!customTitle.trim() || !customDesc.trim()}
                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-all"
              >
                Assemble Workspace
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main step guidance sector - spans 8 cols */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        {/* Active Problem metadata */}
        <div className="bg-[#0c0c0e] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <span className="text-[10px] uppercase font-mono text-indigo-400 font-semibold tracking-wider">{selectedProblem.category}</span>
              <h2 className="text-lg font-bold text-slate-100">{selectedProblem.title}</h2>
            </div>
            <span className="text-xs font-semibold text-slate-400 px-2 py-0.5 rounded border border-slate-800 bg-[#070708] select-none">
              Role: Guidance
            </span>
          </div>
          <div className="text-xs text-slate-300 bg-[#09090b] p-3.5 rounded-lg border border-slate-800 leading-relaxed max-h-[140px] overflow-y-auto">
            <ReactMarkdown>{selectedProblem.description}</ReactMarkdown>
          </div>
        </div>

        {/* Step Tabs header */}
        <div className="bg-[#0c0c0e] border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[520px]">
          <div className="flex border-b border-slate-800 bg-[#070708] select-none overflow-x-auto">
            {([
              { key: 'brainstorm', label: '1. Brainstorm Cases', icon: <HelpCircle size={13} /> },
              { key: 'complexity', label: '2. Complexity analysis', icon: <Clock size={13} /> },
              { key: 'pseudocode', label: '3. Pseudocode/Dry Run', icon: <Code2 size={13} /> },
              { key: 'solution', label: '4. Optimal Solution', icon: <Sparkles size={13} /> }
            ] as const).map((step) => {
              const isActive = activeStep === step.key;
              return (
                <button
                  key={step.key}
                  onClick={() => setActiveStep(step.key)}
                  className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold transition-all select-none flex-shrink-0 border-b-2 outline-none ${
                    isActive
                      ? 'border-indigo-500 text-indigo-455 bg-[#09090b]/60'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {step.icon}
                  {step.label}
                </button>
              );
            })}
          </div>

          {/* Body and triggers */}
          <div className="flex-1 p-5 flex flex-col justify-between overflow-y-auto">
            {currentSavedText ? (
              <div className="flex-1 space-y-4">
                {activeStep === 'solution' && (
                  <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
                    <span className="text-xs text-slate-400 select-none">Implementation Language:</span>
                    <div className="flex gap-1">
                      {(['javascript', 'python', 'typescript', 'cpp', 'java'] as const).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            setLanguage(lang);
                            // Clear solution step response so they can fetch updated script
                            setStepResponses((prev) => {
                              const copy = { ...prev };
                              if (copy[probId]) {
                                delete copy[probId].solution;
                              }
                              return copy;
                            });
                          }}
                          className={`px-2 py-0.5 text-[10px] rounded border font-semibold ${
                            language === lang
                              ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-300'
                              : 'bg-[#09090b] text-slate-400 border-slate-800 hover:text-slate-200'
                          }`}
                        >
                          {lang.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-xs leading-relaxed text-slate-350 markdown-body h-[320px] overflow-y-auto pr-2">
                  <ReactMarkdown>{currentSavedText}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-12 h-12 rounded-full bg-slate-950 text-slate-500 flex items-center justify-center mb-3 border border-slate-800">
                  <BookOpen size={20} className="text-indigo-400" />
                </div>
                <h4 className="text-sm font-semibold text-slate-200 select-none">Step details not fetched yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5 leading-relaxed">
                  Let the AI Instructor break down this step dynamically for your selected algorithm challenge.
                </p>

                <button
                  onClick={() => triggerStepQuery(activeStep)}
                  disabled={loadingSteps[activeStep]}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-950/20"
                >
                  {loadingSteps[activeStep] ? (
                    <>
                      <RefreshCw className="animate-spin" size={13} /> Analysing Workspace...
                    </>
                  ) : (
                    <>
                      Formulate Step Guide <ChevronRight size={13} />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Error notifications */}
            {errorText && (
              <div className="bg-rose-950/20 border border-rose-900/40 p-3.5 rounded-xl text-xs text-rose-300 flex items-start gap-2.5 mt-4">
                <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Instructor Query Interrupted</p>
                  <p className="mt-0.5 opacity-80">{errorText}</p>
                </div>
              </div>
            )}

            {/* Footer triggers */}
            {currentSavedText && (
              <div className="border-t border-slate-800 pt-4 flex justify-between items-center mt-4">
                <button
                  onClick={() => triggerStepQuery(activeStep)}
                  disabled={loadingSteps[activeStep]}
                  className="px-3.5 py-2 bg-[#09090b] border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-40 select-none"
                >
                  <RefreshCw className={loadingSteps[activeStep] ? 'animate-spin' : ''} size={13} /> Re-evaluate Step
                </button>

                <div className="flex gap-2">
                  {activeStep === 'brainstorm' && (
                    <button
                      onClick={() => setActiveStep('complexity')}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-all select-none"
                    >
                      Next: Complexity <ChevronRight size={13} />
                    </button>
                  )}
                  {activeStep === 'complexity' && (
                    <button
                      onClick={() => setActiveStep('pseudocode')}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-all select-none"
                    >
                      Next: Pseudocode <ChevronRight size={13} />
                    </button>
                  )}
                  {activeStep === 'pseudocode' && (
                    <button
                      onClick={() => setActiveStep('solution')}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-all select-none"
                    >
                      Next: Code Optimal <ChevronRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
