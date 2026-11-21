import React from 'react';
import { CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';
import { QuizData } from '../types';

interface QuizViewProps {
  quiz: QuizData;
  userAnswers: Record<number, number>;
  setUserAnswers: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  isSubmitted: boolean;
  setIsSubmitted: (submitted: boolean) => void;
  onResetAnswers: () => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export const QuizView: React.FC<QuizViewProps> = ({
  quiz,
  userAnswers,
  setUserAnswers,
  isSubmitted,
  setIsSubmitted,
  onResetAnswers,
}) => {
  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (isSubmitted) return; // Prevent changing after submission
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const answeredCount = Object.keys(userAnswers).length;
  const totalQuestions = quiz.questions.length;

  // Calculate score if submitted
  const correctCount = isSubmitted
    ? quiz.questions.filter((q) => userAnswers[q.id] === q.correctIndex).length
    : 0;

  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="space-y-6">
      {/* Quiz Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                Practice Quiz
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {totalQuestions} Question{totalQuestions > 1 ? 's' : ''} • 4 Options Each
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {quiz.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted ? (
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                Answered: <strong className="text-slate-900">{answeredCount}</strong> of {totalQuestions}
              </span>
            ) : (
              <button
                type="button"
                onClick={onResetAnswers}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retake Quiz
              </button>
            )}
          </div>
        </div>

        {/* Score banner upon submission */}
        {isSubmitted && (
          <div className="mt-6 p-4 sm:p-5 rounded-xl bg-gradient-to-r from-indigo-50 via-blue-50 to-emerald-50 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-indigo-900">
                  Quiz Completed
                </p>
                <p className="text-lg font-bold text-slate-900">
                  You scored {correctCount} out of {totalQuestions} ({scorePercentage}%)
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {scorePercentage === 100
                    ? 'Outstanding! You have mastered these study notes.'
                    : scorePercentage >= 70
                    ? 'Great effort! Review the detailed answer key below to solidify weaker areas.'
                    : 'Good practice! Take a close look at the explanations below and try again.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onResetAnswers}
              className="text-xs font-semibold px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-xs hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap"
            >
              Clear & Retake
            </button>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {quiz.questions.map((question, qIdx) => {
          const selectedOption = userAnswers[question.id];
          const isAnswered = selectedOption !== undefined;
          const isCorrect = selectedOption === question.correctIndex;

          return (
            <div
              key={question.id}
              className={`bg-white rounded-2xl border shadow-sm transition-all p-6 sm:p-7 ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-200/90 ring-1 ring-emerald-100'
                    : 'border-rose-200/90 ring-1 ring-rose-100'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              {/* Question Number & Status Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 font-bold text-sm flex items-center justify-center">
                    {qIdx + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Question {qIdx + 1} of {totalQuestions}
                  </span>
                </div>

                {/* Submission status tag */}
                {isSubmitted && (
                  <div>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Question Prompt */}
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-5 leading-snug">
                {question.question}
              </h3>

              {/* Four Answer Options */}
              <div className="grid grid-cols-1 gap-2.5">
                {question.options.map((optionText, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  const isThisCorrect = question.correctIndex === optIdx;

                  let optionStyle =
                    'border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-300 text-slate-800';

                  if (isSubmitted) {
                    if (isThisCorrect) {
                      optionStyle =
                        'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium ring-1 ring-emerald-400';
                    } else if (isSelected && !isThisCorrect) {
                      optionStyle =
                        'border-rose-400 bg-rose-50 text-rose-950 ring-1 ring-rose-300 line-through opacity-85';
                    } else {
                      optionStyle = 'border-slate-200 bg-slate-50/40 text-slate-500 opacity-60';
                    }
                  } else if (isSelected) {
                    optionStyle =
                      'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-2 ring-indigo-200 font-medium';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(question.id, optIdx)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer text-sm sm:text-base ${optionStyle} ${
                        isSubmitted ? 'cursor-default' : ''
                      }`}
                    >
                      {/* Option letter pill */}
                      <span
                        className={`w-7 h-7 rounded-lg text-xs font-bold shrink-0 flex items-center justify-center transition-colors ${
                          isSubmitted && isThisCorrect
                            ? 'bg-emerald-600 text-white'
                            : isSubmitted && isSelected && !isThisCorrect
                            ? 'bg-rose-600 text-white'
                            : isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white border border-slate-300 text-slate-700'
                        }`}
                      >
                        {OPTION_LABELS[optIdx]}
                      </span>

                      {/* Option text */}
                      <span className="flex-1 pt-0.5 leading-relaxed">{optionText}</span>

                      {/* Indicator icons */}
                      {isSubmitted && isThisCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {isSubmitted && isSelected && !isThisCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Instant feedback summary for this question if submitted */}
              {isSubmitted && (
                <div
                  className={`mt-4 p-3.5 rounded-xl text-xs sm:text-sm border ${
                    isCorrect
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50/70 border-rose-200 text-rose-900'
                  }`}
                >
                  <p className="font-semibold">
                    {isCorrect ? 'Correct!' : 'Incorrect.'}{' '}
                    <span className="font-normal text-slate-700">
                      The correct answer is Option {OPTION_LABELS[question.correctIndex]}:{' '}
                      <strong>{question.options[question.correctIndex]}</strong>
                    </span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submission CTA bar if not yet submitted */}
      {!isSubmitted && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Ready to check your understanding?
            </p>
            <p className="text-xs text-slate-500">
              {answeredCount === totalQuestions
                ? 'All questions answered! Click submit to check your score.'
                : `You have answered ${answeredCount} of ${totalQuestions} questions.`}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsSubmitted(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Submit & Check Answers</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
