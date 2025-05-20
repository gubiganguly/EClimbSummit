import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

export default function FeaturedOffers() {
  const offers = [
    {
      title: "Masterminds",
      description: "Intimate gatherings with like-minded entrepreneurs facing similar challenges and opportunities.",
      icon: "🧠"
    },
    {
      title: "Strategic Consulting",
      description: "One-on-one sessions with industry veterans who've navigated complex business challenges.",
      icon: "📈"
    },
    {
      title: "Community Building",
      description: "Join our thriving network of entrepreneurs for ongoing support, resources, and collaborative growth opportunities.",
      icon: "👥"
    },
    {
      title: "Curated Events",
      description: "Exclusive gatherings in remarkable locations designed to foster deep connection.",
      icon: "🥂"
    }
  ];

  return (
    <section className="py-24 bg-taupe">
      <div className="container mx-auto px-4">
        <h2 className="font-spartan text-3xl md:text-4xl font-bold text-center mb-16">Featured Offerings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer, index) => (
            <Card key={index} className="bg-cream border-none hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-4xl mb-4">{offer.icon}</div>
                <CardTitle className="text-2xl font-spartan">{offer.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-charcoal/80 text-base">
                  {offer.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="text-burnt-orange hover:text-burnt-orange/80 p-0 flex items-center gap-2">
                  Learn more <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 