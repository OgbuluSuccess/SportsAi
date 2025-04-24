import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { type Content, type GenerateContentRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ContentForm from "@/components/content-form";
import Preview from "@/components/preview";
import TopicAnalysis from "@/components/topic-analysis";

export default function Generate() {
  const { toast } = useToast();
  const [generatedContent, setGeneratedContent] = useState<
    Content | undefined
  >();
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
        description: "Your content is ready for review",
        className: "bg-green-50 border-green-200 text-green-800",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error generating content",
        description: error.message,
      });
    },
  });

  const handleSubmit = useCallback(
    (data: GenerateContentRequest) => {
      setCurrentTopic(data.topic);
      setCurrentSport(data.sportType);
      mutation.mutate(data);
    },
    [mutation]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-7xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 sm:text-5xl">
            Generate Sports Content
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Create engaging sports articles and scripts with AI-powered assistance
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          <section className="space-y-8 bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100">
            <ContentForm 
              onSubmit={handleSubmit} 
              isLoading={mutation.isPending}
              className="transition-all duration-300"
            />
            {currentTopic && currentSport && (
              <div className="animate-in fade-in-50 duration-300">
                <TopicAnalysis 
                  topic={currentTopic} 
                  sportType={currentSport} 
                />
              </div>
            )}
          </section>

          <aside className="lg:sticky lg:top-20 max-h-[calc(100vh-5rem)]">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 h-full overflow-auto transition-all duration-300 hover:shadow-xl">
              <Preview content={generatedContent} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}