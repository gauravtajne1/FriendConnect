import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Cpu, Database, Clock } from 'lucide-react';

export default function AlgorithmCard({
  title,
  subtitle,
  timeComplexity,
  spaceComplexity,
  dataStructures,
  steps = [],
  pseudocode,
  explanation,
  defaultOpen = false,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow transition-all mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50/80 transition text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">DAA Algorithm Concept</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">Academic Explanation</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            {timeComplexity && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-50 border border-indigo-200 text-indigo-700">
                <Clock className="w-3 h-3 text-indigo-600" />
                {timeComplexity}
              </span>
            )}
            {spaceComplexity && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
                <Database className="w-3 h-3 text-emerald-600" />
                {spaceComplexity}
              </span>
            )}
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="p-6 border-t border-slate-100 bg-slate-50/70 space-y-6">
          {/* Complexity & Data Structures Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                Time Complexity
              </div>
              <div className="text-sm font-mono font-bold text-indigo-700">
                {timeComplexity || 'O(V + E)'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                Space Complexity
              </div>
              <div className="text-sm font-mono font-bold text-emerald-700">
                {spaceComplexity || 'O(V)'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <Cpu className="w-3.5 h-3.5 text-amber-600" />
                Primary Data Structure
              </div>
              <div className="text-sm font-bold text-slate-800">
                {dataStructures || 'Adjacency List + Hash Map'}
              </div>
            </div>
          </div>

          {/* Explanation narrative */}
          {explanation && (
            <div className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              {explanation}
            </div>
          )}

          {/* Step-by-Step execution breakdown */}
          {steps && steps.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                How It Works (Step-by-Step)
              </h4>
              <div className="space-y-2">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-mono font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pseudocode block */}
          {pseudocode && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Algorithm Pseudocode / Implementation Logic
              </h4>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-indigo-200 overflow-x-auto whitespace-pre shadow-sm">
                {pseudocode}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
