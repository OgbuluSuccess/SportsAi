import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface TopicSuggestionsProps {
  sport: string;
  onSelect: (topic: string) => void;
}

interface TopicSuggestionsResponse {
  topics: string[];
}

export default function TopicSuggestions({ sport, onSelect }: TopicSuggestionsProps) {
  const { data, isLoading } = useQuery<TopicSuggestionsResponse>({
    queryKey: ["/api/suggestions", sport],
    enabled: !!sport
  });

  if (isLoading) {
    return (
      <div className="mt-2 space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!data?.topics?.length) {
    return null;
  }

  return (
    <ScrollArea className="mt-2 h-24">
      <div className="space-y-2">
        {data.topics.map((topic: string, index: number) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => onSelect(topic)}
          >
            {topic}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}