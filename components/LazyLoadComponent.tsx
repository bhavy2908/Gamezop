'use client'
import React, { useRef, ReactNode, useState, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface LazyLoadComponentProps {
  children: ReactNode;
  placeholder?: ReactNode;
}

export function LazyLoadComponent({ children, placeholder }: LazyLoadComponentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(ref, { rootMargin: '200px' });
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible && !shouldRender) {
      setShouldRender(true);
    }
  }, [isVisible, shouldRender]);

  const [childrenHeight, setChildrenHeight] = useState<number | undefined>();
  useEffect(() => {
    if (ref.current && shouldRender) {
      setChildrenHeight(ref.current.offsetHeight);
    }
  }, [shouldRender]);

  return (
    <div 
      ref={ref} 
      style={{ 
        minHeight: shouldRender ? undefined : childrenHeight,
        height: shouldRender ? undefined : childrenHeight
      }}
    >
      {shouldRender ? children : placeholder}
    </div>
  );
}