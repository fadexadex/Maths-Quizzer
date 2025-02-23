"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { QuizSession } from "@/components/quiz-session"
import { QuizReview } from "@/components/quiz-review"
import { Loader2, RefreshCw } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Topic {
  id: string
  name: string
  materials: string
  sessions?: Session[]
}

interface Session {
  id: string
  completed: boolean
  score: number | null
}

interface TopicDetailsProps {
  topic: Topic
}

export function TopicDetails({ topic: initialTopic }: TopicDetailsProps) {
  const [topic, setTopic] = useState<Topic>(initialTopic)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [isReviewMode, setIsReviewMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false)
  const [regeneratingSession, setRegeneratingSession] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchTopicDetails()
  }, []) // Re-fetch when topic ID changes

  const fetchTopicDetails = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `https://maths-quizzer-production.up.railway.app/api/quiz/topic/${initialTopic.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      const data = await response.json()
      if (response.ok) {
        // Update the entire topic data, not just sessions
        setTopic(data.data)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch topic details",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching topic details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createQuizSession = async () => {
    setIsCreatingSession(true)
    try {
      const response = await fetch(
        `https://maths-quizzer-production.up.railway.app/api/quiz/topic/${topic.id}/create-quiz-session`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      const data = await response.json()
      if (response.ok) {
        toast({
          title: "Success",
          description: "Quiz session created successfully",
        })
        fetchTopicDetails()
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create quiz session",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the quiz session",
        variant: "destructive",
      })
    } finally {
      setIsCreatingSession(false)
    }
  }

  const handleRegenerateQuiz = async () => {
    if (!regeneratingSession) return
    setIsRegenerating(true)
    setShowRegenerateDialog(false)

    try {
      const response = await fetch(
        `https://maths-quizzer-production.up.railway.app/api/quiz/quiz-session/${regeneratingSession}/regenerate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      const data = await response.json()
      if (response.ok) {
        toast({
          title: "Success",
          description: "Quiz regenerated successfully",
        })
        fetchTopicDetails()
        setSelectedSession(data.data.id)
        setIsReviewMode(false)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to regenerate quiz",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while regenerating the quiz",
        variant: "destructive",
      })
    } finally {
      setIsRegenerating(false)
      setRegeneratingSession(null)
    }
  }

  const handleSessionClick = (session: Session) => {
    if (session.completed) {
      setSelectedSession(session.id)
      setIsReviewMode(true)
    } else {
      setSelectedSession(session.id)
      setIsReviewMode(false)
    }
  }

  const handleRegenerateClick = (sessionId: string) => {
    setRegeneratingSession(sessionId)
    setShowRegenerateDialog(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{topic.name}</h2>
          <Button onClick={createQuizSession} disabled={isCreatingSession}>
            {isCreatingSession ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Quiz Session"
            )}
          </Button>
        </div>
        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold mb-2">Materials</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{topic.materials}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4">Quiz Sessions</h3>
        <ul className="space-y-3">
          {(topic.sessions || []).map((session) => (
            <li key={session.id} className="flex items-center justify-between rounded-lg border p-4 bg-gray-50">
              <div>
                <span className="font-medium">Session {session.id.slice(-4)}</span>
                <span className="ml-2 text-muted-foreground">
                  {session.completed ? `Score: ${session.score}` : "Not taken"}
                </span>
              </div>
              <div className="flex gap-2">
                {session.completed && (
                  <Button variant="outline" size="sm" onClick={() => handleRegenerateClick(session.id)}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Regenerate
                  </Button>
                )}
                <Button size="sm" onClick={() => handleSessionClick(session)}>
                  {session.completed ? "Review" : "Start"}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-x-4 top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-2xl translate-y-[-50%] rounded-lg border bg-background p-0 shadow-lg mx-auto overflow-auto">
            {isReviewMode ? (
              <QuizReview sessionId={selectedSession} onClose={() => setSelectedSession(null)} />
            ) : (
              <QuizSession
                sessionId={selectedSession}
                onClose={() => setSelectedSession(null)}
                onComplete={fetchTopicDetails}
              />
            )}
          </div>
        </div>
      )}

      <Dialog open={showRegenerateDialog} onOpenChange={setShowRegenerateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Regenerate Quiz</DialogTitle>
            <DialogDescription>
              This will create a new quiz session based on your previous answers. The process takes about 40 seconds.
              Would you like to continue?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowRegenerateDialog(false)} disabled={isRegenerating}>
              Cancel
            </Button>
            <Button onClick={handleRegenerateQuiz} disabled={isRegenerating}>
              {isRegenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                "Regenerate"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

