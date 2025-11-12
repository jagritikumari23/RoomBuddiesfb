import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Star, Users, Wifi, Car, Coffee, Heart, Share } from "lucide-react";
import { useMemo, useState } from "react";
import { useMatching } from "@/contexts/MatchingContext";
// Hostel image imports
import bljHomesPg from "@/assets/blj-homes-pg-noida-sector-52.jpg";
import high5GirlsPg from "@/assets/high5-girls-pg-noida-sector-16.jpg";
import villaWharfPg from "@/assets/villa-wharf-pg-noida-sector-15.jpg";
import zoloBelindaPg from "@/assets/zolo belinda.jpg";
import h2hGirlsPg from "@/assets/H2h girls pg saket.jpg";
import zoloCherryPg from "@/assets/zolo cherry saket.jpg";
import rajPgAccommodations from "@/assets/raj-pg-accommodations-faridabad-sector-23.jpg";
import mahindraNiwasGirlsPg from "@/assets/mahindra-niwas-pg-faridabad-sector-7-faridabad.jpg";
import ramanHostelAlttc from "@/assets/raman-hostel-alttc-kamla-nehru-nagar-ghaziabad.jpg";
import myroomieNettleHostel from "@/assets/myroomie ghaziabad.jpg";

interface Hostel {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  distance: string;
  priceRange: string;
  amenities: string[];
  description: string;
  availableRooms: number;
  roommateMatches: number;
  location: string;
  phone?: string;
  googleMapsLink: string;
  imageSearchLink: string;
}

