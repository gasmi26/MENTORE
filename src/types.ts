/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export type SolverStep = 'brainstorm' | 'complexity' | 'pseudocode' | 'solution';

export interface DSAProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Arrays & Hashing' | 'Two Pointers' | 'Stack & Queue' | 'Linked List' | 'Binary Search' | 'Trees' | 'Graphs' | 'Dynamic Programming';
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  starters: {
    javascript: string;
    python: string;
    typescript: string;
    cpp: string;
    java: string;
  };
}

export interface PresetTopic {
  title: string;
  prompt: string;
  icon: string;
  description: string;
}
