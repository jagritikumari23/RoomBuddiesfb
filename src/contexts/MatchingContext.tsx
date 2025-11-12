import { createContext, useContext, useMemo, useState, ReactNode } from "react";

export type QuizAnswers = Record<string, any>;

export type MatchSummary = {
  id: string;
  name: string;
  image: string;
  matchPercentage: number;
  preview?: string;
  time?: string;
  unread?: boolean;
};

interface MatchingState {
  quizAnswers: QuizAnswers;
  setQuizAnswer: (id: string, value: any) => void;
  setQuizAnswers: (answers: QuizAnswers) => void;
  quizComplete: boolean;
  setQuizComplete: (complete: boolean) => void;
  compatibilityScore: number | null;
  setCompatibilityScore: (score: number) => void;
  likedMatches: MatchSummary[];
  addLikedMatch: (match: MatchSummary) => void;
  clearMatches: () => void;
}

const MatchingContext = createContext<MatchingState | undefined>(undefined);

export const MatchingProvider = ({ children }: { children: ReactNode }) => {
  const [quizAnswers, setQuizAnswersState] = useState<QuizAnswers>({});
  const [quizComplete, setQuizComplete] = useState(false);
  const [compatibilityScore, setCompatibilityScore] = useState<number | null>(null);
  const [likedMatches, setLikedMatches] = useState<MatchSummary[]>([]);

  const setQuizAnswer = (id: string, value: any) => {
    setQuizAnswersState(prev => ({ ...prev, [id]: value }));
  };

  const setQuizAnswers = (answers: QuizAnswers) => {
    setQuizAnswersState(answers);
  };

  const addLikedMatch = (match: MatchSummary) => {
    setLikedMatches(prev => {
      if (prev.find(m => m.id === match.id)) return prev; // avoid duplicates
      return [match, ...prev];
    });
  };

  const clearMatches = () => setLikedMatches([]);

  const value = useMemo<MatchingState>(() => ({
    quizAnswers,
    setQuizAnswer,
    setQuizAnswers,
    quizComplete,
    setQuizComplete,
    compatibilityScore,
    setCompatibilityScore,
    likedMatches,
    addLikedMatch,
    clearMatches,
  }), [quizAnswers, quizComplete, compatibilityScore, likedMatches]);

  return (
    <MatchingContext.Provider value={value}>{children}</MatchingContext.Provider>
  );
};

export const useMatching = () => {
  const ctx = useContext(MatchingContext);
  if (!ctx) throw new Error("useMatching must be used within a MatchingProvider");
  return ctx;
};
