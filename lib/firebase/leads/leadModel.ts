import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../config';

export interface Lead {
  name: string;
  business: string;
  email: string;
  phone: string;
  createdAt: any;
}

export interface LeadWithId extends Lead {
  id: string;
}

export const addLead = async (leadData: Omit<Lead, 'createdAt'>) => {
  try {
    const leadsCollection = collection(FIRESTORE_DB, 'leads');
    const docRef = await addDoc(leadsCollection, {
      ...leadData,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding lead:', error);
    return { success: false, error };
  }
};

export const getLeads = async (): Promise<LeadWithId[]> => {
  try {
    const leadsCollection = collection(FIRESTORE_DB, 'leads');
    const leadsQuery = query(leadsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(leadsQuery);
    
    const leads: LeadWithId[] = [];
    querySnapshot.forEach((doc) => {
      leads.push({
        id: doc.id,
        ...(doc.data() as Lead)
      });
    });
    
    return leads;
  } catch (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
};

export const deleteLead = async (leadId: string) => {
  try {
    const leadRef = doc(FIRESTORE_DB, 'leads', leadId);
    await deleteDoc(leadRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting lead:', error);
    return { success: false, error };
  }
};
