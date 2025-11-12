import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Heart, MapPin, MessageCircle, Star, CheckCircle, Zap, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: Shield,
      title: "Women-Only Safety",
      description: "Verified profiles and background checks ensure a safe community for women.",
      color: "text-trust"
    },
    {
      icon: Zap,
      title: "AI-Powered Matching",
      description: "Advanced algorithms analyze compatibility based on lifestyle, habits, and preferences.",
      color: "text-primary"
    },
    {
      icon: MessageCircle,
      title: "Voice Preferences",
      description: "Simply speak your preferences instead of filling long forms.",
      color: "text-accent"
    },
    {
      icon: MapPin,
      title: "Location-Based Search",
      description: "Find hostels and roommates in your preferred neighborhoods and cities.",
      color: "text-success"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Happy Matches", icon: Heart },
    { number: "500+", label: "Partner Hostels", icon: MapPin },
    { number: "50+", label: "Cities", icon: Globe },
    { number: "98%", label: "Safety Rating", icon: Shield }
  ];

  const testimonials = [
    {
      name: "Ananya Sharma",
      location: "Mumbai",
      text: "Found my perfect roommate within a week! The compatibility matching is incredible.",
      rating: 5
    },
    {
      name: "Kavya Reddy", 
      location: "Bangalore",
      text: "Love how safe and verified the platform is. Finally found my tribe!",
      rating: 5
    },
    {
      name: "Riya Patel",
      location: "Delhi",
      text: "The voice feature made it so easy to share my preferences. Highly recommend!",
      rating: 5
    }
  ];

  return (
    <div className="py-16 space-y-16">
      {/* Features Section */}
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why Choose Room Buddies?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of roommate matching with our AI-powered platform designed specifically for women.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center shadow-soft hover:shadow-card transition-all duration-300 group">
              <div className={`w-12 h-12 ${feature.color} bg-gradient-to-br from-current/10 to-current/5 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-hero py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-muted-foreground">
              Join the growing community of women finding their perfect living situations.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center shadow-card">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground">
            Simple steps to find your perfect roommate match
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
              1
            </div>
            <h3 className="text-xl font-semibold mb-3">Share Your Preferences</h3>
            <p className="text-muted-foreground">
              Use voice input or fill our compatibility quiz to tell us what you're looking for in a roommate.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
              2
            </div>
            <h3 className="text-xl font-semibold mb-3">Get Matched</h3>
            <p className="text-muted-foreground">
              Our AI analyzes your preferences and finds the most compatible roommates in your area.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-trust rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
              3
            </div>
            <h3 className="text-xl font-semibold mb-3">Connect & Move In</h3>
            <p className="text-muted-foreground">
              Chat with matches, visit hostels together, and find your perfect living situation.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-muted-foreground">
              Real stories from women who found their perfect roommates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 shadow-card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground mb-4 italic">"{testimonial.text}"</p>
                <div className="border-t pt-4">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6">
        <Card className="p-12 text-center bg-gradient-hero shadow-elevated">
          <h2 className="text-4xl font-bold mb-4">Ready to Find Your Room Buddy?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of women who have found their perfect roommates through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" onClick={() => navigate("/dashboard?section=quiz") }>
              <MessageCircle className="w-5 h-5" />
              Start Matching
            </Button>
            <Button variant="outline" size="xl" onClick={() => navigate("/dashboard?section=hostels")}>
              Browse Hostels
              <MapPin className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Features;