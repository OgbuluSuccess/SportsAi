import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { PenBox, History, Home, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function NavBar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const links = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/generate", icon: PenBox, label: "Generate" },
    { href: "/history", icon: History, label: "History" },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = "/auth";
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Top navbar with logo and mobile menu button */}
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Sports<span className="text-gray-900">AI</span>
            </a>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {links.map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href}>
                <a
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                    location === href
                      ? "bg-blue-100 text-blue-800"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </a>
              </Link>
            ))}

            {user && (
              <div className="flex items-center space-x-4 ml-4">
                <span className="text-sm font-medium text-gray-600">
                  {user.username}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            showMobileMenu ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-4 space-y-2 border-t border-gray-100">
            {links.map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href}>
                <a
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200",
                    location === href
                      ? "bg-blue-100 text-blue-800"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500"
                  )}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </a>
              </Link>
            ))}
            
            {user && (
              <div className="border-t border-gray-100 mt-3 pt-3">
                <div className="px-4 py-2 text-sm font-medium text-gray-600">
                  {user.username}
                </div>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    handleLogout();
                  }}
                  className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 w-full text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}