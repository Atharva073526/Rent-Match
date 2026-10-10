-- ============================================================================
-- RENTMATCH: MUTUAL MERIT PLATFORM
-- Realistic Seed Data for PostgreSQL / Supabase
-- ============================================================================

-- 1. Insert Core Seed Users
INSERT INTO users (id, email, name, phone, role, avatar_url, city, is_verified, verification_status, verification_badge_reason, subscription_tier, demo_account)
VALUES 
('d1111111-1111-1111-1111-111111111111', 'ananya.sharma@example.com', 'Ananya Sharma', '+91 98452 31456', 'tenant', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', 'Bengaluru', true, 'verified', 'Aadhaar e-KYC verified & Corporate email confirmed (Atlassian)', 'tenant_premium', true),
('d2222222-2222-2222-2222-222222222222', 'rajesh.mehta@example.com', 'Rajesh Mehta', '+91 98201 87654', 'landlord', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', 'Bengaluru', true, 'verified', 'Property Deeds & BESCOM Electricity bills verified by RentMatch Trust Desk', 'landlord_premium', true),
('d3333333-3333-3333-3333-333333333333', 'vikram.adiga@rentmatch.in', 'Vikram Adiga', '+91 80234 56789', 'admin', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', 'Bengaluru', true, 'verified', 'RentMatch Operations & Trust Arbiter (Level 3 Staff)', 'free', true)
ON CONFLICT (email) DO NOTHING;

-- 2. Tenant Profile for Ananya
INSERT INTO tenant_profiles (user_id, preferred_locations, min_rent, max_rent, max_deposit, target_move_in_date, preferred_bhk, preferred_furnishing, required_amenities, household_type, work_mode, pet_status, dietary_preference, quiet_hours_preference, commute_priority, profile_completeness, profession, employer_or_college)
VALUES (
  'd1111111-1111-1111-1111-111111111111',
  ARRAY['Indiranagar', 'Koramangala', 'HSR Layout', 'Domlur'],
  35000,
  55000,
  150000,
  '2026-11-01',
  ARRAY[2, 3],
  ARRAY['semi-furnished'::property_furnishing, 'fully-furnished'::property_furnishing],
  ARRAY['Power Backup (100%)', 'High-Speed Fiber Ready', 'Covered Car Parking', 'Gated 24/7 Security', 'Balcony'],
  'single',
  'hybrid',
  'no_pets',
  'no_restriction',
  'moderate',
  'close_to_metro',
  95,
  'Senior Software Engineer',
  'Atlassian India'
)
ON CONFLICT (user_id) DO NOTHING;

-- 3. Landlord Profile for Rajesh
INSERT INTO landlord_profiles (user_id, entity_type, portfolio_count, years_hosting, response_rate_percent, average_response_time_minutes, transparency_pledge_signed, ownership_verified, pan_or_gst_verified)
VALUES (
  'd2222222-2222-2222-2222-222222222222',
  'individual_owner',
  3,
  8,
  98,
  24,
  true,
  true,
  true
)
ON CONFLICT (user_id) DO NOTHING;

-- 4. Sample Property (Indiranagar)
INSERT INTO properties (
  id, landlord_id, title, description, city, locality, address, pincode, 
  rent, deposit, maintenance, bhk, bathrooms, carpet_area_sqft, floor, total_floors, 
  facing, furnishing, property_type, available_from, lease_duration_months, notice_period_months, 
  images, amenities, rules, verification_status, verification_badge_reason, c2pa_authentic, status, views_count, inquiries_count
) VALUES (
  'c1111111-1111-1111-1111-111111111111',
  'd2222222-2222-2222-2222-222222222222',
  'Sunlit 2 BHK with Private Terrace near 12th Main',
  'Beautifully maintained, cross-ventilated 2 BHK apartment in a quiet residential cul-de-sac off 12th Main, Indiranagar. Features modular European kitchen, wooden flooring in master suite, full power backup, and double-glazed soundproof balcony doors. 4 minutes walk to Indiranagar Metro Station.',
  'Bengaluru',
  'Indiranagar',
  '42, 6th Cross, HAL 2nd Stage, Off 12th Main',
  '560038',
  48000,
  120000,
  3500,
  2,
  2,
  1180,
  2,
  4,
  'East',
  'semi-furnished',
  'apartment',
  '2026-11-01',
  11,
  1,
  ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'],
  ARRAY['Power Backup (100%)', 'High-Speed Fiber Ready', 'Covered Car Parking', 'Gated 24/7 Security', 'Balcony', 'Modular Kitchen'],
  '{"dietaryPreference":"no_restriction","petsAllowed":true,"quietHours":"10:30 PM - 06:30 AM","wfhFriendly":true,"guestPolicy":"flexible","lockInPeriodMonths":6}'::jsonb,
  'verified',
  'BESCOM bill and registered sale deed verified on 2026-08-10. Media authenticity verified via C2PA metadata.',
  true,
  'published',
  428,
  14
)
ON CONFLICT (id) DO NOTHING;
