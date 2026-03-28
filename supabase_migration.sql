-- ============================================
-- GMS - SUPABASE DATABASE MIGRATION SCRIPT
-- ============================================

-- 1. PROPERTIES TABLE
CREATE TABLE properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reference TEXT,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Disponible',
    images TEXT[] DEFAULT '{}',
    video TEXT,
    features JSONB DEFAULT '{}',
    "ownerName" TEXT,
    "ownerPhone" TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_reference ON properties(reference);

-- Sequence for property references
CREATE SEQUENCE property_reference_seq START WITH 1;

CREATE OR REPLACE FUNCTION generate_property_reference()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.reference IS NULL THEN
        NEW.reference := 'GMS-' || LPAD(nextval('property_reference_seq')::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_property_reference
    BEFORE INSERT ON properties
    FOR EACH ROW
    EXECUTE FUNCTION generate_property_reference();

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "properties_select" ON properties FOR SELECT USING (true);
CREATE POLICY "properties_insert" ON properties FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "properties_update" ON properties FOR UPDATE TO authenticated USING (true);
CREATE POLICY "properties_delete" ON properties FOR DELETE TO authenticated USING (true);


-- 2. SELLER REQUESTS TABLE
CREATE TABLE seller_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    property_type TEXT NOT NULL,
    property_address TEXT NOT NULL,
    description TEXT,
    images TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seller_requests_status ON seller_requests(status);

ALTER TABLE seller_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "seller_requests_insert" ON seller_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "seller_requests_select" ON seller_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "seller_requests_update" ON seller_requests FOR UPDATE TO authenticated USING (true);
CREATE POLICY "seller_requests_delete" ON seller_requests FOR DELETE TO authenticated USING (true);


-- 3. MANAGEMENT REQUESTS TABLE
CREATE TABLE management_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    property_type TEXT NOT NULL,
    address TEXT NOT NULL,
    description TEXT,
    furnished BOOLEAN DEFAULT false,
    images TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'Nouveau',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_management_requests_status ON management_requests(status);

ALTER TABLE management_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "management_requests_insert" ON management_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "management_requests_select" ON management_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "management_requests_update" ON management_requests FOR UPDATE TO authenticated USING (true);
CREATE POLICY "management_requests_delete" ON management_requests FOR DELETE TO authenticated USING (true);


-- 4. MESSAGES TABLE
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    property_title TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_read ON messages(read);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_insert" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "messages_select" ON messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "messages_update" ON messages FOR UPDATE TO authenticated USING (true);
CREATE POLICY "messages_delete" ON messages FOR DELETE TO authenticated USING (true);


-- 5. APPOINTMENTS TABLE
CREATE TABLE appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_reference TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT,
    appointment_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_appointments_status ON appointments(status);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "appointments_insert" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "appointments_select" ON appointments FOR SELECT TO authenticated USING (true);
CREATE POLICY "appointments_update" ON appointments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "appointments_delete" ON appointments FOR DELETE TO authenticated USING (true);


-- 6. POSTS TABLE (Blog)
CREATE TABLE posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    published BOOLEAN DEFAULT false,
    author TEXT NOT NULL DEFAULT 'GMS',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published ON posts(published);

CREATE OR REPLACE FUNCTION update_posts_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_posts_timestamp
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_posts_timestamp();

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts_public_select" ON posts FOR SELECT USING (published = true);
CREATE POLICY "posts_auth_select" ON posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "posts_insert" ON posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "posts_update" ON posts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "posts_delete" ON posts FOR DELETE TO authenticated USING (true);


-- ============================================
-- STORAGE BUCKETS (créer manuellement)
-- ============================================
-- 1. Aller dans Storage > New bucket
-- 2. Créer: "property-images" (public: ON)
-- 3. Créer: "management-uploads" (public: ON)
-- 
-- Policies pour chaque bucket:
-- SELECT: allow public
-- INSERT: allow authenticated (ou public pour management-uploads)
-- DELETE: allow authenticated
