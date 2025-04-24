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
          className: "bg-red-50 border-red-200 text-red-800",
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
    <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Topic Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <Skeleton className="h-5 w-1/3 rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-5 w-1/4 rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-5 w-1/5 rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            {data && data.popularity !== undefined ? (
              <>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Popularity Trend</h3>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 flex items-center justify-center gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">{data.popularity}/10</p>
                      <p className="text-xs text-gray-500 mt-1">Relevance Score</p>
                    </div>
                    <div className="h-12 w-px bg-gray-200" />
                    <div className="text-center">
                      <p className="text-3xl font-bold text-indigo-600">{data.trending}/10</p>
                      <p className="text-xs text-gray-500 mt-1">Trending Score</p>
                    </div>
                  </div>
                </div>
                {data.relatedTopics && data.relatedTopics.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Related Topics</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {data.relatedTopics.slice(0, 5).map((item: string, index: number) => (
                        <li key={index} className="hover:text-blue-600 transition-colors duration-200">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {data.keyInsights && data.keyInsights.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Key Insights</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {data.keyInsights.slice(0, 3).map((item: string, index: number) => (
                        <li key={index} className="hover:text-blue-600 transition-colors duration-200">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {data.summary && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Summary</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {data.summary.length > 100
                        ? `${data.summary.substring(0, 100)}...`
                        : data.summary}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-sm italic">
                {topic
                  ? "No insights available for this topic."
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