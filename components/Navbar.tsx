'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // Check if we've scrolled past the hero section height (approx. screen height)
      const isScrolled = window.scrollY > window.innerHeight * 0.7;
      setScrolled(isScrolled);
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    // Remove listener on cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed w-full z-50 py-4 transition-all duration-300 ${
        scrolled 
          ? "bg-cream/95 backdrop-blur-sm border-b border-taupe" 
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className={`font-spartan font-bold ${scrolled ? 'text-charcoal' : 'text-white'}`}>
          <Image 
            src="/logo.png" 
            alt="SUMMIT Logo" 
            width={200} 
            height={70} 
            className="h-auto" 
          />
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            href="#events" 
            className={`${scrolled ? 'text-charcoal hover:text-burnt-orange' : 'text-white hover:text-white/80'} transition-colors`}
          >
            Events
          </Link>
          <Link 
            href="#about" 
            className={`${scrolled ? 'text-charcoal hover:text-burnt-orange' : 'text-white hover:text-white/80'} transition-colors`}
          >
            About
          </Link>
          <Link 
            href="#apply" 
            className={`${scrolled ? 'text-charcoal hover:text-burnt-orange' : 'text-white hover:text-white/80'} transition-colors`}
          >
            Apply
          </Link>
          <Button 
            variant="outline" 
            className={`transition-colors text-charcoal ${
              scrolled 
                ? "border-burnt-orange hover:bg-burnt-orange hover:text-cream" 
                : "border-white hover:bg-white/20"
            }`}
          >
            Join Vault
          </Button>
        </div>
      </div>
    </nav>
  );
} 