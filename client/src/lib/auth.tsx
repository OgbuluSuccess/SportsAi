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

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["auth-user"],
    retry: 1,
    queryFn: async () => {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      if (!res.ok) throw new Error("Not authenticated");
      return res.json();
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const res = await apiRequest("POST", "/api/auth/login", data);
      return res.json();
    },
    onSuccess: (data) => {
      // Set the user data immediately
      queryClient.setQueryData(["auth-user"], data);
      // Force a full refetch to ensure all components have updated data
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });

      // Create a small delay to ensure React Query has time to update state
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
      return res.json();
    },
    onSuccess: (data) => {
      // Set the user data immediately
      queryClient.setQueryData(["auth-user"], data);
      // Force a full refetch to ensure all components have updated data
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });

      // Create a small delay to ensure React Query has time to update state
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
      // Clear user data immediately
      queryClient.setQueryData(["auth-user"], null);
      // Clear all queries to ensure clean state
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
        isLoading,
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
