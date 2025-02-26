import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { type Content, type GenerateContentRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ContentForm from "@/components/content-form";
import Preview from "@/components/preview";
import TopicAnalysis from "@/components/topic-analysis";

export default function Generate() {
  const { toast } = useToast();
  const [generatedContent, setGeneratedContent] = useState<Content>();
  const [currentTopic, setCurrentTopic] = useState<string>("");
  const [currentSport, setCurrentSport] = useState<string>("");

  const mutation = useMutation({
    mutationFn: async (data: GenerateContentRequest) => {
      const res = await apiRequest("POST", "/api/generate", data);
      return res.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(data);
      toast({
        title: "Content generated successfully",
        description: "Your content is ready for review"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error generating content",
        description: error.message
      });
    }
  });

  const handleSubmit = (data: GenerateContentRequest) => {
    setCurrentTopic(data.topic);
    setCurrentSport(data.sportType);
    mutation.mutate(data);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Generate Content</h1>
        <p className="text-muted-foreground">
          Create engaging sports content with AI assistance
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <ContentForm
            onSubmit={handleSubmit}
            isLoading={mutation.isPending}
          />
          {currentTopic && currentSport && (
            <TopicAnalysis topic={currentTopic} sportType={currentSport} />
          )}
        </div>

        <div className="lg:h-[calc(100vh-12rem)] sticky top-8">
          <Preview content={generatedContent} />
        </div>
      </div>
    </div>
  );
}