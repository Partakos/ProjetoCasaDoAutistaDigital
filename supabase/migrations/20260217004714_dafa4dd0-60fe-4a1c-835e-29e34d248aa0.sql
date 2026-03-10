
-- Add diagnosis and age columns to children table
ALTER TABLE public.children 
ADD COLUMN IF NOT EXISTS age integer,
ADD COLUMN IF NOT EXISTS diagnosis text,
ADD COLUMN IF NOT EXISTS school text;

-- Family reports table (responsável preenche)
CREATE TABLE public.family_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id uuid NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  
  -- Comunicação
  speaks_full_sentences text DEFAULT 'parcial' CHECK (speaks_full_sentences IN ('sim', 'nao', 'parcial')),
  uses_alternative_communication boolean DEFAULT false,
  maintains_eye_contact text DEFAULT 'parcial' CHECK (maintains_eye_contact IN ('sim', 'nao', 'parcial')),
  responds_when_called text DEFAULT 'parcial' CHECK (responds_when_called IN ('sim', 'nao', 'parcial')),
  
  -- Desenvolvimento Cognitivo
  recognizes_colors boolean DEFAULT false,
  recognizes_numbers boolean DEFAULT false,
  follows_simple_instructions boolean DEFAULT false,
  follows_complex_instructions boolean DEFAULT false,
  
  -- Sensibilidade Sensorial
  allows_haircut boolean DEFAULT true,
  sensitive_to_loud_sounds boolean DEFAULT false,
  sensitive_to_touch boolean DEFAULT false,
  texture_difficulty boolean DEFAULT false,
  
  -- Socialização
  interacts_with_children boolean DEFAULT false,
  prefers_playing_alone boolean DEFAULT true,
  shows_empathy boolean DEFAULT false,
  
  -- Autonomia
  eats_alone boolean DEFAULT false,
  uses_bathroom_alone boolean DEFAULT false,
  dresses_alone boolean DEFAULT false,
  
  -- Observações
  notes text
);

ALTER TABLE public.family_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Responsibles can insert family reports"
ON public.family_reports FOR INSERT
WITH CHECK (
  auth.uid() = created_by AND
  EXISTS (SELECT 1 FROM public.children WHERE id = family_reports.child_id AND responsible_id = auth.uid())
);

CREATE POLICY "Responsibles can view own family reports"
ON public.family_reports FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.children WHERE id = family_reports.child_id AND responsible_id = auth.uid())
);

CREATE POLICY "Professionals can view family reports"
ON public.family_reports FOR SELECT
USING (public.has_role(auth.uid(), 'profissional'));

-- Professional reports table
CREATE TABLE public.professional_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id uuid NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  
  -- Avaliação Escolar
  attention_score integer DEFAULT 3 CHECK (attention_score >= 1 AND attention_score <= 5),
  participation_score integer DEFAULT 3 CHECK (participation_score >= 1 AND participation_score <= 5),
  focus_duration_minutes integer DEFAULT 0,
  responds_to_commands text DEFAULT 'parcial' CHECK (responds_to_commands IN ('sim', 'nao', 'parcial')),
  
  -- Comportamento
  crisis_frequency text DEFAULT 'raramente' CHECK (crisis_frequency IN ('nunca', 'raramente', 'semanal', 'diario', 'multiplas_vezes_dia')),
  trigger_stimuli text,
  working_strategies text,
  
  -- Desempenho Acadêmico
  literacy_level text DEFAULT 'pre_alfabetizacao' CHECK (literacy_level IN ('pre_alfabetizacao', 'inicial', 'intermediario', 'avancado')),
  math_level text DEFAULT 'pre_alfabetizacao' CHECK (math_level IN ('pre_alfabetizacao', 'inicial', 'intermediario', 'avancado')),
  motor_coordination text DEFAULT 'em_desenvolvimento' CHECK (motor_coordination IN ('em_desenvolvimento', 'adequada', 'avancada')),
  
  -- Plano Individualizado
  quarterly_goals text,
  recommended_interventions text,
  
  -- Observações
  notes text
);

ALTER TABLE public.professional_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals can insert professional reports"
ON public.professional_reports FOR INSERT
WITH CHECK (
  auth.uid() = created_by AND public.has_role(auth.uid(), 'profissional')
);

CREATE POLICY "Professionals can view professional reports"
ON public.professional_reports FOR SELECT
USING (public.has_role(auth.uid(), 'profissional'));

CREATE POLICY "Professionals can update own professional reports"
ON public.professional_reports FOR UPDATE
USING (auth.uid() = created_by AND public.has_role(auth.uid(), 'profissional'));

-- Messages table
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  child_id uuid REFERENCES public.children(id) ON DELETE SET NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view own messages"
ON public.messages FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can mark messages as read"
ON public.messages FOR UPDATE
USING (auth.uid() = receiver_id)
WITH CHECK (auth.uid() = receiver_id);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
