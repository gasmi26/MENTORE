/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, AlertCircle, Terminal, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message, PresetTopic } from '../types';

const PRESET_TOPICS: PresetTopic[] = [
  {
    title: 'Explain Recursion',
    prompt: 'Can you explain Recursion simply using a daily life example, and show a visual trace of factorial(3)?',
    icon: '🔁',
    description: 'Learn call stacks and base cases'
  },
  {
    title: 'Time Complexity',
    prompt: 'How do I analyze the time complexity of a recursive Binary Search? Can you break down the mathematical steps?',
    icon: '⏱️',
    description: 'Learn logarithmic efficiency'
  },
  {
    title: 'Floyd\'s Cycle Detection',
    prompt: 'Explain Floyd\'s Tortoise and Hare Cycle Detection algorithm. Why do they eventually meet in a loop?',
    icon: '🐢',
    description: 'Learn fast and slow pointers'
  },
  {
    title: 'Tree Traversals',
    prompt: 'What is the literal difference between Pre-Order, In-Order, and Post-Order traversals? Show standard recursive code for each.',
    icon: '🌳',
    description: 'Compare DFS BST traversal logic'
  }
];

export default function ChatInstructor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'greeting',
      role: 'model',
      text: `Hello! I am your **Data Structures and Algorithms (DSA) AI Instructor**.

I specialize in helping you learn concepts, brainstorm logic, design optimal code schemas, and analyze complexities.

What would you like to explore today? Select a template below or type your challenge!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setErrorText(null);
    const userMessage: Message = {
      id: Math.random().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            text: m.text
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to communicate with the backend tutor assistant.');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const aiMessage: Message = {
        id: Math.random().toString(),
        role: 'model',
        text: data.text || "I apologize, but I wasn't able to construct a response. Please ask another DSA question.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || 'Connecting server failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[640px]">
      {/* Topics list layout / Side guidelines */}
      <div className="lg:w-1/3 flex flex-col gap-4">
        <div className="bg-[#0c0c0e] border border-slate-800 rounded-xl p-5 flex flex-col gap-4 h-full justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 select-none flex items-center gap-1.5">
              <Sparkles className="text-indigo-400" size={13} />
              Featured Starter Prompts
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Click any study template to kickstart a deep conversation with the instructor.
            </p>

            <div className="space-y-2.5">
              {PRESET_TOPICS.map((topic) => (
                <button
                  key={topic.title}
                  onClick={() => handleSendMessage(topic.prompt)}
                  disabled={isLoading}
                  className="w-full text-left bg-[#070708] hover:bg-slate-800/40 border border-slate-800 p-3 rounded-lg transition-all group disabled:opacity-40"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm select-none">{topic.icon}</span>
                    <span className="text-xs font-semibold text-slate-300 group-hover:text-indigo-400 transition-colors">
                      {topic.title}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 pl-7">{topic.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950/40 rounded-lg p-3.5 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <HelpCircle size={12} className="text-indigo-400" /> Instructions Safeguard
            </span>
            <p className="leading-relaxed">
              Our AI Instructor responds strictly to DSA related topics. It will refuse generic queries, visual arts, or non-algorithmic chatter to keep your attention pristine.
            </p>
          </div>
        </div>
      </div>

      {/* Main chat log sector */}
      <div className="flex-1 flex flex-col bg-[#09090b] border border-slate-800 rounded-xl overflow-hidden h-full">
        {/* Header toolbar */}
        <div className="px-5 py-3.5 bg-[#0c0c0e]/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-200">AI DSA Advisor Class</span>
          </div>
          <span className="text-[10px] uppercase text-indigo-400 font-mono tracking-wider">Instructor Online</span>
        </div>

        {/* Message logs list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed border ${
                    isUser
                      ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-100 rounded-tr-none'
                      : 'bg-slate-800/30 border-slate-700/50 text-slate-300 rounded-tl-none'
                  }`}
                >
                  <div className="markdown-body text-slate-200">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                  <span className={`text-[9px] font-mono mt-2 block text-right select-none ${
                    isUser ? 'text-indigo-400/60' : 'text-slate-500/60'
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl rounded-tl-none p-4 w-20 flex justify-between items-center">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          {errorText && (
            <div className="bg-rose-950/20 border border-rose-900/40 p-4 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Instructor Communication Interrupted</p>
                <p className="mt-1 opacity-80">{errorText}</p>
                <p className="mt-2 text-[10px] text-rose-450/80">
                  Tip: Verify your Gemini API credential value in the Secrets panel in AI Studio settings.
                </p>
              </div>
            </div>
          )}

          <div ref={endOfMessagesRef} />
        </div>

        {/* Input panel */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="p-4 bg-[#0c0c0e] border-t border-slate-800"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isLoading ? 'Tutor is formulating response...' : 'Ask about lists, sorting, hashes, trees...'}
              disabled={isLoading}
              className="w-full bg-[#09090b] border border-slate-700 rounded-xl py-3.5 pl-5 pr-20 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-indigo-950/20"
            >
              SEND
            </button>
          </div>
          <p className="mt-2 text-center text-[9px] text-slate-500 uppercase tracking-widest font-semibold select-none">
            Restricted to Data Structures & Algorithms only
          </p>
        </form>
      </div>
    </div>
  );
}
