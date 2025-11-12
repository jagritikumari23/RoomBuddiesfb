import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InteractiveBackground from "@/components/InteractiveBackground";
import FloatingElements from "@/components/FloatingElements";
import { AuthProvider } from "@/contexts/AuthContext";
import { MatchingProvider } from "@/contexts/MatchingContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <MatchingProvider>
          <Toaster />
          <Sonner />

          {isLoading && (
            <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center z-50">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
                <p className="text-lg font-semibold text-primary">Loading...</p>
              </div>
            </div>
          )}

          {!isLoading && (
            <>
              <InteractiveBackground />
              <FloatingElements />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/dashboard" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </>
          )}
          </MatchingProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
