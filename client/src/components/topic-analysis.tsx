import { useState, useEffect, memo } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface TopicAnalysisProps {
  topic: string;
  sportType: string;
}

function TopicAnalysis({ topic, sportType }: TopicAnalysisProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!topic || topic.trim() === "") return;

      setIsLoading(true);
      try {
        const response = await axios.get(
          `/api/topic-analysis?topic=${encodeURIComponent(
            topic
          )}&sportType=${encodeURIComponent(sportType)}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching topic analysis:", error);
        toast({
          title: "Error",
          description: "Failed to load topic analysis. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [topic, sportType, toast]);

  if (!topic || topic.trim() === "") {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Topic Insights</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {data && data.popularity !== undefined ? (
              <>
                <div>
                  <h3 className="font-medium">Popularity Trend</h3>
                  <div className="h-32 w-full bg-muted rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{data.popularity}/10</p>
                      <p className="text-xs text-muted-foreground">
                        Relevance Score
                      </p>
                    </div>
                    <div className="mx-4 border-r h-16"></div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{data.trending}/10</p>
                      <p className="text-xs text-muted-foreground">
                        Trending Score
                      </p>
                    </div>
                  </div>
                </div>
                {data.relatedTopics && data.relatedTopics.length > 0 && (
                  <div>
                    <h3 className="font-medium">Related Topics</h3>
                    <ul className="list-disc list-inside text-sm">
                      {data.relatedTopics
                        .slice(0, 5)
                        .map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                    </ul>
                  </div>
                )}
                {data.keyInsights && data.keyInsights.length > 0 && (
                  <div>
                    <h3 className="font-medium">Key Insights</h3>
                    <ul className="list-disc list-inside text-sm">
                      {data.keyInsights
                        .slice(0, 3)
                        .map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                    </ul>
                  </div>
                )}
                {data.summary && (
                  <div>
                    <h3 className="font-medium">Summary</h3>
                    <p className="text-sm text-muted-foreground">
                      {data.summary.length > 100
                        ? `${data.summary.substring(0, 100)}...`
                        : data.summary}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                {topic
                  ? "Loading insights for this topic..."
                  : "Select a topic to see insights"}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default memo(TopicAnalysis);
