import React, { useRef } from 'react';
import { Sparkles, BookOpen, Trash2, HelpCircle } from 'lucide-react';
import { SAMPLE_NOTES } from '../sampleNotes';

interface NotesInputProps {
  notes: string;
  setNotes: (value: string) => void;
  questionCount: number;
  setQuestionCount: (count: number) => void;
  onGenerate: () => void;
  isLoading: boolean;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
}

export const NotesInput: React.FC<NotesInputProps> = ({
  notes,
  setNotes,
  questionCount,
  setQuestionCount,
  onGenerate,
  isLoading,
  errorMessage,
  setErrorMessage,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    if (errorMessage && e.target.value.trim().length > 0) {
      setErrorMessage(null);
    }
  };

  const handleSelectSample = (sampleText: string) => {
    setNotes(sampleText);
    setErrorMessage(null);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleClear = () => {
    setNotes('');
    setErrorMessage(null);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleQuestionCountChange = (val: number) => {
    const clamped = Math.min(5, Math.max(1, isNaN(val) ? 1 : val));
    setQuestionCount(clamped);
  };

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;
  const charCount = notes.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 transition-all">
      {/* Sample Notes Bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2.5">
          <label
            htmlFor="study-notes-textarea"
            className="text-base font-semibold text-slate-900 flex items-center gap-2"
          >
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Study Notes & Course Material
            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              Required
            </span>
          </label>

          {notes.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-medium text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-rose-50"
              title="Clear study notes"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear text
            </button>
          )}
        </div>

        {/* Quick sample chips */}
        <div className="flex items-center flex-wrap gap-2 mb-3">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Try a sample:
          </span>
          {SAMPLE_NOTES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample.content)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors cursor-pointer"
            >
              {sample.title} ({sample.subject})
            </button>
          ))}
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            id="study-notes-textarea"
            rows={7}
            value={notes}
            onChange={handleNotesChange}
            placeholder="Paste your lecture notes, textbook summaries, definitions, or study guides here (e.g., cell biology, macroeconomic principles, data structures, psychology concepts)..."
            className={`w-full p-4 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm sm:text-base leading-relaxed border transition-all focus:outline-none focus:ring-2 ${
              errorMessage
                ? 'border-rose-300 ring-2 ring-rose-200 bg-rose-50/20'
                : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100 bg-slate-50/30'
            }`}
          />
        </div>

        {/* Validation Error Message */}
        {errorMessage && (
          <div
            id="empty-notes-warning"
            role="alert"
            className="mt-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5 animate-fadeIn"
          >
            <HelpCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-900">Study notes required</p>
              <p className="text-rose-700 text-xs sm:text-sm mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Word / Char Counter */}
        <div className="flex justify-between items-center text-xs text-slate-500 mt-2 px-1">
          <span>
            {notes.trim().length === 0
              ? 'Enter or paste study notes to generate practice questions'
              : `${wordCount} words • ${charCount} characters`}
          </span>
          <span className="text-slate-400">Gemini 3.8 Flash Powered</span>
        </div>
      </div>

      {/* Controls row: Number input and Generate Button */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-5">
        {/* Question Count Input */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div>
            <label
              htmlFor="question-count-input"
              className="block text-sm font-semibold text-slate-800"
            >
              Number of questions (1 – 5):
            </label>
            <span className="text-xs text-slate-500 block">
              University practice quiz size
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="question-count-input"
              type="number"
              min={1}
              max={5}
              value={questionCount}
              onChange={(e) => handleQuestionCountChange(parseInt(e.target.value, 10))}
              className="w-16 h-11 text-center font-bold text-base text-slate-900 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600"
            />

            {/* Quick-pick pill buttons (1 to 5) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`w-8 h-9 text-xs font-semibold rounded-lg transition-all ${
                    questionCount === num
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={`Generate ${num} question${num > 1 ? 's' : ''}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading}
          className={`flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white shadow-md transition-all cursor-pointer ${
            isLoading
              ? 'bg-indigo-400 cursor-not-allowed opacity-90'
              : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] hover:shadow-indigo-200'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating Quiz...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Quiz</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
