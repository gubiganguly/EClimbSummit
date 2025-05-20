import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, doc, getDoc, updateDoc, arrayUnion, deleteDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../config';
import { Lead } from '../leads/leadModel';

export interface Event {
  title: string;
  location: string;
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:MM (24hr)
  timeZone: string; // e.g. "America/New_York"
  description: string;
  image: string;
  capacity: number;
  createdAt: any;
  attendees?: Lead[];
}

export interface EventWithId extends Event {
  id: string;
}

export const addEvent = async (eventData: Omit<Event, 'createdAt' | 'attendees'>) => {
  try {
    const eventsCollection = collection(FIRESTORE_DB, 'events');
    const docRef = await addDoc(eventsCollection, {
      ...eventData,
      attendees: [],
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding event:', error);
    return { success: false, error };
  }
};

export const getEvents = async (): Promise<EventWithId[]> => {
  try {
    const eventsCollection = collection(FIRESTORE_DB, 'events');
    const eventsQuery = query(eventsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(eventsQuery);
    
    const events: EventWithId[] = [];
    querySnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...(doc.data() as Event)
      });
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const getEventById = async (eventId: string): Promise<EventWithId | null> => {
  try {
    const eventRef = doc(FIRESTORE_DB, 'events', eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (eventSnap.exists()) {
      return {
        id: eventSnap.id,
        ...(eventSnap.data() as Event)
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
};

export const addAttendeeToEvent = async (eventId: string, attendeeData: Omit<Lead, 'createdAt'>) => {
  try {
    const eventRef = doc(FIRESTORE_DB, 'events', eventId);
    const leadWithTimestamp = {
      ...attendeeData,
      createdAt: new Date().toISOString()
    };
    
    await updateDoc(eventRef, {
      attendees: arrayUnion(leadWithTimestamp)
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error adding attendee to event:', error);
    return { success: false, error };
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    const eventRef = doc(FIRESTORE_DB, 'events', eventId);
    await deleteDoc(eventRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting event:', error);
    return { success: false, error };
  }
}; 