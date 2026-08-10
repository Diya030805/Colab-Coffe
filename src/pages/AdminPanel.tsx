import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Printer } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export function AdminPanel() {
  const [isAdminSetup, setIsAdminSetup] = useState<boolean | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [reservations, setReservations] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(false);
  const [isMenuFormOpen, setIsMenuFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMenuItem, setEditingMenuItem] = useState<any | null>(null);
  const [menuFormData, setMenuFormData] = useState({ name: '', description: '', price: 0, category: '', is_signature: false, is_popular: false, contains_egg: false, dietary: '', type: '', availability: true });

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const res = await fetch('/api/admin/status');
      const data = await res.json();
      setIsAdminSetup(data.hasAdmin);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load status');
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      const res = await fetch('/api/admin/reservations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (!res.ok) {
        if (res.status === 401) {
          setIsLoggedIn(false);
          localStorage.removeItem('adminToken');
          return;
        }
        throw new Error('Failed to fetch');
      }
      const data = await res.json();
      setReservations(data.data || []);
    } catch (err) {
      setError('Failed to fetch reservations');
    }
  };

  const fetchMenu = async () => {
    setMenuLoading(true);
    try {
      const res = await fetch('/api/admin/menu', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          return;
        }
        throw new Error(data.error);
      }
      setMenuItems(data.data);
    } catch (err: any) {
      setError('Failed to fetch menu');
    } finally {
      setMenuLoading(false);
    }
  };

  const saveMenuItem = async () => {
    try {
      const url = editingMenuItem ? `/api/admin/menu/${editingMenuItem.id}` : '/api/admin/menu';
      const method = editingMenuItem ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(menuFormData)
      });
      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          return;
        }
        throw new Error('Failed to save');
      }
      
      setIsMenuFormOpen(false);
      setMenuFormData({ name: '', description: '', price: 0, category: '', is_signature: false, is_popular: false, contains_egg: false, dietary: '', type: '', availability: true });
      fetchMenu();
    } catch (err) {
      setError('Failed to save menu item');
    }
  };

  const deleteMenuItem = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    console.log("Attempting to delete item:", id);
    try {
      const res = await fetch(`/api/admin/menu/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          return;
        }
        throw new Error('Failed to delete');
      }
      fetchMenu();
    } catch (err) {
      console.error("Delete error:", err);
      setError('Failed to delete menu item');
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchReservations();
      fetchMenu();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      localStorage.setItem('adminToken', data.token);
      setIsLoggedIn(true);
      setIsAdminSetup(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      localStorage.setItem('adminToken', data.token);
      setIsLoggedIn(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
  };

  const downloadCSV = () => {
    if (reservations.length === 0) {
      alert("No reservations to download.");
      return;
    }

    const headers = ["Date", "Time", "Name", "Phone", "Guests", "Created At"];
    const rows = reservations.map(res => [
      res.date,
      res.time,
      `"${(res.name || '').replace(/"/g, '""')}"`,
      res.phone,
      res.guests,
      new Date(res.created_at).toLocaleString()
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `reservations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReservation = (res: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const receiptHtml = `
      <html>
        <head>
          <title>Reservation Receipt - ${res.name}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #1a1a1a; }
            .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; letter-spacing: -0.02em; }
            .receipt-title { font-size: 18px; color: #666; margin-top: 5px; }
            .details { margin-bottom: 30px; line-height: 1.6; }
            .row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed #eee; padding-bottom: 5px; }
            .label { font-weight: 600; color: #666; }
            .footer { text-align: center; font-size: 12px; color: #999; margin-top: 50px; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">CoLab Coffee Calcutta</div>
            <div class="receipt-title">Table Reservation Receipt</div>
          </div>
          
          <div class="details">
            <div class="row"><span class="label">Guest Name:</span> <span>${res.name}</span></div>
            <div class="row"><span class="label">Date:</span> <span>${res.date}</span></div>
            <div class="row"><span class="label">Time:</span> <span>${res.time}</span></div>
            <div class="row"><span class="label">Guests:</span> <span>${res.guests} people</span></div>
            <div class="row"><span class="label">Phone:</span> <span>${res.phone}</span></div>
            <div class="row"><span class="label">Booking Ref:</span> <span>${res.id.slice(0, 8).toUpperCase()}</span></div>
          </div>

          <div class="footer">
            Thank you for choosing CoLab Coffee. We look forward to seeing you!<br>
            www.colabcoffee.in
          </div>

          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(receiptHtml);
    printWindow.document.close();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-base text-primary">Loading...</div>;
  }

  if (isLoggedIn) {
    const filteredReservations = reservations.filter(res => 
      res.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      res.date?.includes(searchQuery)
    );

    return (
      <div className="min-h-screen bg-base p-8 text-primary">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-3xl font-serif">Admin Panel</h1>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto relative z-50">
              <input
                type="text"
                placeholder="Search by name or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 focus:outline-none focus:border-primary text-primary relative z-10"
              />
              <div className="flex items-center gap-4 shrink-0 relative z-20">
                <button 
                  onClick={downloadCSV}
                  className="relative z-50 pointer-events-auto cursor-pointer px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors text-sm font-medium shadow-sm flex items-center gap-2"
                >
                  Download CSV
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm("Permanently clear test view?")) {
                      setReservations([]);
                      if (typeof window !== 'undefined') {
                        localStorage.removeItem('reservations');
                        localStorage.clear();
                      }
                      alert("Display purged successfully!");
                    }
                  }}
                  className="relative z-50 pointer-events-auto cursor-pointer px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-medium shadow-sm"
                >
                  Delete All Test Data
                </button>
                <a href="/" className="hover:underline text-sm relative z-10">Back to Site</a>
                <button onClick={handleLogout} className="bg-primary text-base px-4 py-2 rounded-full text-sm relative z-10">Logout</button>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/5 rounded-2xl p-6 shadow-sm border border-primary/10">
            <h2 className="text-xl font-medium mb-4">Reservations</h2>
            {filteredReservations.length === 0 ? (
              <p>No reservations found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-primary/10">
                      <th className="py-2">Date</th>
                      <th className="py-2">Time</th>
                      <th className="py-2">Name</th>
                      <th className="py-2">Phone</th>
                      <th className="py-2">Guests</th>
                      <th className="py-2">Created At</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.map((res: any, index: number) => (
                      <motion.tr 
                        key={res.id} 
                        className="border-b border-primary/10 last:border-0 hover:bg-primary/5 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <td className="py-2">{res.date}</td>
                        <td className="py-2">{res.time}</td>
                        <td className="py-2">{res.name}</td>
                        <td className="py-2">{res.phone}</td>
                        <td className="py-2">{res.guests}</td>
                        <td className="py-2">{new Date(res.created_at).toLocaleDateString()}</td>
                        <td className="py-2 text-right">
                          <button 
                            onClick={() => printReservation(res)}
                            className="p-2 text-primary/40 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            title="Print Receipt"
                          >
                            <Printer size={18} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-primary/5 rounded-2xl p-6 shadow-sm border border-primary/10 mt-8">
            <h2 className="text-xl font-medium mb-4">Menu Management</h2>
            <button 
              onClick={() => { setEditingMenuItem(null); setMenuFormData({ name: '', description: '', price: 0, category: '', is_signature: false, is_popular: false, contains_egg: false, dietary: '', type: '', availability: true }); setIsMenuFormOpen(true); }}
              className="bg-primary text-base px-4 py-2 rounded-full mb-4"
            >
              Add Menu Item
            </button>
            {menuLoading ? <p>Loading menu...</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-primary/10">
                      <th className="py-2">Name</th>
                      <th className="py-2">Category</th>
                      <th className="py-2">Price</th>
                      <th className="py-2">Availability</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map((item: any) => (
                      <tr key={item.id} className="border-b border-primary/10 last:border-0">
                        <td className="py-2">{item.name}</td>
                        <td className="py-2">{item.category}</td>
                        <td className="py-2">${item.price}</td>
                        <td className="py-2">{item.availability ? 'Yes' : 'No'}</td>
                        <td className="py-2 flex gap-2">
                          <button onClick={() => { setEditingMenuItem(item); setMenuFormData(item); setIsMenuFormOpen(true); }} className="text-sm underline">Edit</button>
                          <button onClick={() => deleteMenuItem(item.id)} className="text-sm text-red-500 underline">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {isMenuFormOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-base p-6 rounded-2xl w-full max-w-lg">
              <h2 className="text-xl font-medium mb-4">{editingMenuItem ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
              <form onSubmit={(e) => { e.preventDefault(); saveMenuItem(); }} className="space-y-4">
                <input value={menuFormData.name} onChange={(e) => setMenuFormData({...menuFormData, name: e.target.value})} placeholder="Name" className="w-full bg-base border border-primary/20 rounded-md p-2" required />
                <textarea value={menuFormData.description} onChange={(e) => setMenuFormData({...menuFormData, description: e.target.value})} placeholder="Description" className="w-full bg-base border border-primary/20 rounded-md p-2" />
                <input type="number" value={menuFormData.price} onChange={(e) => setMenuFormData({...menuFormData, price: parseFloat(e.target.value)})} placeholder="Price" className="w-full bg-base border border-primary/20 rounded-md p-2" required />
                <input value={menuFormData.category} onChange={(e) => setMenuFormData({...menuFormData, category: e.target.value})} placeholder="Category" className="w-full bg-base border border-primary/20 rounded-md p-2" required />
                <input value={menuFormData.dietary} onChange={(e) => setMenuFormData({...menuFormData, dietary: e.target.value})} placeholder="Dietary (comma separated)" className="w-full bg-base border border-primary/20 rounded-md p-2" />
                <input value={menuFormData.type} onChange={(e) => setMenuFormData({...menuFormData, type: e.target.value})} placeholder="Type" className="w-full bg-base border border-primary/20 rounded-md p-2" />
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={menuFormData.availability} onChange={(e) => setMenuFormData({...menuFormData, availability: e.target.checked})} />
                  Available
                </label>
                <div className="flex gap-4 mt-4">
                  <button type="submit" className="bg-primary text-base px-4 py-2 rounded-full">Save</button>
                  <button type="button" onClick={() => setIsMenuFormOpen(false)} className="bg-primary/20 px-4 py-2 rounded-full">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      <div className="bg-primary/5 border border-primary/10 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-serif text-center mb-6 text-primary">
          {isAdminSetup === false ? 'Admin Setup' : 'Admin Login'}
        </h1>
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">{error}</div>}
        <form onSubmit={isAdminSetup === false ? handleSignup : handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-primary">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-base border border-primary/20 rounded-md p-2 focus:outline-none focus:border-primary text-primary"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-primary">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-base border border-primary/20 rounded-md p-2 focus:outline-none focus:border-primary text-primary"
            />
          </div>
          <button type="submit" className="w-full bg-primary text-base py-2 rounded-full hover:bg-primary/90 transition-colors">
            {isAdminSetup === false ? 'Create Admin Account' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/" className="text-sm text-primary/60 hover:text-primary underline">Return to site</a>
        </div>
      </div>
    </div>
  );
}
