-- Add password security fields to tournaments
ALTER TABLE public.mahasagram_tournaments 
ADD COLUMN is_password_protected BOOLEAN DEFAULT FALSE,
ADD COLUMN tournament_password TEXT;