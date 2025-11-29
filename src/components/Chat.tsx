// src/components/Chat.tsx
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMatching } from "@/contexts/MatchingContext";
import { sendMessage, subscribeToMessages, Message } from "@/services/chatService";

const Chat = () => {
  const { user } = useAuth();
  const { likedMatches } = useMatching();
  const [params] = useSearchParams();
  const matchId = params.get("matchId") || "unknown";
  const userId = user?.id || "guest";
  
  // Generate deterministic room ID
  const roomId = [userId, matchId].sort().join('_');
  const match = likedMatches.find(m => m.id === matchId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to messages
  useEffect(() => {
    const unsubscribe = subscribeToMessages(roomId, (updatedMessages) => {
      setMessages(updatedMessages);
    });

    return () => unsubscribe();
  }, [roomId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    const content = messageText.trim();
    if (!content || !userId) return;

    try {
      await sendMessage(roomId, userId, content);
      setMessageText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto px-6 py-6 max-w-4xl">
      <Card className="p-4 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
          {match?.image && (
            <img 
              src={match.image} 
              alt={match.name} 
              className="w-full h-full object-cover" 
            />
          )}
        </div>
        <div className="flex-1">
          <div className="font-semibold">{match?.name || "Chat"}</div>
          <div className="text-xs text-muted-foreground">
            {match ? "Online" : "Offline"} • Room: {roomId.slice(0, 8)}
          </div>
        </div>
        {match?.matchPercentage != null && (
          <Badge className="bg-success text-white">
            {match.matchPercentage}% match
          </Badge>
        )}
      </Card>

      <Card className="h-[70vh] flex flex-col">
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Start the conversation with {match?.name || "your match"}!
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.senderId === userId
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="text-sm">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t flex gap-2">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!messageText.trim()}
          >
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
