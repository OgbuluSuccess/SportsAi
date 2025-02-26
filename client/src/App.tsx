import { Switch, Route, Redirect } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "./lib/auth";
import NavBar from "@/components/nav-bar";
import Home from "@/pages/home";
import Generate from "@/pages/generate";
import History from "@/pages/history";
import Auth from "@/pages/auth";
import NotFound from "@/pages/not-found";

function ProtectedRoute(props: { component: () => JSX.Element; path: string }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Redirect to="/auth" />;
  }

  const Component = props.component;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={Auth} />
      <ProtectedRoute path="/" component={Home} />
      <ProtectedRoute path="/generate" component={Generate} />
      <ProtectedRoute path="/history" component={History} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <NavBar />
        <main className="container mx-auto px-4 py-8">
          <Router />
        </main>
      </div>
      <Toaster />
    </AuthProvider>
  );
}

export default App;