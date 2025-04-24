import { useQuery } from "@tanstack/react-query";
import { type Content } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

function ContentCard({ content }: { content: Content }) {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content.content);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard",
      className: "bg-green-50 border-green-200 text-green-800",
    });
  };

  const downloadContent = () => {
    const blob = new Blob([content.content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${content.topic.toLowerCase().replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="group bg-white/80 backdrop-blur-sm border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-2">
          <CardTitle className="text-xl font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
            {content.topic}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span className="capitalize">{content.type}</span>
            <span className="text-gray-300">•</span>
            <span>{content.metadata.wordCount} words</span>
            <span className="text-gray-300">•</span>
            <span>
              {formatDistanceToNow(new Date(content.metadata.created!), { addSuffix: true })}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="border-gray-200 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            aria-label="Copy content to clipboard"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadContent}
            className="border-gray-200 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            aria-label="Download content"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {content.metadata.suggestedTags?.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-200"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <p className="line-clamp-3 text-sm text-gray-600 leading-relaxed">
          {content.content}
        </p>
      </CardContent>
    </Card>
  );
}

export default function History() {
  const { data: contents, isLoading } = useQuery<Content[]>({
    queryKey: ["/api/content"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-7xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 sm:text-5xl">
            Content History
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            View and manage your previously generated sports content
          </p>
        </header>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-white/80 backdrop-blur-sm border-gray-100">
                <CardHeader className="space-y-2">
                  <Skeleton className="h-6 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-1/2 rounded-md" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full rounded-md mb-2" />
                  <Skeleton className="h-4 w-5/6 rounded-md mb-2" />
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents?.map((content) => (
              <div key={content.id} className="animate-in fade-in-50 duration-300">
                <ContentCard content={content} />
              </div>
            ))}
            {contents?.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg italic">
                  No content generated yet. Head over to the generate page to create some content!
                </p>
                <Button
                  asChild
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <a href="/generate">Generate Content</a>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}