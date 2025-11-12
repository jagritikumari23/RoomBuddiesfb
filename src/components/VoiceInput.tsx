import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Volume2, CheckCircle } from "lucide-react";
import { useState } from "react";

const VoiceInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);

  const samplePreferences = [
    "I prefer quiet environments for studying",
    "I love cooking and sharing meals",
    "I'm a morning person who wakes up early",
    "I enjoy having friends over occasionally",
    "I prefer a clean and organized living space"
  ];

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice input with sample preference
      setTimeout(() => {
        const randomPref = samplePreferences[Math.floor(Math.random() * samplePreferences.length)];
        setTranscript(randomPref);
        setIsListening(false);
      }, 3000);
    }
  };

  const addPreference = () => {
    if (transcript && !preferences.includes(transcript)) {
      setPreferences([...preferences, transcript]);
      setTranscript("");
    }
  };

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Tell Us Your Preferences</h2>
        <p className="text-xl text-muted-foreground">
          Use your voice to share what you're looking for in a roommate
        </p>
      </div>

      <Card className="max-w-4xl mx-auto p-8 shadow-card">
        <div className="text-center mb-8">
          <div className={`relative inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 transition-all duration-300 ${
            isListening 
              ? 'bg-gradient-primary animate-pulse-soft shadow-elevated' 
              : 'bg-muted hover:bg-gradient-primary/20'
          }`}>
            <Button
              variant="ghost"
              size="icon"
              className="w-full h-full rounded-full"
              onClick={toggleListening}
            >
              {isListening ? (
                <MicOff className="w-12 h-12 text-white" />
              ) : (
                <Mic className="w-12 h-12" />
              )}
            </Button>
            
            {isListening && (
              <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
            )}
          </div>

          <h3 className="text-2xl font-semibold mb-2">
            {isListening ? "Listening..." : "Tap to speak"}
          </h3>
          <p className="text-muted-foreground">
            {isListening 
              ? "Tell us about your ideal living situation" 
              : "Share your preferences, habits, and what you're looking for"
            }
          </p>
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <div className="flex items-start gap-3">
              <Volume2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-foreground">{transcript}</p>
                <Button 
                  onClick={addPreference}
                  className="mt-3"
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Add Preference
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Saved Preferences */}
        {preferences.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Your Preferences:</h4>
            <div className="space-y-2">
              {preferences.map((pref, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 bg-accent-soft rounded-lg animate-slide-up"
                >
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>{pref}</span>
                </div>
              ))}
            </div>
            
            {preferences.length >= 3 && (
              <Button variant="hero" size="lg" className="w-full mt-6">
                Find My Perfect Roommates
              </Button>
            )}
          </div>
        )}

        {/* Quick Suggestions */}
        {preferences.length === 0 && !transcript && (
          <div className="mt-8">
            <h4 className="text-lg font-medium mb-4 text-center">Or try these examples:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {samplePreferences.slice(0, 4).map((pref, index) => (
                <button
                  key={index}
                  onClick={() => setTranscript(pref)}
                  className="p-3 text-left border border-border rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm text-muted-foreground">"{pref}"</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default VoiceInput;