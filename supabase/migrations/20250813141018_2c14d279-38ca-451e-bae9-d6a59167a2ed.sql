-- Fix infinite recursion in mahasagram_tournaments policies
-- Drop existing policies
DROP POLICY IF EXISTS "Owners can manage all tournaments" ON public.mahasagram_tournaments;
DROP POLICY IF EXISTS "Users can view active tournaments" ON public.mahasagram_tournaments;

-- Create new policies without recursion
CREATE POLICY "Owners can manage all tournaments" 
ON public.mahasagram_tournaments 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'owner'
  )
);

CREATE POLICY "Users can view active tournaments" 
ON public.mahasagram_tournaments 
FOR SELECT 
USING (status = 'active' OR status = 'upcoming');