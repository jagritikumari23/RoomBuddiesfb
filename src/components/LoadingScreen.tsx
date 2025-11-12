import { useState, useEffect } from "react";
import { Heart, Users, MapPin, Sparkles, Star } from "lucide-react";

const LoadingScreen = ({ onLoadingComplete }: { onLoadingComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  
  const phases = [
    { text: "Initializing AI Magic", icon: Sparkles },
    { text: "Connecting Hearts", icon: Heart },
    { text: "Finding Perfect Matches", icon: Users },
    { text: "Discovering Dream Hostels", icon: MapPin },
    { text: "Welcome to Room Buddies!", icon: Star }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onLoadingComplete, 800);
          return 100;
        }
        
        // Update phase based on progress
        const newPhase = Math.floor(prev / 20);
        if (newPhase !== currentPhase && newPhase < phases.length) {
          setCurrentPhase(newPhase);
        }
        
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentPhase, onLoadingComplete]);

  const CurrentIcon = phases[currentPhase]?.icon || Sparkles;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center z-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-32 h-32 bg-gradient-primary rounded-full opacity-10 animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center space-y-8 px-6 max-w-md mx-auto">
        {/* Logo area with pulsing animation */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-elevated animate-pulse-soft">
            <CurrentIcon className="w-16 h-16 text-white animate-float" />
          </div>
          
          {/* Surrounding hearts animation */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
            {[...Array(8)].map((_, i) => (
              <Heart
                key={i}
                className="absolute w-4 h-4 text-primary/60"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 45}deg) translateY(-60px) rotate(-${i * 45}deg)`,
                  transformOrigin: '50% 60px'
                }}
              />
            ))}
          </div>
        </div>

        {/* Main title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-slide-up">
            Room Buddies
          </h1>
          <p className="text-lg text-muted-foreground animate-slide-up" style={{ animationDelay: '0.2s' }}>
            AI-Powered Roommate Matching
          </p>
        </div>

        {/* Current phase indicator */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-center gap-3">
            <CurrentIcon className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-foreground font-medium">
              {phases[currentPhase]?.text || "Loading..."}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-xs mx-auto">
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-primary transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-sm text-muted-foreground mt-2 font-medium">
              {progress}%
            </div>
          </div>
        </div>

        {/* Floating dots indicator */}
        <div className="flex justify-center gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-pulse"
              style={{ 
                animationDelay: `${i * 0.3}s`,
                animationDuration: '1.5s'
              }}
            />
          ))}
        </div>

        {/* Bottom tagline */}
        <p className="text-sm text-muted-foreground/80 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          Connecting women, creating communities
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;