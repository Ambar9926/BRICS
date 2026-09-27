-- Add security_code column to admin_profiles for extra admin authentication
ALTER TABLE admin_profiles ADD COLUMN IF NOT EXISTS security_code TEXT;

-- Set a 40-character security code for the existing admin user
UPDATE admin_profiles
SET security_code = 'BRICS-DPI-7K9m2Xp4Qr8Nv3Wz6Yt1Lj5Hf0Cs4Eb8Aa2Ro7Dq'
WHERE email = 'admin@brics-dpi.gov';
