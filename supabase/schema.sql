-- ============================================================================
-- RENTMATCH: MUTUAL MERIT PLATFORM
-- PostgreSQL / Supabase Relational Database Schema
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom Types & Enums
CREATE TYPE user_role AS ENUM ('tenant', 'landlord', 'admin');
CREATE TYPE subscription_tier AS ENUM ('free', 'tenant_premium', 'landlord_premium');
CREATE TYPE verification_status AS ENUM (
  'not_started', 
  'pending_review', 
  'verified', 
  'failed', 
  'more_info_required', 
  'manual_review_required'
);
CREATE TYPE property_furnishing AS ENUM ('unfurnished', 'semi-furnished', 'fully-furnished');
CREATE TYPE property_type AS ENUM ('apartment', 'independent_house', 'villa', 'studio', 'gated_society');
CREATE TYPE listing_status AS ENUM ('published', 'paused', 'archived', 'draft');
CREATE TYPE match_status AS ENUM (
  'interest_expressed_by_tenant', 
  'interest_expressed_by_landlord', 
  'mutual_match', 
  'declined', 
  'withdrawn'
);
CREATE TYPE application_status AS ENUM (
  'draft', 
  'submitted', 
  'under_review', 
  'more_info_requested', 
  'accepted', 
  'declined', 
  'withdrawn'
);
CREATE TYPE lease_status AS ENUM (
  'draft', 
  'tenant_signed', 
  'landlord_signed', 
  'fully_executed', 
  'cancelled'
);
CREATE TYPE report_reason AS ENUM (
  'suspicious_listing', 
  'impersonation', 
  'misleading_images', 
  'harassment', 
  'incorrect_details', 
  'rental_bidding_demand', 
  'dispute_review'
);
CREATE TYPE report_status AS ENUM ('submitted', 'under_review', 'action_taken', 'resolved', 'dismissed');

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role user_role NOT NULL DEFAULT 'tenant',
  avatar_url TEXT,
  city VARCHAR(100) NOT NULL DEFAULT 'Bengaluru',
  is_verified BOOLEAN DEFAULT FALSE,
  verification_status verification_status DEFAULT 'not_started',
  verification_badge_reason TEXT,
  subscription_tier subscription_tier DEFAULT 'free',
  subscription_expires_at TIMESTAMPTZ,
  bio TEXT,
  demo_account BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TENANT PROFILES
CREATE TABLE IF NOT EXISTS tenant_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  preferred_locations TEXT[] NOT NULL DEFAULT '{}',
  min_rent NUMERIC(12, 2) NOT NULL DEFAULT 15000,
  max_rent NUMERIC(12, 2) NOT NULL DEFAULT 60000,
  max_deposit NUMERIC(12, 2) NOT NULL DEFAULT 150000,
  target_move_in_date DATE NOT NULL,
  preferred_bhk INT[] NOT NULL DEFAULT '{2}',
  preferred_furnishing property_furnishing[] NOT NULL DEFAULT '{semi-furnished}',
  required_amenities TEXT[] NOT NULL DEFAULT '{}',
  household_type VARCHAR(50) DEFAULT 'single',
  work_mode VARCHAR(50) DEFAULT 'hybrid',
  pet_status VARCHAR(50) DEFAULT 'no_pets',
  dietary_preference VARCHAR(50) DEFAULT 'no_restriction',
  quiet_hours_preference VARCHAR(50) DEFAULT 'moderate',
  commute_priority VARCHAR(50) DEFAULT 'close_to_metro',
  profile_completeness INT DEFAULT 80,
  profession VARCHAR(150),
  employer_or_college VARCHAR(150),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LANDLORD PROFILES
CREATE TABLE IF NOT EXISTS landlord_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) DEFAULT 'individual_owner',
  portfolio_count INT DEFAULT 1,
  years_hosting INT DEFAULT 2,
  response_rate_percent INT DEFAULT 95,
  average_response_time_minutes INT DEFAULT 30,
  transparency_pledge_signed BOOLEAN DEFAULT TRUE,
  ownership_verified BOOLEAN DEFAULT FALSE,
  pan_or_gst_verified BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROPERTIES
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  landlord_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  locality VARCHAR(150) NOT NULL,
  address TEXT NOT NULL,
  pincode VARCHAR(20) NOT NULL,
  rent NUMERIC(12, 2) NOT NULL,
  deposit NUMERIC(12, 2) NOT NULL,
  maintenance NUMERIC(12, 2) DEFAULT 0,
  bhk INT NOT NULL,
  bathrooms INT NOT NULL,
  carpet_area_sqft INT NOT NULL,
  floor INT DEFAULT 1,
  total_floors INT DEFAULT 4,
  facing VARCHAR(50) DEFAULT 'East',
  furnishing property_furnishing NOT NULL DEFAULT 'semi-furnished',
  property_type property_type NOT NULL DEFAULT 'apartment',
  available_from DATE NOT NULL,
  lease_duration_months INT DEFAULT 11,
  notice_period_months INT DEFAULT 1,
  images TEXT[] NOT NULL DEFAULT '{}',
  amenities TEXT[] NOT NULL DEFAULT '{}',
  rules JSONB NOT NULL DEFAULT '{"dietaryPreference":"no_restriction","petsAllowed":true,"quietHours":"10:00 PM - 06:00 AM","wfhFriendly":true,"guestPolicy":"flexible","lockInPeriodMonths":6}'::jsonb,
  verification_status verification_status DEFAULT 'pending_review',
  verification_badge_reason TEXT,
  c2pa_authentic BOOLEAN DEFAULT TRUE,
  status listing_status DEFAULT 'published',
  views_count INT DEFAULT 0,
  inquiries_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SAVED PROPERTIES (FAVORITES)
