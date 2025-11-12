import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import VoiceInput from "@/components/VoiceInput";
import CompatibilityQuiz from "@/components/CompatibilityQuiz";
import RoommateMatching from "@/components/RoommateMatching";
import HostelDiscovery from "@/components/HostelDiscovery";
import Dashboard from "@/components/Dashboard";
import Navigation from "@/components/Navigation";
import UserProfile from "@/components/UserProfile";
import Chat from "@/components/Chat";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isGuest, loading } = useAuth();
  const [currentSection, setCurrentSection] = useState("hero");

  useEffect(() => {
    // If not authenticated and not loading, redirect to landing
    if (!loading && !user && !isGuest) {
      navigate("/");
    }
  }, [user, isGuest, loading, navigate]);

  // Sync currentSection with URL query parameter `section`, e.g., /dashboard?section=hostels
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get("section");
    const validSections = new Set([
      "hero",
      "dashboard",
      "voice",
      "quiz",
      "matching",
      "hostels",
      "profile",
      "chat",
    ]);
    if (section && validSections.has(section)) {
      setCurrentSection(section);
    }
  }, [location.search]);

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <p className="text-lg font-semibold text-primary">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (will redirect)
  if (!user && !isGuest) {
    return null;
  }

  const renderSection = () => {
    switch (currentSection) {
      case "hero":
        return (
          <div>
            <Hero />
            <Features />
          </div>
        );
      case "dashboard":
        return <Dashboard />;
      case "voice":
        return <VoiceInput />;
      case "quiz":
        return <CompatibilityQuiz />;
      case "matching":
        return <RoommateMatching />;
      case "hostels":
        return <HostelDiscovery />;
      case "profile":
        return <UserProfile />;
      case "chat":
        return <Chat />;
      default:
        return (
          <div>
            <Hero />
            <Features />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onNavigate={setCurrentSection} />
      <main className="pt-16 pb-20 md:pb-0">
        {renderSection()}
      </main>
    </div>
  );
};

export default Index;