import { useState, useEffect, useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Main({ children }: Props) {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!isScrolling)  setIsScrolling(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    };

    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (element) element.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  return (
    <main
      ref={scrollRef}
      className={`flex-1 overflow-y-auto items-center p-4 w-full h-full custom-scrollbar ${
        isScrolling ? "scrolling" : ""
      }`}
    >
        {children}
    </main>
  );
}
