import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, PenBox, History } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          AI-Powered Sports Content Generation
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Generate professional sports articles and video scripts with AI assistance
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenBox className="h-5 w-5" />
              Generate Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Create engaging sports articles and video scripts using advanced AI
            </p>
            <Link href="/generate">
              <Button className="w-full">
                Start Creating
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              View History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Access your previously generated content and scripts
            </p>
            <Link href="/history">
              <Button variant="outline" className="w-full">
                View History
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
