import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMatching } from "@/contexts/MatchingContext";

interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  ts: number;
}

const Chat = () => {
  const { user } = useAuth();
  const { likedMatches } = useMatching();
  const [params] = useSearchParams();
  const matchId = params.get("matchId") || "unknown";
  const me = user?.id || "guest";
  const room = useMemo(() => {
    // deterministic room id between two parties (current user and match)
    const ids = [me, matchId].sort();
    return `room:${ids.join("-")}`;
  }, [me, matchId]);

  const match = likedMatches.find(m => m.id === matchId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const channel = supabase.channel(room, { config: { broadcast: { self: true } } });

    const sub = channel.on("broadcast", { event: "message" }, (payload) => {
      const msg = payload.payload as ChatMessage;
      setMessages(prev => [...prev, msg].slice(-200));
    }).subscribe((status) => {
      if (status === "SUBSCRIBED") {
        // Optionally send a join message or fetch history from DB in future
      }
    });

    return () => { channel.unsubscribe(); };
  }, [room]);

  useEffect(() => {
    // auto scroll to bottom
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async () => {
    const content = text.trim();
    if (!content) return;
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      userId: me,
      content,
      ts: Date.now(),
    };
    setText("");
    await supabase.channel(room).send({ type: "broadcast", event: "message", payload: msg });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <div className="container mx-auto px-6 py-6">
      <Card className="p-4 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
          {match?.image ? (
            <img src={match.image} alt={match?.name || "Match"} className="w-full h-full object-cover" />
          ) : null}
        </div>
        <div className="flex-1">
          <div className="font-semibold">{match?.name || "Chat"}</div>
          <div className="text-xs text-muted-foreground">Realtime chat • Room {room.replace("room:", "")}</div>
        </div>
        {match?.matchPercentage != null && (
          <Badge className="bg-success text-white">{match.matchPercentage}% match</Badge>
        )}
      </Card>

      <Card className="h-[60vh] flex flex-col">
        <div ref={listRef} className="flex-1 overflow-auto p-4 space-y-3">
          {messages.map(m => (
            <div key={m.id} className={`max-w-[70%] ${m.userId === me ? 'ml-auto text-right' : ''}`}>
              <div className={`inline-block px-3 py-2 rounded-lg text-sm ${m.userId === me ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {m.content}
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">{new Date(m.ts).toLocaleTimeString()}</div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
              Say hello to start chatting.
            </div>
          )}
        </div>
        <div className="p-3 border-t flex gap-2">
          <Input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a message..."
          />
          <Button onClick={send} disabled={!text.trim()}>Send</Button>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
