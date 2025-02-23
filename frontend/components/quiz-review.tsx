"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

interface ReviewQuestion {
  questionText: string
  userAnswer: string
  correctAnswer: string
  explanation: string
  isCorrect: boolean
}

interface QuizReviewProps {
  sessionId: string
  onClose: () => void
}

export function QuizReview({ sessionId, onClose }: QuizReviewProps) {
  const [questions, setQuestions] = useState<ReviewQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchReview()
  }, [])

  const fetchReview = async () => {
    try {
      const response = await fetch(
        `https://maths-quizzer-production.up.railway.app/api/quiz/quiz-session/${sessionId}/review`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      const data = await response.json()
      if (response.ok) {
        setQuestions(data.data.questions)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch review",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching the review",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h3>
        <div className="flex items-center gap-2">
          {currentQuestion.isCorrect ? (
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          ) : (
            <XCircle className="h-6 w-6 text-red-500" />
          )}
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <div>
          <h4 className="font-medium mb-2">Question:</h4>
          <p>{currentQuestion.questionText}</p>
        </div>
        <div>
          <h4 className="font-medium mb-2">Your Answer:</h4>
          <p className={currentQuestion.isCorrect ? "text-green-600" : "text-red-600"}>{currentQuestion.userAnswer}</p>
        </div>
        {!currentQuestion.isCorrect && (
          <div>
            <h4 className="font-medium mb-2">Correct Answer:</h4>
            <p className="text-green-600">{currentQuestion.correctAnswer}</p>
          </div>
        )}
        <div>
          <h4 className="font-medium mb-2">Explanation:</h4>
          <p className="text-muted-foreground">{currentQuestion.explanation}</p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
          Previous
        </Button>
        <div className="space-x-2">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
          <Button onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

