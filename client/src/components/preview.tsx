import { useState, memo } from "react";
import { type Content } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PreviewProps {
  content?: Content;
}

function Preview({ content }: PreviewProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("preview");

  if (!content) {
    return null;
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content.content);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard",
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
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">
          {content.type === "article" ? "Article" : "Video Script"}
        </CardTitle>
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
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="raw">Raw</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="mt-4">
              <div className="prose max-w-none">
                {content.content.split("\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="raw" className="mt-4">
              <pre className="whitespace-pre-wrap text-sm">
                {content.content}
              </pre>
            </TabsContent>
          </Tabs>

          <div className="text-sm text-muted-foreground">
            Word count: {content.metadata.wordCount}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(Preview);
