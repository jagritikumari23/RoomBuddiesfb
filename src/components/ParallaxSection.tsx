import { useEffect, useState, useRef, ReactNode } from "react";

interface ParallaxSectionProps {
  children: ReactNode;
  offset?: number;
  className?: string;
  speed?: number;
}

const ParallaxSection = ({ 
  children, 
  offset = 0, 
  className = "",
  speed = 0.5 
}: ParallaxSectionProps) => {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const parallax = (scrolled - rect.top) * speed;
        setScrollY(parallax);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div 
      ref={sectionRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        transform: `translateY(${scrollY + offset}px)`,
      }}
    >
      {children}
    </div>
  );
};

export default ParallaxSection;