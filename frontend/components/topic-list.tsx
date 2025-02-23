import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Book } from "lucide-react"

interface Topic {
  id: string
  name: string
}

interface TopicListProps {
  topics: Topic[]
  onSelectTopic: (topic: Topic) => void
  isCollapsed: boolean
  selectedTopic: Topic | null
}

export function TopicList({ topics, onSelectTopic, isCollapsed, selectedTopic }: TopicListProps) {
  return (
    <div className="py-2">
      {topics.map((topic) => (
        <Button
          key={topic.id}
          variant="ghost"
          className={cn(
            "w-full justify-start my-1 relative group",
            isCollapsed ? "px-2" : "px-4",
            selectedTopic?.id === topic.id && "bg-gray-100",
          )}
          onClick={() => onSelectTopic(topic)}
        >
          <Book className={cn("h-5 w-5 shrink-0", isCollapsed ? "mr-0" : "mr-2")} />
          {!isCollapsed && <span className="truncate">{topic.name}</span>}
          {isCollapsed && (
            <div className="absolute left-12 hidden group-hover:block bg-white border rounded-md py-2 px-4 shadow-lg whitespace-nowrap z-10">
              {topic.name}
            </div>
          )}
        </Button>
      ))}
    </div>
  )
}

