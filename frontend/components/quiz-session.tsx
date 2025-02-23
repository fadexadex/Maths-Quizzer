"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface Question {
  id: string
  questionText: string
  options: string[]
  userAnswer: string | null
  isCorrect: boolean | null
}

interface QuizSessionProps {
  sessionId: string
  onClose: () => void
  onComplete: () => void
}

export function QuizSession({ sessionId, onClose, onComplete }: QuizSessionProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchQuizSession()
  }, [])

  const fetchQuizSession = async () => {
    try {
      const response = await fetch(
        `https://maths-quizzer-production.up.railway.app/api/quiz/quiz-session/${sessionId}`,
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
          description: data.message || "Failed to fetch quiz session",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching the quiz session",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerChange = (answer: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[currentQuestionIndex].userAnswer = answer
    setQuestions(updatedQuestions)
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

  const handleSaveAndExit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch(
        `https://maths-quizzer-production.up.railway.app/api/quiz/quiz-session/${sessionId}/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            answers: questions.map((q) => ({
              questionId: q.id,
              userAnswer: q.userAnswer || null,
            })),
          }),
        },
      )
      const data = await response.json()
      if (response.ok) {
        toast({
          title: "Success",
          description: "Quiz progress saved successfully",
        })
        onClose()
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save quiz progress",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Save and exit error:", error)
      toast({
        title: "Error",
        description: "An error occurred while saving the quiz progress",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch(
        `https://maths-quizzer-production.up.railway.app/api/quiz/quiz-session/${sessionId}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            answers: questions.map((q) => ({
              questionId: q.id,
              userAnswer: q.userAnswer || null,
            })),
          }),
        },
      )
      const data = await response.json()
      if (response.ok) {
        toast({
          title: "Success",
          description: "Quiz submitted successfully",
        })
        onComplete()
        onClose()
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to submit quiz",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Submit error:", error)
      toast({
        title: "Error",
        description: "An error occurred while submitting the quiz",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-semibold">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h3>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <div>
          <h4 className="font-medium mb-4">{currentQuestion?.questionText}</h4>
          <RadioGroup
            value={currentQuestion?.userAnswer || ""}
            onValueChange={handleAnswerChange}
            className="space-y-3"
          >
            {currentQuestion?.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-sm sm:text-base">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <Button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} className="w-full sm:w-auto">
          Previous
        </Button>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleSaveAndExit} variant="outline" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save & Exit"
            )}
          </Button>
          {currentQuestionIndex === questions.length - 1 ? (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} className="w-full sm:w-auto">
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

