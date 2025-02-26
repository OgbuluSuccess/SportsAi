import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { PenBox, History, Home, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const links = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/generate", icon: PenBox, label: "Generate" },
    { href: "/history", icon: History, label: "History" },
  ];

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <a className="text-2xl font-bold text-primary">
                Sports<span className="text-foreground">AI</span>
              </a>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              {links.map(({ href, icon: Icon, label }) => (
                <Link key={href} href={href}>
                  <a className={cn(
                    "flex items-center space-x-2 px-3 py-2 text-sm rounded-md hover:bg-accent",
                    location === href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )}>
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </a>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm text-muted-foreground hidden md:inline-block">
                  {user.username}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logout()}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="ml-2 hidden md:inline-block">Logout</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}