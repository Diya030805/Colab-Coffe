-- Run this in the Supabase SQL Editor to allow the backend to read/write using the anon key

DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.reservations;
DROP POLICY IF EXISTS "Anon Full Access Reservations" ON public.reservations;
CREATE POLICY "Anon Full Access Reservations" ON public.reservations FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon Full Access Admin Users" ON public.admin_users;
CREATE POLICY "Anon Full Access Admin Users" ON public.admin_users FOR ALL TO anon USING (true) WITH CHECK (true);

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
