export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizData {
  title: string;
  questions: Question[];
}

export interface SampleNote {
  id: string;
  title: string;
  subject: string;
  content: string;
}
