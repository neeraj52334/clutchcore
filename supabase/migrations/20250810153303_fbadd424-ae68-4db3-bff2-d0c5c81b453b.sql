-- Create Mahasagram Tournaments table
CREATE TABLE public.mahasagram_tournaments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    game TEXT NOT NULL,
    prize_pool DECIMAL(10,2) NOT NULL,
    prize_pool_type TEXT NOT NULL CHECK (prize_pool_type IN ('Fixed', 'Dynamic')),
    min_teams INTEGER NOT NULL DEFAULT 24,
    max_teams INTEGER,
    format TEXT NOT NULL CHECK (format IN ('League', 'Swiss', 'Knockout')),
    placement_points TEXT, -- e.g. "15,12,10,8,6,4,2,1"
    kill_points INTEGER DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'Setup' CHECK (status IN ('Setup', 'Registration', 'Live', 'Completed')),
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Tournament Managers table
CREATE TABLE public.tournament_managers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tournament_id UUID NOT NULL REFERENCES public.mahasagram_tournaments(id) ON DELETE CASCADE,
    manager_id UUID NOT NULL,
    assigned_by UUID NOT NULL,
    permissions TEXT NOT NULL DEFAULT 'Full' CHECK (permissions IN ('Full', 'ResultsOnly', 'DisputesOnly')),
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Match Results table
CREATE TABLE public.match_results (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tournament_id UUID NOT NULL REFERENCES public.mahasagram_tournaments(id) ON DELETE CASCADE,
    team_name TEXT NOT NULL,
    match_number INTEGER NOT NULL,
    placement INTEGER NOT NULL,
    kills INTEGER NOT NULL DEFAULT 0,
    placement_points INTEGER NOT NULL DEFAULT 0,
    total_points INTEGER GENERATED ALWAYS AS (placement_points + kills) STORED,
    submitted_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Disputes table
CREATE TABLE public.disputes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tournament_id UUID NOT NULL REFERENCES public.mahasagram_tournaments(id) ON DELETE CASCADE,
    reported_by UUID NOT NULL,
    match_number INTEGER,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Under Review', 'Resolved', 'Rejected')),
    resolved_by UUID,
    resolution TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.mahasagram_tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for mahasagram_tournaments
CREATE POLICY "Tournament managers and owners can view tournaments" 
ON public.mahasagram_tournaments 
FOR SELECT 
USING (
    auth.uid() = created_by OR 
    EXISTS (
        SELECT 1 FROM public.tournament_managers 
        WHERE tournament_id = id AND manager_id = auth.uid()
    )
);

CREATE POLICY "Only owners can create tournaments" 
ON public.mahasagram_tournaments 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Only owners can update tournaments" 
ON public.mahasagram_tournaments 
FOR UPDATE 
USING (auth.uid() = created_by);

-- Create RLS policies for tournament_managers
CREATE POLICY "Tournament managers can view their assignments" 
ON public.tournament_managers 
FOR SELECT 
USING (
    manager_id = auth.uid() OR 
    assigned_by = auth.uid() OR
    EXISTS (
        SELECT 1 FROM public.mahasagram_tournaments 
        WHERE id = tournament_id AND created_by = auth.uid()
    )
);

CREATE POLICY "Only owners can assign managers" 
ON public.tournament_managers 
FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.mahasagram_tournaments 
        WHERE id = tournament_id AND created_by = auth.uid()
    )
);

-- Create RLS policies for match_results
CREATE POLICY "Tournament participants can view results" 
ON public.match_results 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.tournament_managers 
        WHERE tournament_id = match_results.tournament_id AND manager_id = auth.uid()
    ) OR
    EXISTS (
        SELECT 1 FROM public.mahasagram_tournaments 
        WHERE id = tournament_id AND created_by = auth.uid()
    )
);

CREATE POLICY "Only tournament managers can submit results" 
ON public.match_results 
FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.tournament_managers 
        WHERE tournament_id = match_results.tournament_id AND manager_id = auth.uid()
    ) OR
    EXISTS (
        SELECT 1 FROM public.mahasagram_tournaments 
        WHERE id = tournament_id AND created_by = auth.uid()
    )
);

-- Create RLS policies for disputes
CREATE POLICY "Tournament staff can view disputes" 
ON public.disputes 
FOR SELECT 
USING (
    reported_by = auth.uid() OR
    EXISTS (
        SELECT 1 FROM public.tournament_managers 
        WHERE tournament_id = disputes.tournament_id AND manager_id = auth.uid()
    ) OR
    EXISTS (
        SELECT 1 FROM public.mahasagram_tournaments 
        WHERE id = tournament_id AND created_by = auth.uid()
    )
);

CREATE POLICY "Anyone can report disputes" 
ON public.disputes 
FOR INSERT 
WITH CHECK (auth.uid() = reported_by);

-- Create indexes for better performance
CREATE INDEX idx_tournament_managers_tournament ON public.tournament_managers(tournament_id);
CREATE INDEX idx_tournament_managers_manager ON public.tournament_managers(manager_id);
CREATE INDEX idx_match_results_tournament ON public.match_results(tournament_id);
CREATE INDEX idx_match_results_team ON public.match_results(team_name);
CREATE INDEX idx_disputes_tournament ON public.disputes(tournament_id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_mahasagram_tournaments_updated_at
BEFORE UPDATE ON public.mahasagram_tournaments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;