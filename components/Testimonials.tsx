export default function Testimonials() {
  const testimonials = [
    {
      quote: "The connections I made at Summit have been transformative for my business. This isn't networking — it's relationship building at its finest.",
      name: "Alexandra Chen",
      role: "Founder & CEO",
      image: "/testimonial-1.jpg"
    },
    {
      quote: "What sets Summit apart is the curation. Every person I met brought unique perspectives that challenged my thinking.",
      name: "Michael Reeves",
      role: "Serial Entrepreneur",
      image: "/testimonial-2.jpg"
    },
    {
      quote: "The environment Summit creates allows for authentic conversations that simply don't happen at typical industry events.",
      name: "Sarah Washington",
      role: "Venture Capitalist",
      image: "/testimonial-3.jpg"
    }
  ];

  return (
    <section className="py-24 bg-forest-green text-cream">
      <div className="container mx-auto px-4">
        <h2 className="font-spartan text-3xl md:text-4xl font-bold text-center mb-16">What Members Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-lavender/30 mb-6 overflow-hidden">
                <div className="w-full h-full bg-[url('/placeholder-person.jpg')] bg-center bg-cover"></div>
              </div>
              <blockquote className="mb-6 italic">"{testimonial.quote}"</blockquote>
              <div className="mt-auto">
                <p className="font-spartan font-bold">{testimonial.name}</p>
                <p className="text-cream/70 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 