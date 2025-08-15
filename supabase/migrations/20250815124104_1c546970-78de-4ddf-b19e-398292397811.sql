-- Create challenges table
CREATE TABLE public.challenges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id uuid NOT NULL,
  game text NOT NULL,
  type text NOT NULL,
  entry_fee integer NOT NULL,
  challenge_id text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'open',
  opponent_id uuid,
  room_id text,
  room_password text,
  winner_id uuid,
  platform_fee integer DEFAULT 0,
  prize_amount integer DEFAULT 0
);

-- Create challenge_chat table for chat messages
CREATE TABLE public.challenge_chat (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id uuid NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  message text,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create challenge_results table for result management
CREATE TABLE public.challenge_results (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id uuid NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  submitted_by uuid NOT NULL,
  winner_id uuid NOT NULL,
  evidence_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  approved_by uuid,
  approved_at timestamp with time zone
);

-- Enable Row Level Security
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_results ENABLE ROW LEVEL SECURITY;

-- Create policies for challenges
CREATE POLICY "Anyone can view open challenges" 
ON public.challenges 
FOR SELECT 
USING (status = 'open' OR creator_id = auth.uid() OR opponent_id = auth.uid());

CREATE POLICY "Users can create their own challenges" 
ON public.challenges 
FOR INSERT 
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own challenges" 
ON public.challenges 
FOR UPDATE 
USING (auth.uid() = creator_id OR auth.uid() = opponent_id);

-- Create policies for challenge_chat
CREATE POLICY "Challenge participants can view chat" 
ON public.challenge_chat 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.challenges 
  WHERE id = challenge_chat.challenge_id 
  AND (creator_id = auth.uid() OR opponent_id = auth.uid())
));

CREATE POLICY "Challenge participants can send messages" 
ON public.challenge_chat 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.challenges 
    WHERE id = challenge_chat.challenge_id 
    AND (creator_id = auth.uid() OR opponent_id = auth.uid())
  )
);

-- Create policies for challenge_results
CREATE POLICY "Challenge participants can view results" 
ON public.challenge_results 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.challenges 
  WHERE id = challenge_results.challenge_id 
  AND (creator_id = auth.uid() OR opponent_id = auth.uid())
));

CREATE POLICY "Only P-hosts can submit results" 
ON public.challenge_results 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'p_host'
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_challenges_updated_at
BEFORE UPDATE ON public.challenges
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();