/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  AlertCircle,
  HelpCircle,
  ArrowDown,
  Printer,
  RotateCcw,
} from 'lucide-react';
import { QuizData } from './types';
import { NotesInput } from './components/NotesInput';
import { QuizView } from './components/QuizView';
import { AnswerKeyView } from './components/AnswerKeyView';

export default function App() {
  const [notes, setNotes] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Generated quiz data
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleGenerateQuiz = async () => {
    // 1. Validation: If the notes box is empty, ask the user to enter study notes
    if (!notes.trim()) {
      setValidationError('Please enter your study notes in the text box above before generating a quiz.');
      const textarea = document.getElementById('study-notes-textarea');
      if (textarea) {
        textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
        textarea.focus();
      }
      return;
    }

    setValidationError(null);
    setApiError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: notes.trim(),
          questionCount,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate quiz from your notes.');
      }

      setQuiz(data.quiz);
      setUserAnswers({});
      setIsSubmitted(false);

      // Smooth scroll to generated quiz section
      setTimeout(() => {
        const quizElement = document.getElementById('generated-quiz-section');
        if (quizElement) {
          quizElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err: any) {
      console.error('Quiz generation failed:', err);
      setApiError(
        err?.message ||
          'Something went wrong while generating the quiz. Please check your notes and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAnswers = () => {
    setUserAnswers({});
    setIsSubmitted(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight flex items-center gap-2">
                PrepQuiz
                <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                  University Study
                </span>
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Convert lecture notes into multiple-choice practice quizzes with explanations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {quiz && (
              <button
                type="button"
                onClick={handlePrint}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Print quiz or save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print / Save PDF</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Intro Tagline */}
        <section className="text-center sm:text-left space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Practice Quiz Generator
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
            Paste your course notes below, select how many practice questions you need (1 to 5),
            and generate an instant quiz with 4 answer options each, accompanied by a complete answer
            key with detailed explanations.
          </p>
        </section>

        {/* Input Card */}
        <NotesInput
          notes={notes}
          setNotes={setNotes}
          questionCount={questionCount}
          setQuestionCount={setQuestionCount}
          onGenerate={handleGenerateQuiz}
          isLoading={isLoading}
          errorMessage={validationError}
          setErrorMessage={setValidationError}
        />

        {/* API Error Callout */}
        {apiError && (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 shadow-xs"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-sm">Failed to generate quiz</p>
              <p className="text-xs sm:text-sm text-rose-700 mt-0.5">{apiError}</p>
            </div>
            <button
              type="button"
              onClick={handleGenerateQuiz}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 text-center space-y-4 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600">
              <Sparkles className="w-6 h-6 animate-spin text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Crafting Your Practice Quiz...
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Gemini is analyzing your study notes, identifying key academic principles, and formulating {questionCount} questions with plausible distractors and explanations.
              </p>
            </div>
            <div className="space-y-3 pt-4 max-w-lg mx-auto">
              <div className="h-4 bg-slate-200 rounded-md w-3/4 mx-auto" />
              <div className="h-10 bg-slate-100 rounded-xl w-full" />
              <div className="h-10 bg-slate-100 rounded-xl w-full" />
              <div className="h-10 bg-slate-100 rounded-xl w-full" />
              <div className="h-10 bg-slate-100 rounded-xl w-full" />
            </div>
          </div>
        )}

        {/* Generated Quiz Section */}
        {quiz && !isLoading && (
          <div id="generated-quiz-section" className="space-y-8 scroll-mt-20">
            {/* The Questions View with 4 options each */}
            <QuizView
              quiz={quiz}
              userAnswers={userAnswers}
              setUserAnswers={setUserAnswers}
              isSubmitted={isSubmitted}
              setIsSubmitted={setIsSubmitted}
              onResetAnswers={handleResetAnswers}
            />

            {/* Answer Key with Explanations (Displayed Below the Questions) */}
            <AnswerKeyView quiz={quiz} />
          </div>
        )}

        {/* Helpful Tips Section when no quiz is yet generated */}
        {!quiz && !isLoading && (
          <div className="bg-white/80 rounded-2xl border border-slate-200/80 p-6 sm:p-7">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 mb-3">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              Tips for University Study Notes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-600">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <p className="font-semibold text-slate-900 mb-1">Key Definitions</p>
                <p>Include definitions, terminology, and core formulas for sharp recall questions.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <p className="font-semibold text-slate-900 mb-1">Comparisons</p>
                <p>Add contrast between related concepts to test distinction and critical reasoning.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <p className="font-semibold text-slate-900 mb-1">Processes & Steps</p>
                <p>Note sequential mechanisms or causal chains to generate mechanism-based problems.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p className="max-w-xl mx-auto px-4">
          PrepQuiz — Designed for university study and exam preparation. Practice questions are generated from student notes using Gemini 3.8 Flash.
        </p>
      </footer>
    </div>
  );
}
