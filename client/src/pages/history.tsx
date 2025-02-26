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
      description: "Content has been copied to your clipboard"
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="line-clamp-1">{content.topic}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span>{content.type}</span>
            <span>•</span>
            <span>{content.metadata.wordCount} words</span>
            <span>•</span>
            <span>
              {formatDistanceToNow(new Date(content.metadata.created!), { addSuffix: true })}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={downloadContent}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {content.metadata.suggestedTags?.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {content.content}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function History() {
  const { data: contents, isLoading } = useQuery<Content[]>({
    queryKey: ["/api/content"]
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content History</h1>
        <p className="text-muted-foreground">
          View and manage your generated content
        </p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {contents?.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
          {contents?.length === 0 && (
            <p className="text-muted-foreground col-span-2 text-center py-8">
              No content generated yet. Head over to the generate page to create some content!
            </p>
          )}
        </div>
      )}
    </div>
  );
}