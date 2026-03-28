
CREATE TABLE IF NOT EXISTS public.blog_settings (
    id SERIAL PRIMARY KEY,
    is_active BOOLEAN DEFAULT true,
    schedule_time TIME DEFAULT '08:00',
    last_run_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.blog_settings (id, is_active, schedule_time) 
VALUES (1, true, '08:00') 
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.blog_settings ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_settings' AND policyname = 'allow_read') THEN
        CREATE POLICY allow_read ON public.blog_settings FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_settings' AND policyname = 'allow_update') THEN
        CREATE POLICY allow_update ON public.blog_settings FOR UPDATE USING (true);
    END IF;
END $$;
