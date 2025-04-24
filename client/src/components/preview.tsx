import { useState, memo } from "react";
import { type Content } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
    return (
      <Card className="h-full bg-white/80 backdrop-blur-sm border-gray-100">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-lg">No content to preview yet</p>
        </CardContent>
      </Card>
    );
  }

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
    <Card className="h-full bg-white/80 backdrop-blur-sm border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          {content.type === "article" ? "Article Preview" : "Video Script Preview"}
        </CardTitle>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="border-gray-200 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            aria-label="Copy content to clipboard"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadContent}
            className="border-gray-200 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            aria-label="Download content"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1">
            <TabsTrigger
              value="preview"
              className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
            >
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="raw"
              className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
            >
              Raw
            </TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-6">
            <div className="prose max-w-none text-gray-800 leading-relaxed">
              {content.content.split("\n").map((paragraph, i) => (
                <p key={i} className="mb-4 animate-in fade-in-50 duration-300">
                  {paragraph}
                </p>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="raw" className="mt-6">
            <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg text-gray-700 font-mono border border-gray-200 animate-in fade-in-50 duration-300">
              {content.content}
            </pre>
          </TabsContent>
        </Tabs>

        <div className="text-sm text-gray-500 flex items-center space-x-2">
          <span>Word count:</span>
          <Badge variant="outline" className="border-gray-200">
            {content.metadata.wordCount}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(Preview);