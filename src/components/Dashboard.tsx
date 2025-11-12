import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Calendar, MapPin, Users, Star, Bell } from "lucide-react";
import profile1 from "@/assets/profile-1.jpg";
import profile2 from "@/assets/profile-2.jpg";
import profile3 from "@/assets/profile-3.jpg";
import harmony from "@/assets/harmony.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { useMatching } from "@/contexts/MatchingContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import DatePicker from "@/components/ui/DatePicker";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { likedMatches, compatibilityScore } = useMatching();
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  
  const matches = likedMatches.length > 0
    ? likedMatches.map(m => ({
        id: m.id,
        name: m.name,
        image: m.image || profile1,
        lastMessage: m.preview || "New match",
        time: m.time || "just now",
        unread: m.unread ?? true,
      }))
    : [];

  const savedHostels = [
    { id: "1", name: "Harmony House Co-Living", image: harmony, rating: 4.8, matches: 8 }
  ];

  const recentActivity = [
    { type: "match", message: "You matched with Ujjwal Agarwal", time: "2 hours ago" },
    { type: "message", message: "Himanshi sent you a message", time: "1 day ago" },
    { type: "hostel", message: "New hostel saved: Comfort Inn", time: "2 days ago" }
  ];

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleScheduleTour = () => {
    setModalOpen(true);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      alert(`Tour scheduled for: ${selectedDate.toLocaleString()}`);
      setModalOpen(false);
    } else {
      alert("Please select a date and time.");
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {userName}!</h1>
          <p className="text-muted-foreground">Let's find your perfect roommate match</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <Bell className="w-4 h-4" />
          </Button>
          <Avatar>
            <AvatarImage src={profile1} />
            <AvatarFallback>EM</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 text-center shadow-soft">
          <div className="text-2xl font-bold text-primary mb-2">{matches.length}</div>
          <div className="text-sm text-muted-foreground">Total Matches</div>
        </Card>
        <Card className="p-6 text-center shadow-soft">
          <div className="text-2xl font-bold text-accent mb-2">3</div>
          <div className="text-sm text-muted-foreground">New Messages</div>
        </Card>
        <Card className="p-6 text-center shadow-soft">
          <div className="text-2xl font-bold text-trust mb-2">5</div>
          <div className="text-sm text-muted-foreground">Saved Hostels</div>
        </Card>
        <Card className="p-6 text-center shadow-soft">
          <div className="text-2xl font-bold text-success mb-2">{compatibilityScore !== null ? `${compatibilityScore}%` : "--%"}</div>
          <div className="text-sm text-muted-foreground">Match Score</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Matches */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Matches</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          
          <div className="space-y-4">
            {matches.length === 0 && (
              <Card className="p-6 text-center text-muted-foreground">
                No recent matches yet. Start matching to see them here.
              </Card>
            )}
            {matches.map((match) => (
              <Card key={match.id} className="p-4 shadow-soft hover:shadow-card transition-shadow">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={match.image} />
                    <AvatarFallback>{match.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{match.name}</h3>
                      {match.unread && (
                        <Badge className="bg-primary text-primary-foreground text-xs">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{match.lastMessage}</p>
                    <p className="text-xs text-muted-foreground mt-1">{match.time}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Heart className="w-4 h-4 text-primary" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Saved Hostels */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Saved Hostels</h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedHostels.map((hostel) => (
                <Card key={hostel.id} className="overflow-hidden shadow-soft hover:shadow-card transition-shadow">
                  <div className="h-32 overflow-hidden">
                    <img 
                      src={hostel.image} 
                      alt={hostel.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2">{hostel.name}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{hostel.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-accent">
                        <Users className="w-3 h-3" />
                        <span>{hostel.matches} matches</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => navigate("/dashboard?section=hostels")}>
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6 shadow-soft">
            <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="hero" size="sm" className="w-full justify-start" onClick={() => navigate("/dashboard?section=quiz")}>
                <Users className="w-4 h-4" />
                Find New Matches
              </Button>
              <Button variant="accent" size="sm" className="w-full justify-start" onClick={() => navigate("/dashboard?section=hostels")}>
                <MapPin className="w-4 h-4" />
                Browse Hostels
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleScheduleTour}>
                <Calendar className="w-4 h-4" />
                Schedule Tours
              </Button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6 shadow-soft">
            <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'match' ? 'bg-success' :
                    activity.type === 'message' ? 'bg-primary' : 'bg-accent'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Profile Completion */}
          <Card className="p-6 shadow-soft">
            <h3 className="text-lg font-medium mb-4">Profile Completion</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Profile Progress</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-gradient-primary h-2 rounded-full" style={{width: '85%'}} />
              </div>
              <p className="text-xs text-muted-foreground">
                Add more preferences to improve your matches
              </p>
              <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/dashboard?section=profile")}>
                Complete Profile
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Schedule a Tour</h2>
        <DatePicker selected={selectedDate} onChange={handleDateChange} />
        <Button variant="accent" onClick={handleConfirm} className="mt-4">
          Confirm
        </Button>
      </Modal>
    </div>
  );
};

export default Dashboard;