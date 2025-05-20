import { Card, CardContent, CardFooter } from './ui/card';
import { CalendarDays, MapPin } from 'lucide-react';

export default function UpcomingEvents() {
  const events = [
    {
      title: "Winter Retreat",
      location: "Aspen, Colorado",
      date: "January 15-20, 2024",
      image: "/event-1.jpg"
    },
    {
      title: "Founders Dinner",
      location: "New York City",
      date: "March 5, 2024",
      image: "/event-2.jpg"
    },
    {
      title: "Tech Summit",
      location: "San Francisco",
      date: "April 12-14, 2024",
      image: "/event-3.jpg"
    },
    {
      title: "Luxury Yacht Experience",
      location: "Mediterranean Sea",
      date: "June 1-8, 2024",
      image: "/event-4.jpg"
    }
  ];

  return (
    <section id="events" className="py-24 bg-cream">
      <div className="container mx-auto px-4">
        <h2 className="font-spartan text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
        <p className="text-xl text-charcoal/70 mb-12 max-w-3xl">
          Exclusive gatherings for remarkable individuals. Limited spots available.
        </p>
        
        <div className="overflow-x-auto pb-6">
          <div className="flex space-x-6 min-w-max">
            {events.map((event, index) => (
              <Card key={index} className="w-72 bg-white border border-taupe overflow-hidden flex flex-col">
                <div className="h-40 bg-forest-green/20 relative">
                  <div className="absolute inset-0 bg-[url('/placeholder-event.jpg')] bg-center bg-cover"></div>
                </div>
                <CardContent className="pt-6 flex-grow">
                  <h3 className="font-spartan text-xl font-bold mb-2">{event.title}</h3>
                  <div className="flex items-center text-charcoal/70 mb-1">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center text-charcoal/70">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-taupe p-4">
                  <button className="text-burnt-orange text-sm font-medium hover:underline">
                    Request Invitation
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 