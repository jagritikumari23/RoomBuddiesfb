import { Heart, Users, MapPin, Star, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const FloatingElements = () => {
  const [elements, setElements] = useState<Array<{
    id: number;
    icon: any;
    x: number;
    y: number;
    delay: number;
    duration: number;
    scale: number;
  }>>([]);

  useEffect(() => {
    const icons = [Heart, Users, MapPin, Star, Sparkles, Zap];
    const newElements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      icon: icons[Math.floor(Math.random() * icons.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 4,
      scale: 0.5 + Math.random() * 0.8
    }));
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((element) => {
        const Icon = element.icon;
        return (
          <div
            key={element.id}
            className="absolute animate-float opacity-20"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
              transform: `scale(${element.scale})`
            }}
          >
            <Icon className="w-6 h-6 text-primary" />
          </div>
        );
      })}
    </div>
  );
};

export default FloatingElements;