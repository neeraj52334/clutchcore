-- Fix all problematic RLS policies for mahasagram_tournaments
-- Drop all existing policies first
DROP POLICY IF EXISTS "Owners can manage all tournaments" ON public.mahasagram_tournaments;
DROP POLICY IF EXISTS "Users can view active tournaments" ON public.mahasagram_tournaments;
DROP POLICY IF EXISTS "Tournament managers and owners can view tournaments" ON public.mahasagram_tournaments;
DROP POLICY IF EXISTS "Only owners can create tournaments" ON public.mahasagram_tournaments;
DROP POLICY IF EXISTS "Only owners can update tournaments" ON public.mahasagram_tournaments;

-- Create a security definer function to check if user is owner
CREATE OR REPLACE FUNCTION public.is_user_owner()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'owner'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create simple, non-recursive policies
CREATE POLICY "Owners can manage tournaments" 
ON public.mahasagram_tournaments 
FOR ALL 
USING (public.is_user_owner());

CREATE POLICY "Tournament creators can manage their tournaments" 
ON public.mahasagram_tournaments 
FOR ALL 
USING (auth.uid() = created_by);

CREATE POLICY "Anyone can view active tournaments" 
ON public.mahasagram_tournaments 
FOR SELECT 
USING (status IN ('active', 'upcoming', 'completed'));