"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { TopicList } from "@/components/topic-list"
import { TopicDetails } from "@/components/topic-details"
import { Settings2, Book, Plus, Loader2, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Dashboard() {
  const [topics, setTopics] = useState([])
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [showNewTopic, setShowNewTopic] = useState(false)
  const [newTopic, setNewTopic] = useState({ name: "", materials: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingTopic, setIsCreatingTopic] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchTopics()
  }, [])

  const fetchTopics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("https://maths-quizzer-production.up.railway.app/api/quiz/topics", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      if (response.ok) {
        setTopics(data.data)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch topics",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching topics",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createTopic = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreatingTopic(true)
    try {
      const response = await fetch("https://maths-quizzer-production.up.railway.app/api/quiz/topic/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newTopic),
      })
      const data = await response.json()
      if (response.ok) {
        toast({
          title: "Success",
          description: "Topic created successfully",
        })
        setNewTopic({ name: "", materials: "" })
        setShowNewTopic(false)
        await fetchTopics()
        // Automatically select the newly created topic
        setSelectedTopic(data.data)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create topic",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the topic",
        variant: "destructive",
      })
    } finally {
      setIsCreatingTopic(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userData")
    router.push("/")
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle button */}
      <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 md:hidden" onClick={toggleMobileSidebar}>
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r flex flex-col transition-all duration-300 ease-in-out fixed md:relative z-40",
          isSidebarCollapsed ? "w-16" : "w-64",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="p-4 border-b flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Settings2 className="h-6 w-6 text-primary shrink-0" />
            {!isSidebarCollapsed && <span className="font-bold text-lg">Mathy</span>}
          </div>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8 hidden md:flex">
            <Book className={cn("h-4 w-4 transition-transform", isSidebarCollapsed ? "rotate-180" : "rotate-0")} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 flex items-center justify-between">
            {!isSidebarCollapsed && <span className="text-sm font-medium">Topics</span>}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedTopic(null)
                setShowNewTopic(true)
                setIsMobileSidebarOpen(false)
              }}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <TopicList
              topics={topics}
              onSelectTopic={(topic) => {
                setSelectedTopic(topic)
                setShowNewTopic(false)
                setIsMobileSidebarOpen(false)
              }}
              isCollapsed={isSidebarCollapsed}
              selectedTopic={selectedTopic}
            />
          )}
        </div>

        <Button onClick={handleLogout} variant="ghost" className={cn("m-4", isSidebarCollapsed && "px-0")}>
          {isSidebarCollapsed ? "×" : "Logout"}
        </Button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {showNewTopic ? (
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Create New Topic</h2>
              <form onSubmit={createTopic} className="space-y-4">
                <div>
                  <Label htmlFor="topicName">Topic Name</Label>
                  <Input
                    id="topicName"
                    value={newTopic.name}
                    onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="topicMaterials">Materials</Label>
                  <Textarea
                    id="topicMaterials"
                    value={newTopic.materials}
                    onChange={(e) => setNewTopic({ ...newTopic, materials: e.target.value })}
                    className="min-h-[150px] md:min-h-[200px]"
                    required
                  />
                </div>
                <div className="flex flex-col md:flex-row justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewTopic(false)}
                    className="w-full md:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreatingTopic} className="w-full md:w-auto">
                    {isCreatingTopic ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Topic...
                      </>
                    ) : (
                      "Create Topic"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          ) : selectedTopic ? (
            <TopicDetails key={selectedTopic.id} topic={selectedTopic} />
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] md:h-[80vh] text-center">
              <Book className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl md:text-2xl font-bold mb-2">Welcome to Mathy</h2>
              <p className="text-muted-foreground mb-4">
                Select a topic from the sidebar or create a new one to get started.
              </p>
              <Button onClick={() => setShowNewTopic(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Topic
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

