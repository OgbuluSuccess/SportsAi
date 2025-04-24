import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import { Loader2, User, Mail, Lock, Key } from "lucide-react";

export default function AuthPage() {
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
        className: "bg-red-50 border-red-200 text-red-800",
      });
      setIsLoading(false);
      return;
    }

    try {
      const userData = await login({ username, password });
      
      toast({
        title: "Success!",
        description: "Logged in successfully. Redirecting...",
        className: "bg-green-50 border-green-200 text-green-800",
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error: any) {
      console.error("Login error:", error?.response?.data || error);
      toast({
        title: "Login failed",
        description: error?.response?.data?.error || "Invalid credentials. Please try again.",
        variant: "destructive",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!username || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
        className: "bg-red-50 border-red-200 text-red-800",
      });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
        className: "bg-red-50 border-red-200 text-red-800",
      });
      setIsLoading(false);
      return;
    }

    try {
      const userData = await register({ username, email, password });

      toast({
        title: "Registration successful",
        description: "Your account has been created! Please login.",
        className: "bg-green-50 border-green-200 text-green-800",
      });

      setActiveTab("login");
    } catch (error: any) {
      console.error("Registration error:", error?.response?.data || error);
      toast({
        title: "Registration failed",
        description: error?.response?.data?.error || "Could not create account. Please try again.",
        variant: "destructive",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/95 backdrop-blur-sm border-gray-100 shadow-xl transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="space-y-2 pb-4 text-center">
            <div className="flex justify-center mb-3">
              <div className="rounded-ful bg-gradient-to-r from-blue-600 to-indigo-600 p-3 text-white transform transition-transform duration-300 hover:scale-110">
                <User size={28} />
              </div>
            </div>
            <CardTitle className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Sports AI
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              {activeTab === "login" ? "Sign in to your account" : "Create a new account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs
              defaultValue="login"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1 mb-6">
                <TabsTrigger
                  value="login"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
                      Username
                    </Label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                      <Input
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        required
                        aria-required="true"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                        Password
                      </Label>
                      <a href="#" className="text-xs text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        required
                        aria-required="true"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="reg-username" className="text-sm font-semibold text-gray-700">
                      Username
                    </Label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                      <Input
                        id="reg-username"
                        name="username"
                        placeholder="Choose a username"
                        className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        required
                        aria-required="true"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                      Email
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        required
                        aria-required="true"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="reg-password" className="text-sm font-semibold text-gray-700">
                      Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                      <Input
                        id="reg-password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        required
                        aria-required="true"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                      Confirm Password
                    </Label>
                    <div className="relative group">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        required
                        aria-required="true"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                {activeTab === "login" ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("register")}
                      className="text-blue-600 hover:underline font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("login")}
                      className="text-blue-600 hover:underline font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}