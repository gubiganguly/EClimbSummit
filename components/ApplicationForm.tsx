'use client';

import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { addLead } from '@/lib/firebase/leads/leadModel';
import { Loader2, CheckCircle } from 'lucide-react';

export default function ApplicationForm() {
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
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
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
    } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus('loading');
    
    try {
      const result = await addLead({
        name: formData.name,
        business: formData.business,
        email: formData.email,
        phone: formData.phone
      });
      
      if (result.success) {
        setSubmitStatus('success');
        setIsSubmitted(true);
        setFormData({ name: '', business: '', email: '', phone: '' });
      } else {
        setSubmitStatus('error');
        setErrorMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="apply" className="py-24 bg-burnt-orange text-cream">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          <h2 className="font-spartan text-3xl md:text-4xl font-bold mb-4 text-center">Apply to Attend</h2>
          <p className="text-center mb-10">
            Our experiences are invitation-only to ensure the right fit for all participants.
          </p>
          
          {isSubmitted ? (
            <div className="bg-cream/10 rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
              <h3 className="font-spartan text-2xl font-bold mb-4">Thank You!</h3>
              <p>Your application has been received and saved to our database. Our team will review your information and reach out within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 bg-cream/10 rounded-lg p-8">
              <div>
                <label htmlFor="name" className="block mb-2 font-medium">
                  Your Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  className="bg-cream/20 border-cream/30 placeholder:text-cream/50 text-cream"
                />
                {errors.name && <p className="mt-1 text-sm text-cream/80">{errors.name}</p>}
              </div>
              
              <div>
                <label htmlFor="business" className="block mb-2 font-medium">
                  Business or Organization
                </label>
                <Input
                  id="business"
                  name="business"
                  value={formData.business}
                  onChange={handleChange}
                  placeholder="Your Company, LLC"
                  className="bg-cream/20 border-cream/30 placeholder:text-cream/50 text-cream"
                />
                {errors.business && <p className="mt-1 text-sm text-cream/80">{errors.business}</p>}
              </div>
              
              <div>
                <label htmlFor="email" className="block mb-2 font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="bg-cream/20 border-cream/30 placeholder:text-cream/50 text-cream"
                />
                {errors.email && <p className="mt-1 text-sm text-cream/80">{errors.email}</p>}
              </div>
              
              <div>
                <label htmlFor="phone" className="block mb-2 font-medium">
                  Mobile Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(123) 456-7890"
                  className="bg-cream/20 border-cream/30 placeholder:text-cream/50 text-cream"
                />
                {errors.phone && <p className="mt-1 text-sm text-cream/80">{errors.phone}</p>}
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white hover:bg-green-700 font-medium py-6"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Submitting...
                  </span>
                ) : 'Request Access'}
              </Button>
              
              {submitStatus === 'error' && (
                <p className="text-center text-red-300 mt-2">{errorMessage}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
} 