
CREATE TABLE public.knowledge_base (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('artigo', 'livro', 'video', 'guia')),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  author TEXT,
  suggested_by UUID,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved items" ON public.knowledge_base
  FOR SELECT USING (approved = true);

CREATE POLICY "Authenticated users can suggest items" ON public.knowledge_base
  FOR INSERT WITH CHECK (auth.uid() = suggested_by);

CREATE POLICY "Admins can manage all items" ON public.knowledge_base
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert some seed content
INSERT INTO public.knowledge_base (type, title, description, url, author, approved) VALUES
('artigo', 'O que é o Transtorno do Espectro Autista?', 'Guia introdutório sobre TEA, sinais e diagnóstico.', 'https://www.autismspeaks.org/what-autism', 'Autism Speaks', true),
('artigo', 'Estratégias de comunicação para crianças autistas', 'Técnicas práticas para melhorar a comunicação.', null, 'Casa dos Autistas', true),
('livro', 'O Cérebro Autista', 'Temple Grandin explora como o autismo funciona.', 'https://www.amazon.com.br/C%C3%A9rebro-Autista-Temple-Grandin/dp/8501402613', 'Temple Grandin', true),
('livro', 'Neurotribos', 'A história do autismo e o futuro da neurodiversidade.', null, 'Steve Silberman', true),
('video', 'Entendendo o Autismo em 5 minutos', 'Vídeo explicativo e acessível sobre TEA.', 'https://www.youtube.com/watch?v=example1', 'Canal Saúde', true),
('guia', 'Como navegar no site Casa dos Autistas', 'Passo a passo para usar todas as funcionalidades da plataforma.', null, 'Casa dos Autistas', true);