CREATE TABLE IF NOT EXISTS saved_properties (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, property_id)
);

-- 6. MUTUAL MATCHES
CREATE TABLE IF NOT EXISTS mutual_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES users(id) ON DELETE CASCADE,
  landlord_id UUID REFERENCES users(id) ON DELETE CASCADE,
  compatibility_score INT NOT NULL,
  status match_status NOT NULL DEFAULT 'interest_expressed_by_tenant',
  initiated_by VARCHAR(50) NOT NULL DEFAULT 'tenant',
  tenant_note TEXT,
  landlord_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  matched_at TIMESTAMPTZ,
  CONSTRAINT unique_property_tenant_match UNIQUE (property_id, tenant_id)
);

-- 7. APPLICATIONS
CREATE TABLE IF NOT EXISTS rental_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES users(id) ON DELETE CASCADE,
  landlord_id UUID REFERENCES users(id) ON DELETE CASCADE,
  proposed_move_in_date DATE NOT NULL,
  proposed_rent NUMERIC(12, 2) NOT NULL,
  proposed_deposit NUMERIC(12, 2) NOT NULL,
  occupants_count INT DEFAULT 1,
  occupant_details TEXT,
  employment_details TEXT,
  note_to_landlord TEXT,
  status application_status NOT NULL DEFAULT 'submitted',
  status_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  more_info_request_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. LEASE AGREEMENTS
CREATE TABLE IF NOT EXISTS lease_agreements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES rental_applications(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES users(id) ON DELETE CASCADE,
  landlord_id UUID REFERENCES users(id) ON DELETE CASCADE,
  monthly_rent NUMERIC(12, 2) NOT NULL,
  security_deposit NUMERIC(12, 2) NOT NULL,
  maintenance_charges NUMERIC(12, 2) DEFAULT 0,
  duration_months INT DEFAULT 11,
  lock_in_months INT DEFAULT 6,
  notice_period_months INT DEFAULT 1,
  commencement_date DATE NOT NULL,
  status lease_status NOT NULL DEFAULT 'draft',
  tenant_signature_status VARCHAR(50) DEFAULT 'pending',
  tenant_signed_at TIMESTAMPTZ,
  landlord_signature_status VARCHAR(50) DEFAULT 'pending',
  landlord_signed_at TIMESTAMPTZ,
  agreement_text TEXT NOT NULL,
  escrow_status VARCHAR(50) DEFAULT 'not_initiated',
  escrow_amount NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CONVERSATIONS & MESSAGES
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES users(id) ON DELETE CASCADE,
  landlord_id UUID REFERENCES users(id) ON DELETE CASCADE,
  last_message_text TEXT,
  last_message_timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_conversation_parties UNIQUE (property_id, tenant_id, landlord_id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. VERIFICATION REQUESTS
CREATE TABLE IF NOT EXISTS verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  verification_type VARCHAR(100) NOT NULL,
  status verification_status DEFAULT 'pending_review',
  documents JSONB NOT NULL DEFAULT '[]'::jsonb,
  reviewer_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- 11. USER REPORTS & MODERATION
CREATE TABLE IF NOT EXISTS user_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reported_property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  reported_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reason report_reason NOT NULL,
  description TEXT NOT NULL,
  status report_status DEFAULT 'submitted',
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. KNOWLEDGE HUB / BLOG
CREATE TABLE IF NOT EXISTS blog_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(150) NOT NULL,
  author_role VARCHAR(150),
  read_time_minutes INT DEFAULT 5,
  published_at DATE DEFAULT CURRENT_DATE,
  tags TEXT[] DEFAULT '{}',
  cover_image TEXT
);

-- 13. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_name VARCHAR(255),
  user_role VARCHAR(50),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  details TEXT
);

-- Indexes for high-performance querying
CREATE INDEX IF NOT EXISTS idx_properties_city_locality ON properties (city, locality);
CREATE INDEX IF NOT EXISTS idx_properties_rent ON properties (rent);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties (status);
CREATE INDEX IF NOT EXISTS idx_matches_tenant ON mutual_matches (tenant_id);
CREATE INDEX IF NOT EXISTS idx_matches_landlord ON mutual_matches (landlord_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON chat_messages (conversation_id);
