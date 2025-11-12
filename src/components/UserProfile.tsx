import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save, User, X } from "lucide-react";

// List of all Indian states and union territories
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
  "Delhi",
  "Puducherry",
  "Jammu and Kashmir",
  "Ladakh"
];

const UserProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.user_metadata?.avatar_url || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  // Initialize form state with user data or defaults
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    phone: user?.user_metadata?.phone || "",
    bio: user?.user_metadata?.bio || "",
    occupation: user?.user_metadata?.occupation || "",
    location: user?.user_metadata?.location || "",
    sleepSchedule: user?.user_metadata?.sleepSchedule || "regular",
    cleanliness: user?.user_metadata?.cleanliness || "moderate",
    socialLevel: user?.user_metadata?.socialLevel || "balanced"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    setAvatarFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user's profile in the database
    console.log("Profile updated:", formData);
    console.log("Avatar file:", avatarFile);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Button 
            variant={isEditing ? "outline" : "hero"} 
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        <Card className="p-6 shadow-card">
          <form onSubmit={handleSubmit}>
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback className="text-2xl">
                    {formData.fullName ? formData.fullName.charAt(0) : "U"}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute -bottom-2 -right-2 flex gap-1">
                    <Button 
                      type="button"
                      variant="outline" 
                      size="icon" 
                      className="rounded-full"
                      onClick={handleAvatarClick}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                    {(avatarUrl || user?.user_metadata?.avatar_url) && (
                      <Button 
                        type="button"
                        variant="outline" 
                        size="icon" 
                        className="rounded-full"
                        onClick={handleRemoveAvatar}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        disabled
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Email can't be changed
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold">{formData.fullName || "User"}</h2>
                    <p className="text-muted-foreground">{formData.email}</p>
                    <p className="text-sm mt-2">{formData.bio || "No bio added yet"}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p className="py-2">{formData.phone || "Not provided"}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                {isEditing ? (
                  <Select 
                    value={formData.location} 
                    onValueChange={(value) => handleSelectChange("location", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="py-2">{formData.location || "Not provided"}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="occupation">Occupation</Label>
                {isEditing ? (
                  <Input
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    placeholder="Enter your occupation"
                  />
                ) : (
                  <p className="py-2">{formData.occupation || "Not provided"}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="sleepSchedule">Sleep Schedule</Label>
                {isEditing ? (
                  <Select 
                    value={formData.sleepSchedule} 
                    onValueChange={(value) => handleSelectChange("sleepSchedule", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="early">Early Bird (9 PM - 6 AM)</SelectItem>
                      <SelectItem value="regular">Regular (11 PM - 7 AM)</SelectItem>
                      <SelectItem value="late">Night Owl (1 AM - 9 AM)</SelectItem>
                      <SelectItem value="irregular">Irregular/Shift Work</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="py-2">
                    {formData.sleepSchedule === "early" && "Early Bird (9 PM - 6 AM)"}
                    {formData.sleepSchedule === "regular" && "Regular (11 PM - 7 AM)"}
                    {formData.sleepSchedule === "late" && "Night Owl (1 AM - 9 AM)"}
                    {formData.sleepSchedule === "irregular" && "Irregular/Shift Work"}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="cleanliness">Cleanliness</Label>
                {isEditing ? (
                  <Select 
                    value={formData.cleanliness} 
                    onValueChange={(value) => handleSelectChange("cleanliness", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="very">Very Clean</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="relaxed">Relaxed</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="py-2">
                    {formData.cleanliness === "very" && "Very Clean"}
                    {formData.cleanliness === "moderate" && "Moderate"}
                    {formData.cleanliness === "relaxed" && "Relaxed"}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="socialLevel">Social Level</Label>
                {isEditing ? (
                  <Select 
                    value={formData.socialLevel} 
                    onValueChange={(value) => handleSelectChange("socialLevel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social">Very Social</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="quiet">Prefer Quiet</SelectItem>
                      <SelectItem value="private">Private Person</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="py-2">
                    {formData.socialLevel === "social" && "Very Social"}
                    {formData.socialLevel === "balanced" && "Balanced"}
                    {formData.socialLevel === "quiet" && "Prefer Quiet"}
                    {formData.socialLevel === "private" && "Private Person"}
                  </p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="mb-8">
              <Label htmlFor="bio">Bio</Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              ) : (
                <p className="py-2">{formData.bio || "No bio added yet"}</p>
              )}
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-end">
                <Button type="submit" variant="hero">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;