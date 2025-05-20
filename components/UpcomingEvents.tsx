'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from './ui/card';
import { CalendarDays, MapPin, Loader2 } from 'lucide-react';
import { getEvents, EventWithId } from '@/lib/firebase/events/eventModel';
import Link from 'next/link';

export default function UpcomingEvents() {
  const [events, setEvents] = useState<EventWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Fallback events in case there are no events in the database
  const sampleEvents = [
    {
      id: 'sample-1',
      title: "Winter Retreat",
      location: "Aspen, Colorado",
      date: "January 15-20, 2024",
      image: "/event-1.jpg",
      description: "Experience luxury in the snowy mountains of Aspen.",
      capacity: 20,
      createdAt: null,
      attendees: []
    },
    {
      id: 'sample-2',
      title: "Founders Dinner",
      location: "New York City",
      date: "March 5, 2024",
      image: "/event-2.jpg",
      description: "Network with top entrepreneurs in the heart of NYC.",
      capacity: 30,
      createdAt: null,
      attendees: []
    },
    {
      id: 'sample-3',
      title: "Tech Summit",
      location: "San Francisco",
      date: "April 12-14, 2024",
      image: "/event-3.jpg",
      description: "Explore cutting-edge technology with industry leaders.",
      capacity: 50,
      createdAt: null,
      attendees: []
    },
    {
      id: 'sample-4',
      title: "Luxury Yacht Experience",
      location: "Mediterranean Sea",
      date: "June 1-8, 2024",
      image: "/event-4.jpg",
      description: "Sail the Mediterranean in ultimate luxury.",
      capacity: 15,
      createdAt: null,
      attendees: []
    }
  ];

  const displayEvents = events.length > 0 ? events : sampleEvents;

  return (
    <section id="events" className="py-24 bg-cream">
      <div className="container mx-auto px-4">
        <h2 className="font-spartan text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
        <p className="text-xl text-charcoal/70 mb-12 max-w-3xl">
          Exclusive gatherings for remarkable individuals. Limited spots available.
        </p>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-forest-green" />
          </div>
        ) : (
          <div className="overflow-x-auto pb-6">
            <div className="flex space-x-6 min-w-max">
              {displayEvents.map((event) => (
                <Link href={`/events/${event.id}`} key={event.id}>
                  <Card className="w-72 bg-white border border-taupe overflow-hidden flex flex-col transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer">
                    <div className="h-40 bg-forest-green/20 relative">
                      <div 
                        className="absolute inset-0 bg-center bg-cover" 
                        style={{ backgroundImage: `url('${event.image || "/placeholder-event.jpg"}')` }}
                      ></div>
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
                      <span className="text-burnt-orange text-sm font-medium hover:underline">
                        View Details
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 