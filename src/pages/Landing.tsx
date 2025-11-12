import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, MapPin, Eye, EyeOff, UserPlus, LogIn, Sparkles, Waves, Chrome } from "lucide-react";
import { useState, useEffect } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const { signInAsGuest, user, isGuest, loading } = useAuth();
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    // If user is already authenticated or in guest mode, redirect to dashboard
    if (!loading && (user || isGuest)) {
      navigate("/dashboard");
    }
  }, [user, isGuest, loading, navigate]);

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <p className="text-lg font-semibold text-primary">Loading...</p>
        </div>
      </div>
    );
  }

  const handleGuestLogin = () => {
    signInAsGuest();
    navigate("/dashboard");
  };

  const handleGoogleSignIn = async () => {
    // We'll implement this when we have the Google OAuth credentials
    navigate("/auth");
  };


  const features = [
    {
      icon: Users,
      title: "Smart Matching",
      description: "AI-powered algorithm finds your perfect roommate match"
    },
    {
      icon: MapPin,
      title: "Hostel Discovery",
      description: "Discover amazing hostels and PGs in your area"
    },
    {
      icon: Heart,
      title: "Community Building",
      description: "Connect with like-minded people and build lasting friendships"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          {/* Logo */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-elevated">
              <Waves className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Room Buddies
              </h1>
              <p className="text-xl text-muted-foreground mt-1">
                AI-Powered Roommate Matching
              </p>
            </div>
          </div>

          {/* Main Tagline */}
          <div className="space-y-4 mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Find Your Perfect
              <span className="block bg-gradient-primary bg-clip-text text-transparent">
                Roommate Match
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with compatible roommates using our intelligent matching system.
              Whether you're looking for a hostel or a shared apartment, we make finding
              the right people effortless.
            </p>
          </div>

          {/* CTA Buttons - Register, Sign In */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              size="lg"
              className="bg-gradient-primary hover:opacity-90 text-white px-8 py-3 text-lg font-semibold shadow-elevated"
              onClick={() => navigate("/auth?tab=signup")}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Register
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg font-semibold border-2 hover:bg-accent/10"
              onClick={() => navigate("/auth?tab=signin")}
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </Button>
          </div>

          {/* Try as Guest Button with similar outline styling */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg font-semibold border-2 hover:bg-accent/10"
              onClick={handleGuestLogin}
            >
              <Eye className="w-5 h-5 mr-2" />
              Try as Guest
            </Button>
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Join thousands of happy roommates who found their perfect match
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Powered by AI • Trusted by students and professionals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;