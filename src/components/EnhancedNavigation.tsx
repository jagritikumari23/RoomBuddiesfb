import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  Users,
  MapPin,
  MessageCircle,
  User,
  Bell,
  Menu,
  Heart,
  Search,
  Settings,
  LogOut,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const EnhancedNavigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [notifications, setNotifications] = useState(3);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "matching", label: "Matching", icon: Heart },
    { id: "hostels", label: "Hostels", icon: MapPin },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "dashboard", label: "Dashboard", icon: User }
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    // Scroll to section or navigate
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-soft" 
          : "bg-transparent"
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Room Buddies
                </h1>
                <p className="text-xs text-muted-foreground">AI-Powered Matching</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                  {item.id === "messages" && notifications > 0 && (
                    <Badge className="bg-accent text-accent-foreground text-xs">
                      {notifications}
                    </Badge>
                  )}
                </button>
              ))}
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="w-4 h-4" />
                {notifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
                )}
              </Button>
              
              <Button variant="outline" size="icon" className="lg:hidden">
                <Search className="w-4 h-4" />
              </Button>

              <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-gradient-primary text-white">RB</AvatarFallback>
              </Avatar>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="space-y-6">
                    {/* User Profile */}
                    <div className="flex items-center gap-4 p-4 bg-gradient-hero rounded-lg">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="/placeholder-avatar.jpg" />
                        <AvatarFallback className="bg-gradient-primary text-white">RB</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">Welcome back!</h3>
                        <p className="text-sm text-muted-foreground">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest'}</p>
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="space-y-2">
                      {navItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            activeSection === item.id
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                          {item.id === "messages" && notifications > 0 && (
                            <Badge className="bg-accent text-accent-foreground ml-auto">
                              {notifications}
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-3 pt-6 border-t">
                      <Button variant="hero" className="w-full justify-start">
                        <Sparkles className="w-4 h-4" />
                        Start Matching
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="w-4 h-4" />
                        Settings
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/90 backdrop-blur-lg border-t border-border">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200 ${
                activeSection === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <item.icon className="w-5 h-5" />
                {item.id === "messages" && notifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full" />
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Spacer for fixed navigation */}
      <div className="h-16" />
      <div className="h-20 lg:hidden" />
    </>
  );
};

export default EnhancedNavigation;