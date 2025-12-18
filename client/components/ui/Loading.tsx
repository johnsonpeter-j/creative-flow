'use client';

import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import './Loading.css';

// Simple cn utility function
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  texts?: string[]; // Array of texts to cycle through
  className?: string;
  fullScreen?: boolean;
  loadingType?: "default-animation" | "ai-processing-animation";
  textInterval?: number; // Time in ms to show each text (default: 3000ms)
}

// Helper function to split text into spans for animation
const splitTextIntoSpans = (text: string) => {
  return text.split('').map((char, index) => (
    <span key={index}>{char === ' ' ? '\u00A0' : char}</span>
  ));
};

export function Loading({ 
  size = "md", 
  text,
  texts,
  className,
  fullScreen = false,
  loadingType = "ai-processing-animation",
  textInterval = 3000
}: LoadingProps) {
  // Determine which texts to use
  const textArray = texts || (text ? [text] : ["Loading..."]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Reset index when texts change
  useEffect(() => {
    setCurrentTextIndex(0);
    setIsTransitioning(false);
  }, [texts]);

  // Cycle through texts when using array
  useEffect(() => {
    if (texts && texts.length > 1 && loadingType === "ai-processing-animation") {
      const interval = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
          setTimeout(() => {
            setIsTransitioning(false);
          }, 50); // Small delay before fade in
        }, 300); // Fade out duration
      }, textInterval);

      return () => clearInterval(interval);
    }
  }, [texts, textInterval, loadingType]);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  const loaderSizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  // Render AI Processing Animation
  const renderAIProcessingLoader = () => (
    <div className={cn("ai-processing-loader", loaderSizeClasses[size])}>
      <div className="inner one"></div>
      <div className="inner two"></div>
      <div className="inner three"></div>
    </div>
  );

  // Render Default Animation
  const renderDefaultLoader = () => (
    <Loader2 className={cn("animate-spin", sizeClasses[size])} style={{ color: 'var(--color-frame)' }} />
  );

  // Render animated text for AI processing
  const renderAnimatedText = () => {
    const currentText = textArray[currentTextIndex];
    if (!currentText) return null;
    
    return (
      <div 
        className={cn(
          "animated-text",
          isTransitioning && "fade-out"
        )}
        style={{ color: 'var(--color-text)', fontSize: '12px', fontWeight: '500' }}
      >
        {splitTextIntoSpans(currentText)}
      </div>
    );
  };

  // Render regular text for default animation
  const renderRegularText = () => {
    const currentText = textArray[currentTextIndex];
    if (!currentText) return null;
    return <p className="text-sm" style={{ color: 'var(--color-text)', opacity: 0.7 }}>{currentText}</p>;
  };

  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      {loadingType === "ai-processing-animation" 
        ? renderAIProcessingLoader() 
        : renderDefaultLoader()}
      {loadingType === "ai-processing-animation" 
        ? renderAnimatedText() 
        : renderRegularText()}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(237, 237, 237, 0.8)' }}>
        {content}
      </div>
    );
  }

  return content;
}

// Button loading state
export function ButtonLoading({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  return <Loader2 className={cn("animate-spin", size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6")} style={{ color: 'var(--color-frame)' }} />;
}

// Page loading
export function PageLoading({ text = "Loading page..." }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
      <Loading size="lg" text={text} loadingType="ai-processing-animation" />
    </div>
  );
}

// Card loading skeleton
export function CardLoading() {
  return (
    <div className="space-y-3">
      <div className="h-4 rounded animate-pulse" style={{ backgroundColor: 'rgba(198, 124, 78, 0.1)' }} />
      <div className="h-4 rounded animate-pulse w-3/4" style={{ backgroundColor: 'rgba(198, 124, 78, 0.1)' }} />
      <div className="h-4 rounded animate-pulse w-1/2" style={{ backgroundColor: 'rgba(198, 124, 78, 0.1)' }} />
    </div>
  );
}

