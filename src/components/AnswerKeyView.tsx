import React, { useState } from 'react';
import { KeyRound, CheckCircle2, Lightbulb, Copy, Check } from 'lucide-react';
import { QuizData } from '../types';

interface AnswerKeyViewProps {
  quiz: QuizData;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export const AnswerKeyView: React.FC<AnswerKeyViewProps> = ({ quiz }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyKey = async () => {
    try {
      const formatted = quiz.questions
        .map((q, idx) => {
          const correctOptionText = q.options[q.correctIndex];
          return `Question ${idx + 1}: ${q.question}
Correct Answer: (${OPTION_LABELS[q.correctIndex]}) ${correctOptionText}
Explanation: ${q.explanation}
`;
        })
        .join('\n---\n\n');

      await navigator.clipboard.writeText(
        `# Answer Key & Explanations: ${quiz.title}\n\n${formatted}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy to clipboard', e);
    }
  };

  return (
    <section
      aria-label="Quiz Answer Key and Explanations"
      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6"
    >
      {/* Answer Key Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              Answer Key & Explanations
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Verified answers with rationale directly from your study notes
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyKey}
          className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300 flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
          title="Copy full answer key with explanations to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700">Copied to Clipboard</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-500" />
              <span>Copy Answer Key</span>
            </>
          )}
        </button>
      </div>

      {/* Answer Key Items */}
      <div className="space-y-6 divide-y divide-slate-100">
        {quiz.questions.map((question, qIdx) => {
          const correctLabel = OPTION_LABELS[question.correctIndex];
          const correctText = question.options[question.correctIndex];

          return (
            <div
              key={question.id}
              className={`pt-6 first:pt-0 space-y-3.5`}
            >
              {/* Question reference */}
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {qIdx + 1}
                </span>
                <p className="font-semibold text-slate-900 text-sm sm:text-base">
                  {question.question}
                </p>
              </div>

              {/* Correct Answer Box */}
              <div className="ml-8 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/90 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="text-xs uppercase tracking-wider font-bold text-emerald-800 block">
                    Correct Answer
                  </span>
                  <p className="font-semibold text-emerald-950 mt-0.5">
                    Option {correctLabel}: {correctText}
                  </p>
                </div>
              </div>

              {/* Detailed Explanation Box */}
              <div className="ml-8 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Explanation & Context</span>
                </div>
                <p className="text-slate-700 text-sm">{question.explanation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
