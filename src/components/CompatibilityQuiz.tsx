import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMatching } from "@/contexts/MatchingContext";

interface Question {
  id: string;
  type: "radio" | "checkbox" | "scale";
  question: string;
  options?: string[];
  category: string;
}

const compatibilityQuestions: Question[] = [
  {
    id: "morning-routine",
    type: "radio",
    question: "1. What’s the first thing you do after waking up?",
    options: [
      "Make my bed = can’t start the day without it!",
      "Stretch, check my phone, maybe make the bed later.",
      "Rush out = bed-making can wait forever 😅",
    ],
    category: "Lifestyle",
  },
  {
    id: "work-vibe",
    type: "radio",
    question: "2. What’s your go-to study or work vibe?",
    options: [
      "I need pin-drop silence to focus.",
      "A little music or background noise keeps me going.",
      "Music blasting = motivation mode on! 🎧",
    ],
    category: "Study/Work",
  },
  {
    id: "late-night",
    type: "radio",
    question: "3. It’s late at night and you’re still awake. What are you doing?",
    options: [
      "Forcing myself to sleep — I like routines.",
      "Scrolling or watching something quietly.",
      "Full-on movie or chat mode 😆",
    ],
    category: "Lifestyle",
  },
  {
    id: "laundry-habit",
    type: "radio",
    question: "4. Your laundry basket is overflowing… what’s your move?",
    options: [
      "Wash time = can’t stand dirty clothes!",
      "Maybe tomorrow, I’m tired today.",
      "Eh, I’ll deal with it when I run out of socks 😅",
    ],
    category: "Habits",
  },
  {
    id: "eating-room",
    type: "radio",
    question: "5. A friend shows up with pizza and wants to eat in your room. You…",
    options: [
      "Sure! But we’ll clean up right after.",
      "Okay, let’s eat first, clean later.",
      "No problem = crumbs are part of the vibe 🍕",
    ],
    category: "Cleanliness",
  },
  {
    id: "free-time-room",
    type: "radio",
    question: "6. How do you usually spend your free time in the room?",
    options: [
      "Reading, sketching, or just relaxing solo.",
      "Chatting online or calling a few friends.",
      "Hosting mini hangouts every now and then 🎉",
    ],
    category: "Social",
  },
  {
    id: "music-while-study",
    type: "radio",
    question: "7. Your roommate plays music while you’re studying — what’s your reaction?",
    options: [
      "“Hey, can you lower it a bit?” (politely!)",
      "I’ll put on earphones, no big deal.",
      "I might get a little annoyed ngl 😅",
    ],
    category: "Study/Work",
  },
  {
    id: "room-aesthetic",
    type: "radio",
    question: "8. How do you like your room to look?",
    options: [
      "Neat and organized = everything has a place.",
      "A bit messy but comfy = my kind of chaos!",
      "Bright, colorful, full of stuff = the more the merrier! 🌈",
    ],
    category: "Environment/Style",
  },
];

const CompatibilityQuiz = () => {
  const navigate = useNavigate();
  const { setQuizAnswer, setQuizAnswers, setQuizComplete, setCompatibilityScore } = useMatching();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isComplete, setIsComplete] = useState(false);

  const progress = ((currentQuestion + 1) / compatibilityQuestions.length) * 100;
  const question = compatibilityQuestions[currentQuestion];

  const handleAnswer = (value: any) => {
    setAnswers(prev => {
      const next = { ...prev, [question.id]: value };
      setQuizAnswer(question.id, value);
      return next;
    });
  };

  const handleNext = () => {
    if (currentQuestion < compatibilityQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // finalize quiz
      setIsComplete(true);
      setQuizComplete(true);
      setQuizAnswers(answers);
      // naive score: base 60 + 5 per answered question, capped at 100
      const answeredCount = Object.keys(answers).length;
      const score = Math.min(100, 60 + answeredCount * 5);
      setCompatibilityScore(score);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const renderQuestionInput = () => {
    const answer = answers[question.id];

    switch (question.type) {
      case "radio":
        return (
          <RadioGroup value={answer} onValueChange={handleAnswer} className="space-y-3">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`checkbox-${index}`}
                  checked={answer?.includes(option)}
                  onCheckedChange={(checked) => {
                    const newAnswer = answer || [];
                    if (checked) {
                      handleAnswer([...newAnswer, option]);
                    } else {
                      handleAnswer(newAnswer.filter((item: string) => item !== option));
                    }
                  }}
                />
                <Label htmlFor={`checkbox-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case "scale":
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Not Important</span>
              <span>Very Important</span>
            </div>
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant={answer === rating ? "hero" : "outline"}
                  size="lg"
                  className="flex-1"
                  onClick={() => handleAnswer(rating)}
                >
                  {rating}
                </Button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isComplete) {
    return (
      <div className="container mx-auto px-6 py-16">
        <Card className="max-w-2xl mx-auto p-8 text-center shadow-elevated">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Compatibility Profile Complete!</h2>
            <p className="text-muted-foreground text-lg">
              We've analyzed your preferences and are ready to find your perfect roommate matches.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-accent-soft rounded-lg">
                <div className="text-2xl font-bold text-accent mb-1">95%</div>
                <div className="text-sm text-muted-foreground">Compatibility Score</div>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">12</div>
                <div className="text-sm text-muted-foreground">Potential Matches</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button variant="hero" size="lg" className="w-full" onClick={() => navigate("/dashboard?section=matching")}>
              View My Matches
            </Button>
            <Button variant="outline" size="lg" className="w-full" onClick={() => window.location.reload()}>
              Retake Quiz
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Badge className="mb-4">{question.category}</Badge>
          <h2 className="text-3xl font-bold mb-4">Compatibility Assessment</h2>
          <p className="text-muted-foreground">
            Question {currentQuestion + 1} of {compatibilityQuestions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="p-8 shadow-card">
          <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
          
          <div className="mb-8">
            {renderQuestionInput()}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <Button
              variant="hero"
              onClick={handleNext}
              disabled={!answers[question.id]}
            >
              {currentQuestion === compatibilityQuestions.length - 1 ? "Complete" : "Next"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Answer Summary */}
        {Object.keys(answers).length > 0 && (
          <Card className="mt-6 p-6 bg-muted/50">
            <h4 className="font-medium mb-3">Your Answers So Far:</h4>
            <div className="space-y-2 text-sm">
              {Object.entries(answers).map(([questionId, answer]) => {
                const q = compatibilityQuestions.find(q => q.id === questionId);
                return (
                  <div key={questionId} className="flex justify-between">
                    <span className="text-muted-foreground">{q?.category}:</span>
                    <span className="font-medium">
                      {Array.isArray(answer) ? answer.join(", ") : answer}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CompatibilityQuiz;