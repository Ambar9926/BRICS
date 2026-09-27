/*
# Create admin_profiles table for secure admin authentication

## Purpose
Stores admin user profiles that map to Supabase auth.users. Only users
marked as admins in this table can access the admin panel. This adds a
second layer of security on top of Supabase auth — even if someone
creates an account, they cannot access admin features unless their
row in admin_profiles exists with is_admin = true.

## New Tables
- `admin_profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, the admin's login email)
  - `is_admin` (boolean, defaults true, marks the user as an admin)
  - `display_name` (text, shown in the admin panel)
  - `created_at` (timestamptz)

## Security
- RLS enabled on admin_profiles.
- Only authenticated users can SELECT their own profile row.
- INSERT/UPDATE/DELETE are blocked from the client — admin rows are
  managed server-side only (via service role key), preventing users
  from self-promoting themselves to admin.
*/

CREATE TABLE IF NOT EXISTS admin_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  is_admin boolean NOT NULL DEFAULT true,
  display_name text NOT NULL DEFAULT 'Administrator',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read only their own profile
DROP POLICY IF EXISTS "select_own_admin_profile" ON admin_profiles;
CREATE POLICY "select_own_admin_profile"
  ON admin_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- No INSERT, UPDATE, or DELETE policies — these are server-side only
-- via the service role key, so no client can create or modify admin status.