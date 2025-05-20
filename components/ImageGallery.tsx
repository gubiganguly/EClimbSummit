export default function ImageGallery() {
  return (
    <section className="py-24 bg-charcoal text-cream">
      <div className="container mx-auto px-4">
        <h2 className="font-spartan text-3xl md:text-4xl font-bold text-center mb-16">Experience Summit</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="aspect-square bg-forest-green/30 rounded-md overflow-hidden">
            <div className="w-full h-full bg-[url('/gallery-1.jpg')] bg-center bg-cover hover:scale-105 transition-transform duration-500"></div>
          </div>
          <div className="aspect-square bg-forest-green/30 rounded-md overflow-hidden">
            <div className="w-full h-full bg-[url('/gallery-2.jpg')] bg-center bg-cover hover:scale-105 transition-transform duration-500"></div>
          </div>
          <div className="aspect-square bg-forest-green/30 rounded-md overflow-hidden">
            <div className="w-full h-full bg-[url('/gallery-3.jpg')] bg-center bg-cover hover:scale-105 transition-transform duration-500"></div>
          </div>
          <div className="aspect-square bg-forest-green/30 rounded-md overflow-hidden">
            <div className="w-full h-full bg-[url('/gallery-4.jpg')] bg-center bg-cover hover:scale-105 transition-transform duration-500"></div>
          </div>
          <div className="aspect-square bg-forest-green/30 rounded-md overflow-hidden md:col-span-2">
            <div className="w-full h-full bg-[url('/gallery-5.jpg')] bg-center bg-cover hover:scale-105 transition-transform duration-500"></div>
          </div>
          <div className="aspect-square bg-forest-green/30 rounded-md overflow-hidden">
            <div className="w-full h-full bg-[url('/gallery-6.jpg')] bg-center bg-cover hover:scale-105 transition-transform duration-500"></div>
          </div>
          <div className="aspect-square bg-forest-green/30 rounded-md overflow-hidden">
            <div className="w-full h-full bg-[url('/gallery-7.jpg')] bg-center bg-cover hover:scale-105 transition-transform duration-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
} 