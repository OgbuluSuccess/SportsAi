import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface TopicAnalysisProps {
  topic: string;
  sportType: string;
}

interface AnalysisResponse {
  relevance: number;
  timeliness: number;
  keyAspects: string[];
  relatedSubtopics: string[];
  trendingAngles: string[];
  contentSuggestions: Array<{
    title: string;
    description: string;
    type: "article" | "script";
  }>;
  analysis: string;
}

export default function TopicAnalysis({ topic, sportType }: TopicAnalysisProps) {
  const { toast } = useToast();

  const { data: analysis, isLoading, error } = useQuery<AnalysisResponse>({
    queryKey: ["/api/analyze", topic, sportType],
    enabled: Boolean(topic && sportType),
    queryFn: async () => {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ topic, sportType }),
      });
      if (!res.ok) throw new Error("Failed to analyze topic");
      return res.json();
    }
  });

  if (error) {
    toast({
      variant: "destructive",
      title: "Analysis failed",
      description: error instanceof Error ? error.message : "Failed to analyze topic"
    });
    return null;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Topic Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  const metrics = [
    { name: "Relevance", value: analysis.relevance },
    { name: "Timeliness", value: analysis.timeliness },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="suggestions">Content Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Analysis</h4>
                <p className="text-sm text-muted-foreground">{analysis.analysis}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Key Aspects</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keyAspects.map((aspect, i) => (
                    <Badge key={i} variant="outline">{aspect}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Trending Angles</h4>
                <ScrollArea className="h-[100px]">
                  <div className="space-y-2">
                    {analysis.trendingAngles.map((angle, i) => (
                      <p key={i} className="text-sm">{angle}</p>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="suggestions">
            <div className="space-y-4">
              {analysis.contentSuggestions.map((suggestion, i) => (
                <div key={i} className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    {suggestion.title}
                    <Badge variant="outline">{suggestion.type}</Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {suggestion.description}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