const sampleHostels: Hostel[] = [
  // Noida Hostels
  {
    id: "1",
    name: "BLJ Homes PG",
    image: bljHomesPg,
    rating: 4.5,
    reviewCount: 78,
    distance: "1.2 km away",
    priceRange: "₹8,000-₹15,000/month",
    amenities: ["Wifi", "Parking", "Security"],
    description: "Comfortable PG accommodation in Noida Sector 52 with all essential amenities for a pleasant stay.",
    availableRooms: 4,
    roommateMatches: 6,
    location: "Noida Sector 52, Noida",
    phone: "8904182191",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=BLJ+Homes+PG+Noida",
    imageSearchLink: "https://www.google.com/search?tbm=isch&q=BLJ+Homes+PG+Noida"
  },
  {
    id: "2",
    name: "High5 Girls Pg",
    image: high5GirlsPg,
    rating: 4.3,
    reviewCount: 56,
    distance: "2.5 km away",
    priceRange: "₹8,000-₹18,000/month",
    amenities: ["Wifi", "Gym", "Cafe"],
    description: "Premium girls PG in Noida Sector 16 with modern facilities and a focus on safety and comfort.",
    availableRooms: 3,
    roommateMatches: 8,
    location: "Noida Sector 16, Noida",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=High5+Girls+PG+Noida",
    imageSearchLink: "https://www.google.com/search?tbm=isch&q=High5+Girls+PG+Noida"
  },
  {
    id: "3",
    name: "Villa Wharf Pg",
    image: villaWharfPg,
    rating: 4.2,
    reviewCount: 42,
    distance: "1.8 km away",
    priceRange: "₹8,000-₹15,000/month",
    amenities: ["Wifi", "Parking", "Security"],
    description: "Well-maintained PG in Gali No-2 Noida Sector 15 with clean rooms and good amenities.",
    availableRooms: 5,
    roommateMatches: 7,
    location: "Gali No-2 Noida Sector 15, Noida",
    phone: "8460551598",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Villa+Wharf+PG+Noida+Sector+15",
    imageSearchLink: "https://www.google.com/search?tbm=isch&q=Villa+Wharf+PG+Noida+Sector+15"
  },
  
  // Delhi Hostels
  {
    id: "4",
    name: "Zolo Belinda (PG)",
    image: zoloBelindaPg,
    rating: 4.6,
    reviewCount: 92,
    distance: "3.2 km away",
    priceRange: "₹6,000-₹18,000/month",
    amenities: ["Wifi", "Laundry", "Security"],
    description: "Premium PG accommodation in Laxmi Nagar, Delhi with modern amenities and comfortable rooms.",
    availableRooms: 6,
    roommateMatches: 12,
    location: "Laxmi Nagar, Delhi",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Zolo+Belinda+Laxmi+Nagar+Delhi",
    imageSearchLink: "https://www.google.com/search?tbm=isch&q=Zolo+Belinda+Laxmi+Nagar+Delhi"
  },
  {
    id: "5",
    name: "H2h Girls Pg",
    image: h2hGirlsPg,
    rating: 4.4,
    reviewCount: 65,
    distance: "2.7 km away",
    priceRange: "₹7,000-₹15,000/month",
    amenities: ["Wifi", "Gym", "Cafe"],
    description: "Girls PG in Saket area, Delhi with excellent facilities and a safe environment.",
    availableRooms: 4,
    roommateMatches: 9,
    location: "Saket area, Delhi",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=H2h+Girls+PG+Saket+Delhi",
    imageSearchLink: "https://www.google.com/search?tbm=isch&q=H2h+Girls+PG+Saket+Delhi"
  },
  {
    id: "6",
    name: "Zolo Cherry",
    image: zoloCherryPg,
    rating: 4.5,
    reviewCount: 71,
    distance: "4.1 km away",
    priceRange: "₹6,000-₹16,000/month",
    amenities: ["Wifi", "Laundry", "Security"],
    description: "Comfortable PG in Saket/South Delhi with all modern amenities for a pleasant stay.",
    availableRooms: 5,
    roommateMatches: 10,
    location: "Saket / South Delhi",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Zolo+Cherry+PG+Delhi",
    imageSearchLink: "https://www.google.com/search?tbm=isch&q=Zolo+Cherry+PG+Delhi"
  },
  
  // Faridabad Hostels
  {
    id: "7",
    name: "RAJ PG ACCOMMODATIONS",
    image: rajPgAccommodations,
    rating: 4.1,
    reviewCount: 38,
    distance: "2.3 km away",
    priceRange: "₹5,500-₹9,000/month",
    amenities: ["Wifi", "Security"],
    description: "Affordable PG accommodation near Hanuman Mandir Faridabad Sector 23 with basic amenities.",
    availableRooms: 7,
    roommateMatches: 5,
    location: "Near Hanuman Mandir Faridabad Sector 23",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=RAJ+PG+Accommodations+Faridabad+Sector+23",
    imageSearchLink: "https://www.google.com/search?tbm=isch&q=RAJ+PG+Accommodations+Faridabad+Sector+23"
  },
  {
    id: "8",
    name: "Mahindra Niwas Girls Pg",
    image: mahindraNiwasGirlsPg,
    rating: 4.3,
    reviewCount: 54,
    distance: "3.7 km away",
    priceRange: "₹6,000-₹12,000/month",
    amenities: ["Wifi", "Security", "Laundry"],
    description: "Girls PG in Sector 75/Sector 15 areas of Faridabad with good facilities and security.",
    availableRooms: 4,
    roommateMatches: 8,
    location: "Sector 75 / Sector 15 areas, Faridabad",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Mahindra+Niwas+Girls+PG+Faridabad",
    imageSearchLink: "https://www.google.com/search?tbm=isch&q=Mahindra+Niwas+Girls+PG+Faridabad"
  },
  
  // Ghaziabad Hostels
  {
    id: "9",
    name: "Raman Hostel Alttc",
    image: ramanHostelAlttc,
    rating: 4.0,
    reviewCount: 32,
    distance: "1.9 km away",
    priceRange: "₹5,000-₹10,000/month",
    amenities: ["Wifi", "Security"],
    description: "Budget-friendly hostel in NEHRU NAGAR GHAZIABAD with basic amenities for students and professionals.",
    availableRooms: 6,
    roommateMatches: 4,
    location: "NEHRU NAGAR GHAZIABAD",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Raman+Hostel+Nehru+Nagar+Ghaziabad",
    imageSearchLink: "https://www.google.com/search?tbm=isch&q=Raman+Hostel+Ghaziabad"
  },
  {
    id: "10",
    name: "Myroomie Nettle - Hostel",
    image: myroomieNettleHostel,
    rating: 4.4,
    reviewCount: 61,
    distance: "2.8 km away",
    priceRange: "₹6,000-₹13,000/month",
    amenities: ["Wifi", "Security", "Laundry"],
    description: "Modern hostel in Ghaziabad with good facilities and a comfortable living environment.",
    availableRooms: 5,
    roommateMatches: 7,
    location: "Opposite Hari Mandir Ghukna Hindan Vihar, Ghaziabad",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Myroomie+Nettle+Hostel+Ghaziabad",
    imageSearchLink: "https://www.google.com/search?tbm=isch&q=Myroomie+Nettle+Hostel+Ghaziabad"
  }
];

