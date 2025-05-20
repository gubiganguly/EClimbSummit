'use client';

import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { LeadWithId, getLeads, deleteLead } from '@/lib/firebase/leads/leadModel';
import { EventWithId, getEvents, addEvent, deleteEvent } from '@/lib/firebase/events/eventModel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, RefreshCw, Home, CalendarDays, Plus, Pencil, Users, Trash2, ChevronDown, ChevronUp, Calendar, MapPin, Clock, Globe } from 'lucide-react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from '@/components/ui/textarea';
import { Badge } from "@/components/ui/badge";
import { z } from 'zod';
import { Fragment } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type DateFilterType = 'all' | 'today' | 'thisWeek' | 'thisMonth';

// Timezone options
const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'Europe/London', label: 'London Time (GMT/BST)' },
];

// Form schemas
const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  location: z.string().min(1, 'Location is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  timeZone: z.string().min(1, 'Time zone is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().min(1, 'Image URL is required'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1')
});

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('leads');
  
  // Leads state
  const [leads, setLeads] = useState<LeadWithId[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);
  
  // Events state
  const [events, setEvents] = useState<EventWithId[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsSearchTerm, setEventsSearchTerm] = useState('');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    location: '',
    date: '',
    time: '',
    timeZone: 'America/New_York',
    description: '',
    image: '',
    capacity: '10'
  });
  const [eventFormErrors, setEventFormErrors] = useState<Record<string, string>>({});
  const [eventSubmitting, setEventSubmitting] = useState(false);
  const [eventSuccess, setEventSuccess] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  
  const handleLogin = () => {
    if (password === 'letsgetrich') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
    } else {
      setError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const leadsData = await getLeads();
      setLeads(leadsData);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchEvents = async () => {
    setEventsLoading(true);
    try {
      const eventsData = await getEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setEventsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (activeTab === 'leads') {
      await fetchLeads();
    } else {
      await fetchEvents();
    }
    setRefreshing(false);
  };
  
  const toggleExpandEvent = (eventId: string) => {
    if (expandedEventId === eventId) {
      setExpandedEventId(null);
    } else {
      setExpandedEventId(eventId);
    }
  };
  
  const handleEventFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (eventFormErrors[name]) {
      setEventFormErrors(prev => {
        const updated = {...prev};
        delete updated[name];
        return updated;
      });
    }
  };
  
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
      setEventForm(prev => ({ ...prev, date: formattedDate }));
      
      // Clear date error
      if (eventFormErrors.date) {
        setEventFormErrors(prev => {
          const updated = {...prev};
          delete updated.date;
          return updated;
        });
      }
    }
  };
  
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    try {
      eventSchema.parse(eventForm);
      setEventFormErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.errors.forEach(error => {
          if (error.path[0]) {
            errors[error.path[0].toString()] = error.message;
          }
        });
        setEventFormErrors(errors);
        return;
      }
    }
    
    setEventSubmitting(true);
    
    try {
      // Format date for display
      const dateForDisplay = `${eventForm.date} at ${eventForm.time} (${eventForm.timeZone.split('/')[1].replace('_', ' ')})`;
      
      const result = await addEvent({
        title: eventForm.title,
        location: eventForm.location,
        date: dateForDisplay,
        time: eventForm.time,
        timeZone: eventForm.timeZone,
        description: eventForm.description,
        image: eventForm.image,
        capacity: parseInt(eventForm.capacity)
      });
      
      if (result.success) {
        setEventSuccess(true);
        setEventForm({
          title: '',
          location: '',
          date: '',
          time: '',
          timeZone: 'America/New_York',
          description: '',
          image: '',
          capacity: '10'
        });
        setSelectedDate(null);
        setEventFormErrors({});
        fetchEvents();
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setEventSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setEventSubmitting(false);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      setDeletingLeadId(leadId);
      const result = await deleteLead(leadId);
      if (result.success) {
        // Update leads list by removing the deleted lead
        setLeads(currentLeads => currentLeads.filter(lead => lead.id !== leadId));
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    } finally {
      setDeletingLeadId(null);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      setDeletingEventId(eventId);
      const result = await deleteEvent(eventId);
      if (result.success) {
        // Update events list by removing the deleted event
        setEvents(currentEvents => currentEvents.filter(event => event.id !== eventId));
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setDeletingEventId(null);
    }
  };

  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuthenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
      fetchEvents();
    }
  }, [isAuthenticated]);

  const isInDateRange = (timestamp: Timestamp): boolean => {
    if (!timestamp || !timestamp.toDate) return false;
    
    const date = timestamp.toDate();
    const now = new Date();
    
    if (dateFilter === 'all') return true;
    
    if (dateFilter === 'today') {
      return date.setHours(0, 0, 0, 0) === now.setHours(0, 0, 0, 0);
    }
    
    if (dateFilter === 'thisWeek') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      
      return date >= startOfWeek;
    }
    
    if (dateFilter === 'thisMonth') {
      return date.getMonth() === now.getMonth() && 
             date.getFullYear() === now.getFullYear();
    }
    
    return true;
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDateFilter = isInDateRange(lead.createdAt);
    
    return matchesSearch && matchesDateFilter;
  });
  
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(eventsSearchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(eventsSearchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(eventsSearchTerm.toLowerCase())
  );

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp || !timestamp.toDate) return 'N/A';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to format ISO date string
  const formatIsoDate = (isoString: string) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-cream">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-forest-green font-spartan">Admin Access</h1>
            <p className="mt-2 text-charcoal">Enter password to continue</p>
          </div>
          <div className="mt-8 space-y-6">
            <div className="space-y-2">
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-3 py-2 border-2 border-taupe rounded-md"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLogin();
                  }
                }}
              />
              {error && <p className="text-sm text-burnt-orange">{error}</p>}
            </div>
            <Button 
              onClick={handleLogin}
              className="w-full py-2 px-4 bg-forest-green hover:bg-opacity-90 text-white rounded-md"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-forest-green font-spartan">Admin Dashboard</h1>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="border-2 border-burnt-orange text-burnt-orange hover:bg-burnt-orange hover:text-white"
            >
              Logout
            </Button>
            <Link href="/">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-2 border-forest-green text-forest-green hover:bg-forest-green hover:text-white"
              >
                <Home size={16} />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
        
        <Tabs defaultValue="leads" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <Users size={16} />
              Leads
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <CalendarDays size={16} />
              Events
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="leads" className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search by name, business, or email..."
                  className="pl-10 border-2 border-taupe"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <Select
                  value={dateFilter}
                  onValueChange={(value) => setDateFilter(value as DateFilterType)}
                >
                  <SelectTrigger className="border-2 border-taupe">
                    <div className="flex items-center gap-2">
                      <Filter size={16} className="text-forest-green" />
                      <SelectValue placeholder="Filter by date" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="thisWeek">This week</SelectItem>
                    <SelectItem value="thisMonth">This month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={refreshing || loading}
                className="flex items-center gap-2 border-2 border-forest-green text-forest-green hover:bg-forest-green hover:text-white md:w-auto w-full"
              >
                <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                Refresh
              </Button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-green"></div>
              </div>
            ) : (
              <>
                <div className="text-sm text-charcoal mb-4">
                  Showing {filteredLeads.length} of {leads.length} leads
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px] font-spartan">Name</TableHead>
                        <TableHead className="font-spartan">Business</TableHead>
                        <TableHead className="font-spartan">Email</TableHead>
                        <TableHead className="font-spartan">Phone</TableHead>
                        <TableHead className="font-spartan">Date</TableHead>
                        <TableHead className="w-[80px] font-spartan">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.length > 0 ? (
                        filteredLeads.map((lead) => (
                          <TableRow key={lead.id}>
                            <TableCell className="font-medium">{lead.name}</TableCell>
                            <TableCell>{lead.business}</TableCell>
                            <TableCell>{lead.email}</TableCell>
                            <TableCell>{lead.phone}</TableCell>
                            <TableCell>{formatDate(lead.createdAt)}</TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteLead(lead.id)}
                                disabled={deletingLeadId === lead.id}
                                className="h-8 w-8 p-0 text-burnt-orange hover:text-red-600 hover:bg-red-100"
                              >
                                {deletingLeadId === lead.id ? 
                                  <RefreshCw size={16} className="animate-spin" /> : 
                                  <Trash2 size={16} />
                                }
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                            No leads found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="events">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-forest-green font-spartan mb-4 md:mb-0">Events</h2>
                    <div className="flex gap-4 w-full md:w-auto">
                      <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <Input
                          type="text"
                          placeholder="Search events..."
                          className="pl-10 border-2 border-taupe"
                          value={eventsSearchTerm}
                          onChange={(e) => setEventsSearchTerm(e.target.value)}
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={handleRefresh}
                        disabled={refreshing || eventsLoading}
                        className="flex items-center gap-2 border-2 border-forest-green text-forest-green hover:bg-forest-green hover:text-white"
                      >
                        <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                      </Button>
                    </div>
                  </div>
                  
                  {eventsLoading ? (
                    <div className="flex justify-center items-center py-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-green"></div>
                    </div>
                  ) : (
                    <>
                      <div className="text-sm text-charcoal mb-4">
                        Showing {filteredEvents.length} of {events.length} events
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredEvents.length > 0 ? (
                          filteredEvents.map((event) => (
                            <Card key={event.id} className="overflow-hidden border-gray-200 hover:shadow-md transition-shadow duration-200">
                              <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                                <img 
                                  src={event.image} 
                                  alt={event.title} 
                                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xpbWJpbmd8ZW58MHx8MHx8fDA%3D";
                                  }}
                                />
                                <div className="absolute top-2 right-2 px-2 py-1 bg-forest-green/80 text-white text-xs rounded-full">
                                  {event.attendees?.length || 0}/{event.capacity} Attendees
                                </div>
                              </div>
                              
                              <CardHeader className="px-4 py-3 pb-1">
                                <CardTitle className="text-xl text-forest-green font-spartan line-clamp-1">
                                  {event.title}
                                </CardTitle>
                                <div className="flex flex-col">
                                  <div className="flex items-center text-sm text-gray-600 mt-1">
                                    <Calendar size={14} className="mr-1 text-forest-green flex-shrink-0" />
                                    <span className="line-clamp-1">{event.date}</span>
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600 mt-1">
                                    <MapPin size={14} className="mr-1 text-forest-green flex-shrink-0" />
                                    <span className="line-clamp-1">{event.location}</span>
                                  </div>
                                  {event.timeZone && (
                                    <div className="flex items-center text-sm text-gray-600 mt-1">
                                      <Globe size={14} className="mr-1 text-forest-green flex-shrink-0" />
                                      <span>{event.timeZone.split('/')[1].replace('_', ' ')}</span>
                                    </div>
                                  )}
                                </div>
                              </CardHeader>
                              
                              <CardContent className="px-4 py-2">
                                <p className="text-sm text-gray-600 line-clamp-2 whitespace-pre-line">
                                  {event.description}
                                </p>
                              </CardContent>
                              
                              <CardFooter className="border-t border-gray-100 flex justify-between items-center px-4 py-3">
                                <div className="text-xs text-gray-500">
                                  Created: {formatDate(event.createdAt).split(',')[0]}
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex items-center h-8 px-3 gap-1 border-forest-green text-forest-green hover:bg-forest-green/10"
                                    onClick={() => toggleExpandEvent(event.id)}
                                  >
                                    <Users size={14} />
                                    <span>Attendees</span>
                                    {expandedEventId === event.id ? 
                                      <ChevronUp size={14} /> : 
                                      <ChevronDown size={14} />
                                    }
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleDeleteEvent(event.id)}
                                    disabled={deletingEventId === event.id}
                                    className="h-8 w-8 p-0 border-burnt-orange text-burnt-orange hover:bg-burnt-orange/10"
                                  >
                                    {deletingEventId === event.id ? 
                                      <RefreshCw size={14} className="animate-spin" /> : 
                                      <Trash2 size={14} />
                                    }
                                  </Button>
                                </div>
                              </CardFooter>
                              
                              {expandedEventId === event.id && (
                                <div className="border-t border-gray-100 bg-green-50/40 p-4">
                                  <div className="flex items-center mb-3 pb-2 border-b border-green-100">
                                    <Users size={16} className="mr-2 text-forest-green" />
                                    <h3 className="text-lg font-medium text-forest-green">
                                      Attendees List
                                    </h3>
                                  </div>
                                  
                                  {event.attendees?.length ? (
                                    <div className="overflow-x-auto">
                                      <Table>
                                        <TableHeader>
                                          <TableRow className="bg-green-100/50">
                                            <TableHead className="font-spartan">Name</TableHead>
                                            <TableHead className="font-spartan">Business</TableHead>
                                            <TableHead className="font-spartan">Email</TableHead>
                                            <TableHead className="font-spartan">Phone</TableHead>
                                            <TableHead className="font-spartan">Registered On</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {event.attendees.map((attendee, index) => (
                                            <TableRow key={`${event.id}-attendee-${index}`} className="border-b border-green-100/30">
                                              <TableCell>{attendee.name}</TableCell>
                                              <TableCell>{attendee.business}</TableCell>
                                              <TableCell>{attendee.email}</TableCell>
                                              <TableCell>{attendee.phone}</TableCell>
                                              <TableCell>{formatIsoDate(attendee.createdAt)}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500 bg-white rounded-md">
                                      <Users size={36} className="mb-3 text-gray-300" />
                                      <p>No attendees registered for this event yet.</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </Card>
                          ))
                        ) : (
                          <div className="col-span-full text-center py-10 bg-white rounded-lg border border-gray-200 text-gray-500">
                            No events found
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                  <div className="flex items-center mb-4">
                    <Plus size={20} className="text-forest-green mr-2" />
                    <h2 className="text-xl font-bold text-forest-green font-spartan">Create Event</h2>
                  </div>
                  
                  {eventSuccess && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded-md">
                      Event created successfully!
                    </div>
                  )}
                  
                  <form onSubmit={handleEventSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block mb-1 text-sm font-medium">
                        Event Title
                      </label>
                      <Input
                        id="title"
                        name="title"
                        value={eventForm.title}
                        onChange={handleEventFormChange}
                        placeholder="Winter Retreat"
                        className="border-taupe"
                      />
                      {eventFormErrors.title && (
                        <p className="mt-1 text-xs text-burnt-orange">{eventFormErrors.title}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block mb-1 text-sm font-medium">
                        Location
                      </label>
                      <Input
                        id="location"
                        name="location"
                        value={eventForm.location}
                        onChange={handleEventFormChange}
                        placeholder="New York City"
                        className="border-taupe"
                      />
                      {eventFormErrors.location && (
                        <p className="mt-1 text-xs text-burnt-orange">{eventFormErrors.location}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="date" className="block mb-1 text-sm font-medium">
                        Date
                      </label>
                      <div className="relative">
                        <DatePicker
                          selected={selectedDate}
                          onChange={handleDateChange}
                          className="w-full p-2 border-2 border-taupe rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green"
                          dateFormat="yyyy-MM-dd"
                          placeholderText="Select date"
                          minDate={new Date()}
                          isClearable
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          customInput={
                            <div className="relative flex items-center">
                              <Input
                                value={eventForm.date}
                                readOnly
                                placeholder="Select date"
                                className="border-taupe pr-10"
                              />
                              <Calendar className="absolute right-3 text-forest-green" size={16} />
                            </div>
                          }
                        />
                      </div>
                      {eventFormErrors.date && (
                        <p className="mt-1 text-xs text-burnt-orange">{eventFormErrors.date}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="time" className="block mb-1 text-sm font-medium">
                        Time
                      </label>
                      <div className="relative">
                        <Input
                          id="time"
                          name="time"
                          type="time"
                          value={eventForm.time}
                          onChange={handleEventFormChange}
                          className="border-taupe pr-10"
                        />
                        <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-forest-green" size={16} />
                      </div>
                      {eventFormErrors.time && (
                        <p className="mt-1 text-xs text-burnt-orange">{eventFormErrors.time}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="timeZone" className="block mb-1 text-sm font-medium">
                        Time Zone
                      </label>
                      <Select
                        value={eventForm.timeZone}
                        onValueChange={(value) => setEventForm(prev => ({ ...prev, timeZone: value }))}
                      >
                        <SelectTrigger className="border-2 border-taupe">
                          <div className="flex items-center gap-2">
                            <Globe size={16} className="text-forest-green" />
                            <SelectValue placeholder="Select time zone" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {TIMEZONES.map((timezone) => (
                            <SelectItem key={timezone.value} value={timezone.value}>
                              {timezone.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {eventFormErrors.timeZone && (
                        <p className="mt-1 text-xs text-burnt-orange">{eventFormErrors.timeZone}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block mb-1 text-sm font-medium">
                        Description
                      </label>
                      <Textarea
                        id="description"
                        name="description"
                        value={eventForm.description}
                        onChange={handleEventFormChange}
                        placeholder="Describe the event..."
                        className="border-taupe min-h-24"
                      />
                      {eventFormErrors.description && (
                        <p className="mt-1 text-xs text-burnt-orange">{eventFormErrors.description}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="image" className="block mb-1 text-sm font-medium">
                        Image URL
                      </label>
                      <Input
                        id="image"
                        name="image"
                        value={eventForm.image}
                        onChange={handleEventFormChange}
                        placeholder="https://example.com/image.jpg"
                        className="border-taupe"
                      />
                      {eventFormErrors.image && (
                        <p className="mt-1 text-xs text-burnt-orange">{eventFormErrors.image}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="capacity" className="block mb-1 text-sm font-medium">
                        Capacity
                      </label>
                      <Input
                        id="capacity"
                        name="capacity"
                        type="number"
                        value={eventForm.capacity}
                        onChange={handleEventFormChange}
                        min="1"
                        className="border-taupe"
                      />
                      {eventFormErrors.capacity && (
                        <p className="mt-1 text-xs text-burnt-orange">{eventFormErrors.capacity}</p>
                      )}
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={eventSubmitting}
                      className="w-full bg-green-600 hover:bg-green-700 text-white transition-all hover:scale-[1.02] hover:shadow-md"
                    >
                      {eventSubmitting ? (
                        <span className="flex items-center justify-center">
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> 
                          Creating...
                        </span>
                      ) : 'Create Event'}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 