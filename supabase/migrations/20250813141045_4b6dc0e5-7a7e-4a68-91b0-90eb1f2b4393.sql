-- Fix OTP expiry security issue
UPDATE auth.config 
SET 
  otp_exp = 300,  -- 5 minutes instead of default longer expiry
  password_min_length = 8,
  jwt_exp = 3600  -- 1 hour JWT expiry
WHERE TRUE;