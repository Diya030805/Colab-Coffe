import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-fallback';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get('/lofi.mp3', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'lofi.mp3'), {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Accept-Ranges': 'bytes',
      }
    });
  });

  app.use(express.static('public'));

  // Supabase initialization
  let supabaseUrl = process.env.SUPABASE_URL || '';
  if (supabaseUrl.endsWith('/rest/v1/')) {
    supabaseUrl = supabaseUrl.replace('/rest/v1/', '');
  } else if (supabaseUrl.endsWith('/rest/v1')) {
    supabaseUrl = supabaseUrl.replace('/rest/v1', '');
  }
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  async function ensureBucketExists() {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(b => b.name === 'menu-images')) {
        await supabase.storage.createBucket('menu-images', { public: true });
        console.log("Bucket 'menu-images' created.");
      }
    } catch (e) {
      console.error("Failed to ensure bucket exists:", e);
    }
  }
  ensureBucketExists();

  // Function to send notification email via Supabase Edge Function
  async function sendNotificationEmail(reservationDetails: any) {
    const resendKey = process.env.RESEND_API_KEY;
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // --- DEVELOPMENT MOCK MODE FALLBACK ---
    // If keys are missing, we log and return success to avoid blocking the user flow
    if (!resendKey && !(supabaseUrl && serviceRoleKey)) {
      console.log('\n🚀 [DEVELOPMENT MOCK MODE] Email Notification System');
      console.log('--------------------------------------------------');
      console.log(`STATUS: Simulation Successful (No API Keys Found)`);
      console.log(`TO: ${reservationDetails.email}`);
      console.log(`EVENT: New Reservation Confirmed`);
      console.log(`DATE: ${reservationDetails.date} at ${reservationDetails.time}`);
      console.log(`REFERENCE: ${reservationDetails.id || 'N/A'}`);
      console.log('--------------------------------------------------\n');
      return; 
    }

    // 1. Try calling the Supabase Edge Function if configured
    if (supabaseUrl && serviceRoleKey) {
      try {
        const functionUrl = `${supabaseUrl.replace(/\/$/, '')}/functions/v1/send-reservation-email`;
        console.log(`[Edge Function] Checking for delivery function at: ${functionUrl}`);
        
        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceRoleKey}`,
          },
          body: JSON.stringify({ record: reservationDetails }),
        });

        if (response.ok) {
          console.log('✅ [Edge Function] Delivery successful');
          return;
        } else if (response.status === 404) {
          console.log('ℹ️ [Edge Function] send-reservation-email not found. Skipping and checking fallbacks.');
        } else {
          const errText = await response.text();
          console.warn(`⚠️ [Edge Function] Call failed (${response.status}): ${errText}`);
        }
      } catch (e) {
        console.error("❌ [Edge Function] Request error:", e);
      }
    }

    // 2. Try Direct Resend API as secondary fallback
    if (resendKey) {
      try {
        console.log('[Resend API] Attempting direct delivery...');
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: 'CoLab Coffee <notifications@resend.dev>',
            to: [reservationDetails.email],
            subject: `Reservation Confirmed - ${reservationDetails.date}`,
            html: `
              <div style="font-family: sans-serif; padding: 20px;">
                <h1>Booking Confirmed</h1>
                <p>Hello ${reservationDetails.name}, your reservation for ${reservationDetails.date} at ${reservationDetails.time} is confirmed.</p>
                <p>We look forward to seeing you!</p>
              </div>
            `,
          }),
        });
        
        if (response.ok) {
          console.log('✅ [Resend API] Delivery successful');
          return;
        }
      } catch (e) {
        console.error("❌ [Resend API] Request error:", e);
      }
    }

    // 3. Final Fallback: Log to console if no delivery method succeeded
    console.log('\n🚀 [FINAL FALLBACK / MOCK MODE] Email Notification Summary');
    console.log('--------------------------------------------------');
    console.log(`STATUS: Local Simulation (No Live API Success)`);
    console.log(`TO: ${reservationDetails.email}`);
    console.log(`EVENT: New Reservation Confirmed`);
    console.log(`DATE: ${reservationDetails.date} at ${reservationDetails.time}`);
    console.log('--------------------------------------------------\n');
  }

  app.post("/api/reserve", async (req, res) => {
    try {
      const { name, email, phone, date, time, guests } = req.body;
      
      const { data, error } = await supabase
        .from('reservations')
        .insert([{ 
          name, 
          email, 
          phone, 
          date, 
          time, 
          guests 
        }])
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", JSON.stringify(error));
        return res.status(500).json({ error: error.message, code: error.code });
      }

      // Trigger notification email
      await sendNotificationEmail(data).catch(e => {
        console.error("Failed to send email notification:", e);
      });

      res.json({ success: true, data });
    } catch (e: any) {
      console.error("Server error:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin routes
  app.get('/api/admin/status', async (req, res) => {
    try {
      const { data, error, count } = await supabase
        .from('admin_users')
        .select('*', { count: 'exact', head: true });
        
      if (error && error.code !== 'PGRST205') {
        throw error;
      }
      
      // If table doesn't exist (PGRST205) or count is 0, we have no admin
      const hasAdmin = !error && count !== null && count > 0;
      res.json({ hasAdmin });
    } catch (e: any) {
      console.error("Status error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/admin/signup', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Check if admin already exists
      const { count, error: countError } = await supabase
        .from('admin_users')
        .select('*', { count: 'exact', head: true });
        
      if (!countError && count !== null && count > 0) {
        return res.status(403).json({ error: "Admin already exists" });
      }
      
      const password_hash = await bcrypt.hash(password, 10);
      
      const { data, error } = await supabase
        .from('admin_users')
        .insert([{ email, password_hash }])
        .select()
        .single();
        
      if (error) throw error;
      
      const token = jwt.sign({ id: data.id, email: data.email }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token });
    } catch (e: any) {
      console.error("Signup error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/admin/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single();
        
      if (error || !data) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const valid = await bcrypt.compare(password, data.password_hash);
      if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const token = jwt.sign({ id: data.id, email: data.email }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token });
    } catch (e: any) {
      console.error("Login error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/admin/reservations', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const token = authHeader.split(' ')[1];
      jwt.verify(token, JWT_SECRET);
      
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      res.json({ data });
    } catch (e: any) {
      if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
        console.warn(`Auth failure: ${e.name}`);
        return res.status(401).json({ error: "Invalid token", code: e.name });
      }
      console.error("Fetch error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  // Menu Management routes
  app.get('/api/admin/menu', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const token = authHeader.split(' ')[1];
      jwt.verify(token, JWT_SECRET);
      
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      res.json({ data });
    } catch (e: any) {
      if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
        console.warn(`Menu fetch auth failure: ${e.name}`);
        return res.status(401).json({ error: "Invalid token", code: e.name });
      }
      console.error("Menu fetch error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/admin/menu', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const token = authHeader.split(' ')[1];
      jwt.verify(token, JWT_SECRET);
      
      const { name, description, price, category, is_signature, is_popular, contains_egg, dietary, type, availability } = req.body;
      
      const insertData: any = { name, description, price: Number(price), category, availability };
      if (is_signature !== undefined) insertData.is_signature = is_signature === 'true' || is_signature === true;
      if (is_popular !== undefined) insertData.is_popular = is_popular === 'true' || is_popular === true;
      if (contains_egg !== undefined) insertData.contains_egg = contains_egg === 'true' || contains_egg === true;
      
      // Handle array fields: if empty string, send empty array
      insertData.dietary = (dietary && dietary !== "") ? (Array.isArray(dietary) ? dietary : [dietary]) : [];
      insertData.type = (type && type !== "") ? (Array.isArray(type) ? type : [type]) : [];

      const { data, error } = await supabase
        .from('menu_items')
        .insert([insertData])
        .select()
        .single();
        
      if (error) {
        console.error("Supabase insert error details:", JSON.stringify(error, null, 2));
        throw error;
      }
      
      res.json({ data });
    } catch (e: any) {
      if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
        console.warn(`Menu insert auth failure: ${e.name}`);
        return res.status(401).json({ error: "Invalid token", code: e.name });
      }
      console.error("Menu insert error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.put('/api/admin/menu/:id', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const token = authHeader.split(' ')[1];
      jwt.verify(token, JWT_SECRET);
      
      const { id } = req.params;
      const updates = req.body;
      
      // Handle boolean strings
      if (updates.is_signature !== undefined) updates.is_signature = updates.is_signature === 'true' || updates.is_signature === true;
      if (updates.is_popular !== undefined) updates.is_popular = updates.is_popular === 'true' || updates.is_popular === true;
      if (updates.contains_egg !== undefined) updates.contains_egg = updates.contains_egg === 'true' || updates.contains_egg === true;
      if (updates.availability !== undefined) updates.availability = updates.availability === 'true' || updates.availability === true;
      if (updates.price !== undefined) updates.price = Number(updates.price);

      // Handle array fields: if empty string, send empty array
      if (updates.dietary !== undefined) {
          updates.dietary = (updates.dietary && updates.dietary !== "") ? (Array.isArray(updates.dietary) ? updates.dietary : [updates.dietary]) : [];
      }
      if (updates.type !== undefined) {
          updates.type = (updates.type && updates.type !== "") ? (Array.isArray(updates.type) ? updates.type : [updates.type]) : [];
      }
      
      const { data, error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      res.json({ data });
    } catch (e: any) {
      if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
        console.warn(`Menu update auth failure: ${e.name}`);
        return res.status(401).json({ error: "Invalid token", code: e.name });
      }
      console.error("Menu update error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/admin/menu/:id', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const token = authHeader.split(' ')[1];
      jwt.verify(token, JWT_SECRET);
      
      const { id } = req.params;
      console.log("Deleting menu item with ID:", id);
      
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error("Menu delete error:", error);
        throw error;
      }
      
      res.json({ success: true });
    } catch (e: any) {
      if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
        console.warn(`Menu delete auth failure: ${e.name}`);
        return res.status(401).json({ error: "Invalid token", code: e.name });
      }
      console.error("Menu delete error details:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/admin/purge-database', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const token = authHeader.split(' ')[1];
      jwt.verify(token, JWT_SECRET);

      // Clear all reservations and menu items using universal filters
      // We use the most robust filter to target all existing rows regardless of ID type
      const { error: resError } = await supabase
        .from('reservations')
        .delete()
        .filter('id', 'not.is', null);

      if (resError) {
        console.error("Supabase reservations delete error:", resError);
        throw resError;
      }

      const { error: menuError } = await supabase
        .from('menu_items')
        .delete()
        .filter('id', 'not.is', null);

      if (menuError) {
        console.error("Supabase menu_items delete error:", menuError);
        throw menuError;
      }

      res.status(200).json({ message: "Database cleared successfully" });
    } catch (e: any) {
      if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
        console.warn(`Purge auth failure: ${e.name}`);
        return res.status(401).json({ error: "Invalid token", code: e.name });
      }
      console.error("Purge Endpoint Error:", e);
      res.status(500).json({ error: e.message || "Internal server error during purge" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
