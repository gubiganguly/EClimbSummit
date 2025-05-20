'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getEventById, addAttendeeToEvent } from '@/lib/firebase/events/eventModel';
import { CalendarDays, MapPin, Users, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Event } from '@/lib/firebase/events/eventModel';
import Link from 'next/link';

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    business: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    business: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(eventId);
        if (eventData) {
          setEvent(eventData);
        } else {
          router.push('/'); // Redirect to home if event not found
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', business: '', email: '', phone: '' };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    
    if (!formData.business.trim()) {
      newErrors.business = 'Business name is required';
      valid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await addAttendeeToEvent(eventId, {
        name: formData.name,
        business: formData.business,
        email: formData.email,
        phone: formData.phone
      });
      
      if (result.success) {
        setIsSubmitted(true);
        setFormData({ name: '', business: '', email: '', phone: '' });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="h-12 w-12 animate-spin text-forest-green" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6">
          <Link href="/#events" className="inline-flex items-center text-forest-green mb-4 md:mb-6 hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
            <div className="lg:col-span-2">
              <div className="h-60 sm:h-72 md:h-96 bg-forest-green/20 rounded-xl overflow-hidden mb-4 md:mb-6">
                <div
                  className="w-full h-full bg-center bg-cover"
                  style={{ backgroundImage: `url('${event?.image || "/placeholder-event.jpg"}')` }}
                ></div>
              </div>
              
              <h1 className="font-spartan text-3xl md:text-4xl font-bold mb-4">{event?.title}</h1>
              
              <div className="flex flex-wrap gap-2 md:gap-4 mb-6">
                <div className="flex items-center text-charcoal/70 bg-white px-3 py-2 text-sm md:text-base md:px-4 rounded-full shadow-sm">
                  <CalendarDays className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2 text-burnt-orange" />
                  <span>{event?.date}</span>
                </div>
                <div className="flex items-center text-charcoal/70 bg-white px-3 py-2 text-sm md:text-base md:px-4 rounded-full shadow-sm">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2 text-burnt-orange" />
                  <span>{event?.location}</span>
                </div>
                <div className="flex items-center text-charcoal/70 bg-white px-3 py-2 text-sm md:text-base md:px-4 rounded-full shadow-sm">
                  <Users className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2 text-burnt-orange" />
                  <span>Capacity: {event?.capacity}</span>
                </div>
              </div>
              
              <div className="prose max-w-none mb-8 md:mb-10">
                <h2 className="font-spartan text-xl md:text-2xl font-bold mb-3">About This Event</h2>
                <p className="text-charcoal/80 text-base md:text-lg whitespace-pre-line">
                  {event?.description}
                </p>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6 sticky top-16 md:top-24">
                <h2 className="font-spartan text-xl md:text-2xl font-bold mb-4">Request to Attend</h2>
                
                {isSubmitted ? (
                  <div className="text-center py-6">
                    <div className="flex justify-center mb-4">
                      <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <h3 className="font-spartan text-xl font-bold mb-2">Request Received!</h3>
                    <p className="text-charcoal/70 mb-6">
                      Thank you for your interest in this event. We'll review your application and be in touch soon.
                    </p>
                    <Button 
                      onClick={() => setIsSubmitted(false)}
                      className="bg-forest-green hover:bg-forest-green/90 text-white"
                    >
                      Submit Another Request
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block mb-1 font-medium text-sm">
                        Your Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Jane Smith"
                        className="border-taupe"
                      />
                      {errors.name && <p className="mt-1 text-sm text-burnt-orange">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="business" className="block mb-1 font-medium text-sm">
                        Business or Organization
                      </label>
                      <Input
                        id="business"
                        name="business"
                        value={formData.business}
                        onChange={handleChange}
                        placeholder="Your Company, LLC"
                        className="border-taupe"
                      />
                      {errors.business && <p className="mt-1 text-sm text-burnt-orange">{errors.business}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block mb-1 font-medium text-sm">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="border-taupe"
                      />
                      {errors.email && <p className="mt-1 text-sm text-burnt-orange">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block mb-1 font-medium text-sm">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(555) 555-5555"
                        className="border-taupe"
                      />
                      {errors.phone && <p className="mt-1 text-sm text-burnt-orange">{errors.phone}</p>}
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-burnt-orange text-black font-bold text-base transition-all duration-200 hover:bg-burnt-orange/90 hover:shadow-md hover:scale-[1.02] cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                          Submitting...
                        </span>
                      ) : 'Request to Attend'}
                    </Button>
                  </form>
                )}
                
                <div className="mt-6 pt-6 border-t border-taupe">
                  <p className="text-sm text-charcoal/70">
                    Our events are designed for high-quality networking and collaborative opportunities. All requests are subject to approval.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 