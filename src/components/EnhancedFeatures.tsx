import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Users, 
  Heart, 
  MapPin, 
  MessageCircle, 
  Star, 
  Zap, 
  Globe,
  CheckCircle,
  Award,
  TrendingUp,
  Video,
  Lock,
  Verified
} from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";
import ParallaxSection from "./ParallaxSection";

const EnhancedFeatures = () => {
  const [activeTab, setActiveTab] = useState("features");
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([]);
  const featuresRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: Shield,
      title: "Women-Only Safety",
      description: "Verified profiles, background checks, and 24/7 support ensure a completely safe community.",
      color: "text-trust",
      gradient: "from-trust/20 to-trust/5",
      stats: "98% Safety Rating"
    },
    {
      icon: Zap,
      title: "AI-Powered Matching",
      description: "Advanced machine learning algorithms analyze 50+ compatibility factors for perfect matches.",
      color: "text-primary",
      gradient: "from-primary/20 to-primary/5",
      stats: "94% Match Accuracy"
    },
    {
      icon: MessageCircle,
      title: "Voice Preferences",
      description: "Simply speak your preferences in any language. Our AI understands context and emotions.",
      color: "text-accent",
      gradient: "from-accent/20 to-accent/5",
      stats: "5 Languages Supported"
    },
    {
      icon: MapPin,
      title: "Smart Location",
      description: "Find hostels and roommates based on your work, study, and lifestyle preferences.",
      color: "text-success",
      gradient: "from-success/20 to-success/5",
      stats: "50+ Cities Available"
    },
    {
      icon: Video,
      title: "Virtual Tours",
      description: "Take immersive 360° virtual tours of hostels before visiting in person.",
      color: "text-purple-600",
      gradient: "from-purple-600/20 to-purple-600/5",
      stats: "HD Quality Tours"
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "End-to-end encryption, anonymous browsing, and complete control over your data.",
      color: "text-indigo-600",
      gradient: "from-indigo-600/20 to-indigo-600/5",
      stats: "Zero Data Tracking"
    }
  ];

  const stats = [
    { number: 10000, label: "Happy Matches", icon: Heart, suffix: "+" },
    { number: 500, label: "Partner Hostels", icon: MapPin, suffix: "+" },
    { number: 50, label: "Cities", icon: Globe, suffix: "+" },
    { number: 98, label: "Safety Rating", icon: Shield, suffix: "%" },
    { number: 94, label: "Match Accuracy", icon: Award, suffix: "%" },
    { number: 24, label: "Support Hours", icon: Shield, suffix: "/7" }
  ];

  const testimonials = [
    {
      name: "Ananya Sharma",
      location: "Mumbai",
      text: "Found my perfect roommate within a week! The compatibility matching is incredible. We're now best friends!",
      rating: 5,
      image: "/api/placeholder/60/60",
      verified: true
    },
    {
      name: "Kavya Reddy", 
      location: "Bangalore",
      text: "Love how safe and verified the platform is. The background checks gave me complete peace of mind.",
      rating: 5,
      image: "/api/placeholder/60/60",
      verified: true
    },
    {
      name: "Riya Patel",
      location: "Delhi",
      text: "The voice feature made it so easy! Just spoke my preferences and got matched with amazing people.",
      rating: 5,
      image: "/api/placeholder/60/60",
      verified: true
    },
    {
      name: "Priya Gupta",
      location: "Pune",
      text: "Virtual tours saved so much time. Could see multiple hostels from home before deciding to visit.",
      rating: 5,
      image: "/api/placeholder/60/60",
      verified: true
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleFeatures(prev => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.2 }
    );

    const featureCards = featuresRef.current?.querySelectorAll('[data-index]');
    featureCards?.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="py-20 space-y-24">
      {/* Enhanced Features Section */}
      <ParallaxSection speed={0.3}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              ✨ Platform Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Why Choose Room Buddies?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Experience the future of roommate matching with our AI-powered platform designed specifically for women's safety and comfort.
            </p>
          </div>

          <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                data-index={index}
                className={`p-8 text-center shadow-soft hover:shadow-card transition-all duration-500 group cursor-pointer border-2 hover:border-primary/20 ${
                  visibleFeatures.includes(index) ? 'animate-bounce-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 ${feature.color} bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <Badge variant="outline" className="text-xs font-medium">
                  {feature.stats}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Enhanced Stats Section */}
      <div className="bg-gradient-hero py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Trusted by Thousands</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join the fastest-growing community of women finding their perfect living situations.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center shadow-card bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <AnimatedCounter
                  target={stat.number}
                  suffix={stat.suffix}
                  className="text-2xl md:text-3xl font-bold text-primary mb-2"
                />
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works with Progress */}
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">
            📱 Simple Process
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From voice input to moving in - just 3 simple steps to find your perfect roommate
          </p>
        </div>

        <div className="relative">
          {/* Progress Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-primary rounded-full transform -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {[
              {
                step: "1",
                title: "Share Your Preferences",
                description: "Use voice input or fill our smart compatibility quiz. Our AI understands your lifestyle, habits, and preferences.",
                color: "primary",
                icon: MessageCircle
              },
              {
                step: "2", 
                title: "Get AI Matches",
                description: "Our advanced algorithm analyzes compatibility across 50+ factors to find your perfect roommate matches.",
                color: "accent",
                icon: Zap
              },
              {
                step: "3",
                title: "Connect & Move In",
                description: "Chat with matches, take virtual tours, visit hostels together, and find your dream living situation.",
                color: "trust",
                icon: Heart
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className={`relative w-20 h-20 bg-gradient-${step.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <span className="text-white font-bold text-2xl">{step.step}</span>
                  <div className="absolute inset-0 rounded-full animate-glow" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Testimonials with Tabs */}
      <div className="bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-success/10 text-success border-success/20">
              💬 User Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Users Say</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real stories from women who found their perfect roommates and dream living spaces
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-2 w-full mb-12">
              <TabsTrigger value="features" className="text-lg">Success Stories</TabsTrigger>
              <TabsTrigger value="video" className="text-lg">Video Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="features">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="p-8 shadow-card hover:shadow-elevated transition-all duration-300">
                    <div className="flex items-center mb-6">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{testimonial.name}</h4>
                          {testimonial.verified && (
                            <Verified className="w-4 h-4 text-trust" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-foreground italic leading-relaxed">"{testimonial.text}"</p>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="video">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="relative overflow-hidden aspect-video bg-gradient-hero">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button variant="hero" size="lg" className="animate-pulse">
                      <Video className="w-6 h-6 mr-2" />
                      Play Review
                    </Button>
                  </div>
                </Card>
                <Card className="relative overflow-hidden aspect-video bg-gradient-accent">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button variant="accent" size="lg" className="animate-pulse">
                      <Video className="w-6 h-6 mr-2" />
                      Success Story
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="container mx-auto px-6">
        <Card className="p-12 md:p-16 text-center bg-gradient-hero shadow-elevated relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 animate-float">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute top-8 right-8 animate-float" style={{animationDelay: '1s'}}>
              <Users className="w-6 h-6 text-accent" />
            </div>
            <div className="absolute bottom-8 left-8 animate-float" style={{animationDelay: '2s'}}>
              <MapPin className="w-10 h-10 text-trust" />
            </div>
          </div>
          
          <div className="relative z-10">
            <Badge className="mb-8 bg-primary/20 text-primary border-primary/30">
              🚀 Ready to Start?
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Room Buddy?</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Join thousands of women who have found their perfect roommates and created lasting friendships through our AI-powered platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Button variant="hero" size="xl" className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-primary transition-all duration-300 group-hover:scale-110" />
                <div className="relative flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 group-hover:animate-pulse" />
                  Start Voice Matching
                  <Badge className="bg-white/20 text-white ml-2">Free</Badge>
                </div>
              </Button>
              <Button variant="outline" size="xl" className="group">
                <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Browse Hostels
                <TrendingUp className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>No hidden fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedFeatures;