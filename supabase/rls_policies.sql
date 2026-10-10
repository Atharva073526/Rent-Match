-- ============================================================================
-- RENTMATCH: MUTUAL MERIT PLATFORM
-- Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on all sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE landlord_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE mutual_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE lease_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

-- 1. USERS POLICIES
-- Anyone authenticated can read user public profiles
CREATE POLICY "Public user profile read" 
ON users FOR SELECT 
USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own record" 
ON users FOR UPDATE 
USING (auth.uid() = id);

-- 2. PROPERTIES POLICIES
-- Anyone can view published properties
CREATE POLICY "Public properties read" 
ON properties FOR SELECT 
USING (status = 'published' OR auth.uid() = landlord_id);

-- Landlords can insert properties
CREATE POLICY "Landlords can insert properties" 
ON properties FOR INSERT 
WITH CHECK (auth.uid() = landlord_id);

-- Landlords can update their own properties
CREATE POLICY "Landlords can update own properties" 
ON properties FOR UPDATE 
USING (auth.uid() = landlord_id);

-- Landlords can delete their own properties
CREATE POLICY "Landlords can delete own properties" 
ON properties FOR DELETE 
USING (auth.uid() = landlord_id);

-- 3. SAVED PROPERTIES POLICIES
CREATE POLICY "Users can manage own saved properties" 
ON saved_properties FOR ALL 
USING (auth.uid() = user_id);

-- 4. MUTUAL MATCHES POLICIES
-- Only the participating tenant or landlord can view their matches
CREATE POLICY "Participants view matches" 
ON mutual_matches FOR SELECT 
USING (auth.uid() = tenant_id OR auth.uid() = landlord_id);

-- Tenants can initiate matches
CREATE POLICY "Tenants initiate matches" 
ON mutual_matches FOR INSERT 
WITH CHECK (auth.uid() = tenant_id);

-- Participating landlord or tenant can update match state
CREATE POLICY "Participants update match state" 
ON mutual_matches FOR UPDATE 
USING (auth.uid() = tenant_id OR auth.uid() = landlord_id);

-- 5. RENTAL APPLICATIONS POLICIES
-- Only tenant or landlord can view application
CREATE POLICY "Application participants view" 
ON rental_applications FOR SELECT 
USING (auth.uid() = tenant_id OR auth.uid() = landlord_id);

CREATE POLICY "Tenants submit application" 
ON rental_applications FOR INSERT 
WITH CHECK (auth.uid() = tenant_id);

CREATE POLICY "Participants update application" 
ON rental_applications FOR UPDATE 
USING (auth.uid() = tenant_id OR auth.uid() = landlord_id);

-- 6. LEASE AGREEMENTS POLICIES
CREATE POLICY "Lease participants view" 
ON lease_agreements FOR SELECT 
USING (auth.uid() = tenant_id OR auth.uid() = landlord_id);

CREATE POLICY "Lease participants sign/update" 
ON lease_agreements FOR UPDATE 
USING (auth.uid() = tenant_id OR auth.uid() = landlord_id);

-- 7. CONVERSATIONS & CHAT MESSAGES POLICIES
CREATE POLICY "Conversation participants view" 
ON conversations FOR SELECT 
USING (auth.uid() = tenant_id OR auth.uid() = landlord_id);

CREATE POLICY "Message participants view" 
ON chat_messages FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM conversations c 
    WHERE c.id = chat_messages.conversation_id 
    AND (c.tenant_id = auth.uid() OR c.landlord_id = auth.uid())
  )
);

CREATE POLICY "Message participants send" 
ON chat_messages FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM conversations c 
    WHERE c.id = conversation_id 
    AND (c.tenant_id = auth.uid() OR c.landlord_id = auth.uid())
  )
);

-- 8. VERIFICATION REQUESTS
-- Users view own; staff/admins view all
CREATE POLICY "Users view own verifications" 
ON verification_requests FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users insert own verification" 
ON verification_requests FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 9. USER REPORTS
CREATE POLICY "Users insert reports" 
ON user_reports FOR INSERT 
WITH CHECK (auth.uid() = reporter_id);
