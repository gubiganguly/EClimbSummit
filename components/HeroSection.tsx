'use client';

import { Button } from './ui/button';
import { useEffect, useRef } from 'react';

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const scrollToForm = () => {
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Make sure video plays automatically when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
      {/* Video background with overlay */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      <video 
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/eclimbsummit_headers.mp4" type="video/mp4" />
      </video>
      
      <div className="container mx-auto px-4 relative z-20 text-center py-32 flex flex-col items-center justify-center">
        <Button 
          onClick={scrollToForm}
          className="bg-white hover:bg-white/90 text-charcoal text-lg py-6 px-8 mt-64"
        >
          Apply to Attend
        </Button>
      </div>
    </section>
  );
} 