import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, MapPin, MessageCircle, Sparkles, Play, Star, Shield, Zap, Mic } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";
import ParallaxSection from "./ParallaxSection";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState("");
  const fullText = "Find Your Perfect Room Buddy";

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Background with parallax effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
      <ParallaxSection speed={0.5} className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 transition-transform duration-1000 ease-out"
          style={{ 
            backgroundImage: `url(${heroImage})`,
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        />
      </ParallaxSection>
      
      {/* Dynamic floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => {
          const icons = [Heart, Users, MapPin, Sparkles, Star, Shield, Zap];
          const Icon = icons[i % icons.length];
          return (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${10 + (i * 12) % 80}%`,
                top: `${15 + (i * 8) % 70}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + (i % 3)}s`
              }}
            >
              <div className="bg-primary/10 backdrop-blur-sm rounded-full p-3 border border-primary/20">
                <Icon className={`w-${4 + (i % 2)} h-${4 + (i % 2)} text-primary/60`} />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Main content with enhanced animations */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-6xl mx-auto">
        <Badge className="mb-8 text-sm md:text-base bg-primary/10 text-primary border-primary/20 animate-pulse-soft backdrop-blur-sm">
          ✨ AI-Powered • Verified • Safe for Women
        </Badge>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-primary bg-clip-text text-transparent min-h-[1.2em]">
          {typedText}
          <span className="animate-pulse">|</span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto animate-slide-up leading-relaxed" style={{animationDelay: '0.2s'}}>
          Connect with like-minded women, discover safe co-living spaces, and build lasting friendships through AI-powered compatibility matching.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{animationDelay: '0.4s'}}>
          <Button variant="hero" size="xl" className="group relative overflow-hidden" onClick={() => navigate('/dashboard?section=quiz')}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-primary transition-all duration-300 group-hover:scale-110" />
            <div className="relative flex items-center gap-2">
              <Mic className="w-5 h-5 group-hover:animate-pulse transition-transform" />
              Start Matching
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
          </Button>
          <Button
            variant="outline"
            size="xl"
            className="group backdrop-blur-sm"
            onClick={() => window.open('https://www.youtube.com/watch?v=tFSKcBbeyKA', '_blank')}
          >
            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Watch Demo
            <span className="ml-2 text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">1:20</span>
          </Button>
        </div>
        
        {/* Enhanced Stats Grid with animated counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto animate-slide-up" style={{animationDelay: '0.6s'}}>
          {[
            { number: 10000, label: "Happy Matches", icon: Heart, color: "primary", bgGradient: "bg-gradient-primary", suffix: "+" },
            { number: 500, label: "Partner Hostels", icon: MapPin, color: "accent", bgGradient: "bg-gradient-accent", suffix: "+" },
            { number: 50, label: "Cities", icon: Users, color: "trust", bgGradient: "bg-trust", suffix: "+" },
            { number: 98, label: "Safety Rating", icon: Shield, color: "success", bgGradient: "bg-success", suffix: "%" }
          ].map((stat, index) => (
            <Card key={index} className="p-4 sm:p-6 bg-card/80 backdrop-blur-sm shadow-soft hover:shadow-card transition-all duration-300 group cursor-pointer border-2 hover:border-primary/20">
              <div className="flex items-center justify-center mb-4">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${stat.bgGradient} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                  <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </div>
              <AnimatedCounter
                target={stat.number}
                suffix={stat.suffix}
                className={`text-2xl sm:text-3xl font-bold text-${stat.color} mb-2 group-hover:scale-105 transition-transform`}
              />
              <div className="text-xs sm:text-sm text-muted-foreground font-medium">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-12 animate-slide-up" style={{animationDelay: '0.8s'}}>
          {["Background Verified", "Identity Checked", "24/7 Support", "AI Powered"].map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-trust" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Smooth transition gradients */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-background/30 to-transparent" />
    </div>
  );
};

export default Hero;