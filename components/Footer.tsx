import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-16 bg-charcoal text-cream">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <div className="mb-1">
              <img src="/logo.png" alt="SUMMIT Logo" width={180} height={63} className="h-auto" />
            </div>
            <p className="mt-2 text-cream/70 font-pinyon text-xl">Curated with Intention.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Link href="#events" className="text-cream/70 hover:text-cream transition-colors">
              Events
            </Link>
            <Link href="#about" className="text-cream/70 hover:text-cream transition-colors">
              About
            </Link>
            <Link href="#apply" className="text-cream/70 hover:text-cream transition-colors">
              Apply
            </Link>
            <Link href="#" className="text-cream/70 hover:text-cream transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-cream/70 hover:text-cream transition-colors">
              Terms
            </Link>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-cream/20 text-center text-cream/50 text-sm">
          &copy; {new Date().getFullYear()} eclimbSUMMIT. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 