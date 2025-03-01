import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type User, type InsertUser, type LoginRequest } from "@shared/schema";
import { apiRequest, queryClient } from "./queryClient";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: InsertUser) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  const { data: user, isLoading: authIsLoading } = useQuery<User>({
    queryKey: ["auth-user"],
    retry: 1,
    queryFn: async () => {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
      if (!res.ok) {
        console.log("Auth check failed:", res.status, res.statusText);
        return null; //Instead of throwing error, return null if not authenticated.
      }
      return res.json();
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const res = await apiRequest("POST", "/api/auth/login", data);
      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = errorData.message || res.statusText;
        console.error("Login failed:", errorMessage);
        throw new Error(errorMessage);
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["auth-user"], data);
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      setTimeout(() => {
        toast({
          title: "Welcome back!",
          description: "Successfully logged in",
        });
      }, 100);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      const res = await apiRequest("POST", "/api/auth/register", data);
      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = errorData.message || res.statusText;
        console.error("Registration failed:", errorMessage);
        throw new Error(errorMessage);
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["auth-user"], data);
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      setTimeout(() => {
        toast({
          title: "Welcome!",
          description: "Account created successfully",
        });
      }, 100);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message,
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth-user"], null);
      queryClient.clear();
      toast({
        title: "Goodbye!",
        description: "Successfully logged out",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading: authIsLoading,
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