const HostelDiscovery = () => {
  const [savedHostels, setSavedHostels] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "near" | "matches" | "rated" | "women">("all");
  const { likedMatches } = useMatching();

  const toggleSaved = (hostelId: string) => {
    setSavedHostels(prev => 
      prev.includes(hostelId) 
        ? prev.filter(id => id !== hostelId)
        : [...prev, hostelId]
    );
  };

  const parseKm = (distance: string) => {
    // expects like "1.8 km away" -> 1.8
    const m = distance.match(/([0-9]+(?:\.[0-9]+)?)\s*km/i);
    return m ? parseFloat(m[1]) : Number.POSITIVE_INFINITY;
  };

  const filteredHostels = useMemo(() => {
    let list = [...sampleHostels];
    if (activeFilter === "women") {
      list = list.filter(h => /girls|women/i.test(`${h.name} ${h.description}`));
    }
    if (activeFilter === "near") {
      list.sort((a,b) => parseKm(a.distance) - parseKm(b.distance));
    } else if (activeFilter === "matches") {
      list.sort((a,b) => b.roommateMatches - a.roommateMatches);
    } else if (activeFilter === "rated") {
      list.sort((a,b) => b.rating - a.rating);
    }
    return list;
  }, [activeFilter]);

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Discover Perfect Places</h2>
          <p className="text-xl text-muted-foreground">
            Find hostels and co-living spaces with potential roommates nearby
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          <Badge
            variant={activeFilter === 'near' ? 'default' : 'outline'}
            className={`cursor-pointer ${activeFilter === 'near' ? 'bg-primary text-primary-foreground' : 'hover:bg-primary hover:text-primary-foreground'}`}
            onClick={() => setActiveFilter('near')}
          >
            <MapPin className="w-3 h-3 mr-1" />
            Near Me
          </Badge>
          <Badge
            variant={activeFilter === 'matches' ? 'default' : 'outline'}
            className={`cursor-pointer ${activeFilter === 'matches' ? 'bg-primary text-primary-foreground' : 'hover:bg-primary hover:text-primary-foreground'}`}
            onClick={() => setActiveFilter('matches')}
          >
            <Users className="w-3 h-3 mr-1" />
            Most Matches
          </Badge>
          <Badge
            variant={activeFilter === 'rated' ? 'default' : 'outline'}
            className={`cursor-pointer ${activeFilter === 'rated' ? 'bg-primary text-primary-foreground' : 'hover:bg-primary hover:text-primary-foreground'}`}
            onClick={() => setActiveFilter('rated')}
          >
            <Star className="w-3 h-3 mr-1" />
            Highest Rated
          </Badge>
          <Badge
            variant={activeFilter === 'women' ? 'default' : 'outline'}
            className={`cursor-pointer ${activeFilter === 'women' ? 'bg-primary text-primary-foreground' : 'hover:bg-primary hover:text-primary-foreground'}`}
            onClick={() => setActiveFilter('women')}
          >
            Women Only
          </Badge>
          <Badge
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            className={`cursor-pointer ${activeFilter === 'all' ? 'bg-primary text-primary-foreground' : 'hover:bg-primary hover:text-primary-foreground'}`}
            onClick={() => setActiveFilter('all')}
          >
            Clear
          </Badge>
        </div>

        <div className="text-center text-sm text-muted-foreground mb-8">
          Showing {filteredHostels.length} hostels {activeFilter !== 'all' ? `• Filter: ${activeFilter}` : ''}
        </div>

        {/* Hostel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredHostels.map((hostel) => (
            <Card key={hostel.id} className="overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300">
              {/* Image Header */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={hostel.image} 
                  alt={hostel.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white"
                    onClick={() => toggleSaved(hostel.id)}
                  >
                    <Heart className={`w-4 h-4 ${savedHostels.includes(hostel.id) ? 'text-primary fill-primary' : 'text-foreground'}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white"
                  >
                    <Share className="w-4 h-4" />
                  </Button>
                </div>

                {/* Availability Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-success text-white">
                    {hostel.availableRooms} rooms available
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold">{hostel.name}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{hostel.rating}</span>
                    <span className="text-muted-foreground">({hostel.reviewCount})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {hostel.distance}
                  </div>
                  <div className="font-medium text-foreground">
                    {hostel.priceRange}
                  </div>
                </div>

                <p className="text-foreground mb-4 text-sm leading-relaxed">
                  {hostel.description}
                </p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {hostel.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {amenity === "Wifi" && <Wifi className="w-3 h-3 mr-1" />}
                      {amenity === "Parking" && <Car className="w-3 h-3 mr-1" />}
                      {amenity === "Cafe" && <Coffee className="w-3 h-3 mr-1" />}
                      {amenity}
                    </Badge>
                  ))}
                </div>

                {/* Potential Matches (real) */}
                <div className="flex items-center justify-between mb-4 p-3 bg-accent-soft rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-accent" />
                    <div className="flex -space-x-2">
                      {likedMatches.slice(0,5).map((m) => (
                        <Avatar key={m.id} className="w-7 h-7 ring-2 ring-background">
                          {m.image ? (
                            <AvatarImage src={m.image} />
                          ) : (
                            <AvatarFallback>{m.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</AvatarFallback>
                          )}
                        </Avatar>
                      ))}
                      {likedMatches.length === 0 && (
                        <span className="text-xs text-muted-foreground">No matches yet</span>
                      )}
                    </div>
                    <span className="text-sm font-medium ml-2">Potential matches</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-accent hover:text-accent-foreground">
                    View Matches
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => window.open(hostel.googleMapsLink, "_blank")}>
                    View on Map
                  </Button>
                  <Button variant="hero" className="flex-1" onClick={() => alert(`Contact Number: ${hostel.phone || 'Not available'}`)}>
                    Contact
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Hostels
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HostelDiscovery;