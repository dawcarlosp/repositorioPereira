import { useState, useEffect } from 'react';

const screens = {
  'xs': 0,
  'sm': 640,
  'md': 768,
  'lg': 1024,
  'xl': 1280,
  '2xl': 1536,
};

export default function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState('xs');

  useEffect(() => {
    const calcBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= screens['2xl']) return '2xl';
      if (width >= screens['xl']) return 'xl';
      if (width >= screens['lg']) return 'lg';
      if (width >= screens['md']) return 'md';
      if (width >= screens['sm']) return 'sm';
      return 'xs';
    };

    const handleResize = () => setBreakpoint(calcBreakpoint());
    
    // Calcular al montar
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}