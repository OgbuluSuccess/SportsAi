import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, PenBox, History } from "lucide-react";

export default function Home() {
  const handleLinkClick = (destination: string, event: React.MouseEvent) => {
    console.log(`Link clicked: Navigating to ${destination}`, event);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
      <div className="container max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 md:text-6xl">
            AI-Powered Sports Content
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Create professional sports articles and video scripts with cutting-edge AI technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="group bg-white/80 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <PenBox className="h-6 w-6 text-blue-600" />
                Generate Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600 leading-relaxed">
                Craft engaging sports articles and video scripts with advanced AI technology
              </p>
              <Link
                href="/generate"
                onClick={(e) => handleLinkClick("/generate", e)}
                className="group/link inline-flex w-full items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:ring-2 hover:ring-blue-500 hover:ring-offset-2"
                aria-label="Start creating content"
              >
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </CardContent>
          </Card>

          <Card className="group bg-white/80 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <History className="h-6 w-6 text-blue-600" />
                View History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600 leading-relaxed">
                Browse and manage your previously generated content and scripts
              </p>
              <Link
                to="/history"
                onClick={(e) => handleLinkClick("/history", e)}
                className="group/link inline-flex w-full items-center justify-center border border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold py-3 px-4 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:ring-2 hover:ring-blue-500 hover:ring-offset-2"
                aria-label="View content history"
              >
                View History
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}