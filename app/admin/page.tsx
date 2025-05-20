'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/lib/firebase/config';
import { Lead } from '@/lib/firebase/leads/leadModel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, LogOut } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface LeadWithId extends Lead {
  id: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [leads, setLeads] = useState<LeadWithId[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

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
      const leadsCollection = collection(FIRESTORE_DB, 'leads');
      const leadsQuery = query(leadsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(leadsQuery);
      
      const leadsData: LeadWithId[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Lead;
        leadsData.push({ 
          id: doc.id, 
          ...data 
        });
      });
      
      setLeads(leadsData);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
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
    }
  }, [isAuthenticated]);

  const filteredLeads = leads.filter(lead => {
    return (
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
          <h1 className="text-3xl font-bold text-forest-green font-spartan">Leads Dashboard</h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2 border-2 border-forest-green text-forest-green hover:bg-forest-green hover:text-white"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search by name, business, or email..."
              className="pl-10 border-2 border-taupe"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                      <TableHead className="font-spartan">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.length > 0 ? (
                      filteredLeads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell className="font-medium">{lead.name}</TableCell>
                          <TableCell>{lead.business}</TableCell>
                          <TableCell>{lead.email}</TableCell>
                          <TableCell>{formatDate(lead.createdAt)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                          No leads found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 