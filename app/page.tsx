import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturedOffers from '@/components/FeaturedOffers';
import UpcomingEvents from '@/components/UpcomingEvents';
import Testimonials from '@/components/Testimonials';
import EventTypes from '@/components/EventTypes';
import ImageGallery from '@/components/ImageGallery';
import ApplicationForm from '@/components/ApplicationForm';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturedOffers />
      <UpcomingEvents />
      <Testimonials />
      <EventTypes />
      <ImageGallery />
      <ApplicationForm />
      <Footer />
    </main>
  );
}
