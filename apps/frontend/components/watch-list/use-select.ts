import { useRef, useEffect, useState } from "react";

interface UseSelectProps {
  onClose?: () => void;
}

export function useSelect({ onClose }: UseSelectProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return {
    isOpen,
    setIsOpen,
    containerRef,
  };
}