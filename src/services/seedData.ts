import { 
  User, 
  TenantProfile, 
  LandlordProfile, 
  Property, 
  MutualMatch, 
  RentalApplication, 
  LeaseAgreement, 
  Conversation, 
  ChatMessage, 
  VerificationRequest, 
  UserReport, 
  BlogArticle,
  NotificationItem
} from '../types';

export const SEED_USERS: User[] = [
  {
    id: 'user_tenant_1',
    email: 'ananya.sharma@example.com',
    name: 'Ananya Sharma',
    phone: '+91 98452 31456',
    role: 'tenant',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    city: 'Bengaluru',
    isVerified: true,
    verificationStatus: 'verified',
    verificationBadgeReason: 'Aadhaar e-KYC verified & Corporate email confirmed (Atlassian)',
    subscriptionTier: 'tenant_premium',
    subscriptionExpiresAt: '2027-01-01T00:00:00Z',
    createdAt: '2026-08-15T10:00:00Z',
    bio: 'Senior Backend Engineer. Quiet, non-smoker, enjoys plant care and remote working with disciplined hours.',
    demoAccount: true,
  },
  {
    id: 'user_landlord_1',
    email: 'rajesh.mehta@example.com',
    name: 'Rajesh Mehta',
    phone: '+91 98201 87654',
    role: 'landlord',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    city: 'Bengaluru',
    isVerified: true,
    verificationStatus: 'verified',
    verificationBadgeReason: 'Property Deeds & BESCOM Electricity bills verified by RentMatch Trust Desk',
    subscriptionTier: 'landlord_premium',
    subscriptionExpiresAt: '2027-03-15T00:00:00Z',
    createdAt: '2026-07-20T11:30:00Z',
    bio: 'Retired Aerospace Executive and long-time Bengaluru homeowner. Believes in mutual respect and clear, prompt deposit returns.',
    demoAccount: true,
  },
  {
    id: 'user_admin_1',
    email: 'vikram.adiga@rentmatch.in',
    name: 'Vikram Adiga',
    phone: '+91 80234 56789',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    city: 'Bengaluru',
    isVerified: true,
    verificationStatus: 'verified',
    verificationBadgeReason: 'RentMatch Operations & Trust Arbiter (Level 3 Staff)',
    subscriptionTier: 'free',
    createdAt: '2026-01-01T08:00:00Z',
    bio: 'Platform Trust, Ethics & Verification Lead at RentMatch HQ.',
    demoAccount: true,
  },
  {
    id: 'user_tenant_2',
    email: 'rohit.verma@example.com',
    name: 'Rohit Verma',
    phone: '+91 97112 43210',
    role: 'tenant',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    city: 'Bengaluru',
    isVerified: false,
    verificationStatus: 'pending_review',
    subscriptionTier: 'free',
    createdAt: '2026-09-02T14:10:00Z',
    bio: 'Product Designer at FinTech startup in HSR Layout.',
    demoAccount: true,
  }
];

export const SEED_TENANT_PROFILE: TenantProfile = {
  userId: 'user_tenant_1',
  preferredLocations: ['Indiranagar', 'Koramangala', 'HSR Layout', 'Domlur'],
  minRent: 35000,
  maxRent: 55000,
  maxDeposit: 150000,
  targetMoveInDate: '2026-11-01',
  preferredBhk: [2, 3],
  preferredFurnishing: ['semi-furnished', 'fully-furnished'],
  requiredAmenities: [
    'Power Backup (100%)',
    'High-Speed Fiber Ready',
    'Covered Car Parking',
    'Gated 24/7 Security',
    'Balcony'
  ],
  householdType: 'single',
  workMode: 'hybrid',
  petStatus: 'no_pets',
  dietaryPreference: 'no_restriction',
  quietHoursPreference: 'moderate',
  commutePriority: 'close_to_metro',
  profileCompleteness: 95,
  profession: 'Senior Software Engineer',
  employerOrCollege: 'Atlassian India',
};

export const SEED_LANDLORD_PROFILE: LandlordProfile = {
  userId: 'user_landlord_1',
  entityType: 'individual_owner',
  portfolioCount: 3,
  yearsHosting: 8,
  responseRatePercent: 98,
  averageResponseTimeMinutes: 24,
  transparencyPledgeSigned: true,
  ownershipVerified: true,
  panOrGstVerified: true,
};

export const SEED_PROPERTIES: Property[] = [
  {
    id: 'prop_indiranagar_01',
    landlordId: 'user_landlord_1',
    landlordName: 'Rajesh Mehta',
    landlordPhone: '+91 98201 87654',
    landlordAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    title: 'Sunlit 2 BHK with Private Terrace near 12th Main',
    description: 'Beautifully maintained, cross-ventilated 2 BHK apartment in a quiet residential cul-de-sac off 12th Main, Indiranagar. Features modular European kitchen, wooden flooring in master suite, full power backup, and double-glazed soundproof balcony doors. 4 minutes walk to Indiranagar Metro Station and defense colony park.',
    city: 'Bengaluru',
    locality: 'Indiranagar',
    address: '42, 6th Cross, HAL 2nd Stage, Off 12th Main',
    pincode: '560038',
    rent: 48000,
    deposit: 120000, // Reasonable 2.5 months deposit instead of 10 months!
    maintenance: 3500,
    bhk: 2,
    bathrooms: 2,
    carpetAreaSqFt: 1180,
    floor: 2,
    totalFloors: 4,
    facing: 'East',
    furnishing: 'semi-furnished',
    propertyType: 'apartment',
    availableFrom: '2026-11-01',
    leaseDurationMonths: 11,
    noticePeriodMonths: 1,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: [
      'Power Backup (100%)',
      'High-Speed Fiber Ready',
      'Covered Car Parking',
      'Gated 24/7 Security',
      'Balcony',
      'Modular Kitchen',
      'Solar Water Heating',
      'Rainwater Harvesting'
    ],
    rules: {
      dietaryPreference: 'no_restriction',
      petsAllowed: true,
      petDetails: 'Well-trained cats or small dogs welcome with standard pet hygiene agreement.',
      quietHours: '10:30 PM - 06:30 AM',
      wfhFriendly: true,
      guestPolicy: 'flexible',
      lockInPeriodMonths: 6
    },
    verificationStatus: 'verified',
    verificationBadgeReason: 'BESCOM bill and registered sale deed verified on 2026-08-10. Media authenticity verified via C2PA metadata.',
    c2paAuthentic: true,
    status: 'published',
    viewsCount: 428,
    inquiriesCount: 14,
    createdAt: '2026-09-01T09:00:00Z',
    updatedAt: '2026-09-15T12:00:00Z'
  },
  {
    id: 'prop_koramangala_02',
    landlordId: 'user_landlord_1',
    landlordName: 'Rajesh Mehta',
    landlordPhone: '+91 98201 87654',
    landlordAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    title: 'Modern 3 BHK Penthouse in Koramangala 4th Block',
    description: 'Expansive penthouse with 400 sq.ft private rooftop deck overlooking greenery in Koramangala 4th Block. Fully equipped with premium German kitchen fittings, Daikin inverter ACs in all bedrooms, servant quarter, and two basement EV charging car parks. Walking distance to elite cafes and startup hubs.',
    city: 'Bengaluru',
    locality: 'Koramangala',
    address: '18, 14th Main, 4th Block, Near Maharaja Signal',
    pincode: '560034',
    rent: 75000,
    deposit: 200000,
    maintenance: 5000,
    bhk: 3,
    bathrooms: 3,
    carpetAreaSqFt: 1850,
    floor: 4,
    totalFloors: 4,
    facing: 'North-East',
    furnishing: 'fully-furnished',
    propertyType: 'apartment',
    availableFrom: '2026-11-15',
    leaseDurationMonths: 11,
    noticePeriodMonths: 2,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: [
      'Power Backup (100%)',
      'High-Speed Fiber Ready',
      'Covered Car Parking',
      'Gated 24/7 Security',
      'Balcony',
      'EV Charging Point',
      'Gymnasium',
      'Clubhouse',
      'Swimming Pool'
    ],
    rules: {
      dietaryPreference: 'no_restriction',
      petsAllowed: true,
      petDetails: 'All vaccinated pets allowed with RWA registration.',
      quietHours: '11:00 PM - 07:00 AM',
      wfhFriendly: true,
      guestPolicy: 'flexible',
      lockInPeriodMonths: 6
    },
    verificationStatus: 'verified',
    verificationBadgeReason: 'Property title verified with Sub-Registrar office records.',
    c2paAuthentic: true,
    status: 'published',
    viewsCount: 612,
    inquiriesCount: 22,
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-09-18T14:00:00Z'
  },
  {
    id: 'prop_hsr_03',
    landlordId: 'user_landlord_2',
    landlordName: 'Suresh Nambiar',
    landlordPhone: '+91 94481 22334',
    landlordAvatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    title: 'Peaceful 2 BHK Garden Facing Apartment in HSR Sector 2',
    description: 'Charming ground-floor 2 BHK opening directly into an internal landscaped courtyard in HSR Sector 2. Perfect for WFH professionals wanting zero elevator waiting, natural light, and quiet environment. Direct access to 27th Main food corridor and tech shuttles.',
    city: 'Bengaluru',
    locality: 'HSR Layout',
    address: 'Plot 78, 19th Main, Sector 2, HSR Layout',
    pincode: '560102',
    rent: 42000,
    deposit: 100000,
    maintenance: 2500,
    bhk: 2,
    bathrooms: 2,
    carpetAreaSqFt: 1050,
    floor: 1,
    totalFloors: 3,
    facing: 'North',
    furnishing: 'semi-furnished',
    propertyType: 'apartment',
    availableFrom: '2026-10-25',
    leaseDurationMonths: 11,
    noticePeriodMonths: 1,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: [
      'Power Backup (100%)',
      'Covered Car Parking',
      'Gated 24/7 Security',
      'Balcony',
      'Modular Kitchen',
      'CCTV Surveillance'
    ],
    rules: {
      dietaryPreference: 'open',
      petsAllowed: false,
      petDetails: 'Society bylaws restrict pets on ground tier.',
      quietHours: '10:00 PM - 06:00 AM',
      wfhFriendly: true,
      guestPolicy: 'prior_notice',
      lockInPeriodMonths: 6
    },
    verificationStatus: 'verified',
    verificationBadgeReason: 'Tax receipts & identity verified.',
    c2paAuthentic: true,
    status: 'published',
    viewsCount: 310,
    inquiriesCount: 9,
    createdAt: '2026-09-10T16:00:00Z',
    updatedAt: '2026-09-20T11:00:00Z'
  },
  {
    id: 'prop_bandra_04',
    landlordId: 'user_landlord_3',
    landlordName: 'Priya Kulkarni',
    landlordPhone: '+91 98205 11223',
    landlordAvatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    title: 'Art-Deco Styled 2 BHK off Pali Hill, Bandra West',
    description: 'High-ceiling Art-Deco haven located in the heritage enclave of Pali Hill, Bandra West. Restored teakwood doors, imported Italian tiles, modern rain showers, and dedicated reserved stilt parking. Walking distance to Carter Road promenade.',
    city: 'Mumbai',
    locality: 'Bandra West',
    address: 'Sea View Terrace, Zig Zag Road, Pali Hill',
    pincode: '400050',
    rent: 92000,
    deposit: 250000,
    maintenance: 6000,
    bhk: 2,
    bathrooms: 2,
    carpetAreaSqFt: 980,
    floor: 3,
    totalFloors: 6,
    facing: 'West',
    furnishing: 'fully-furnished',
    propertyType: 'apartment',
    availableFrom: '2026-11-01',
    leaseDurationMonths: 11,
    noticePeriodMonths: 2,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: [
      'High-Speed Fiber Ready',
      'Covered Car Parking',
      'Gated 24/7 Security',
      'Elevator',
      'Balcony',
      'Modular Kitchen',
      'Air Conditioning'
    ],
    rules: {
      dietaryPreference: 'no_restriction',
      petsAllowed: true,
      quietHours: '11:00 PM - 07:00 AM',
      wfhFriendly: true,
      guestPolicy: 'flexible',
      lockInPeriodMonths: 6
    },
    verificationStatus: 'verified',
    verificationBadgeReason: 'Society NOC & Share Certificate verified.',
    c2paAuthentic: true,
    status: 'published',
    viewsCount: 780,
    inquiriesCount: 31,
    createdAt: '2026-08-01T12:00:00Z',
    updatedAt: '2026-09-01T12:00:00Z'
  },
  {
    id: 'prop_whitefield_05',
    landlordId: 'user_landlord_1',
    landlordName: 'Rajesh Mehta',
    landlordPhone: '+91 98201 87654',
    landlordAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    title: 'Smart 1 BHK Studio in Gated Community near ITPL',
    description: 'Compact, ultra-efficient studio apartment designed specifically for single IT professionals working in ITPL / Brigade Tech Park. Includes ergonomic work desk, high-speed mesh router, modular kitchenette, microwave, washing machine, and clubhouse gym access.',
    city: 'Bengaluru',
    locality: 'Whitefield',
    address: 'Tower C, Prestige Shantiniketan, Whitefield Main Road',
    pincode: '560066',
    rent: 28000,
    deposit: 60000,
    maintenance: 2000,
    bhk: 1,
    bathrooms: 1,
    carpetAreaSqFt: 580,
    floor: 9,
    totalFloors: 18,
    facing: 'East',
    furnishing: 'fully-furnished',
    propertyType: 'studio',
    availableFrom: '2026-10-20',
    leaseDurationMonths: 11,
    noticePeriodMonths: 1,
    images: [
      'https://images.unsplash.com/photo-1502005229762-ee10234b700e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: [
      'Power Backup (100%)',
      'High-Speed Fiber Ready',
      'Gymnasium',
      'Swimming Pool',
      'Covered Car Parking',
      'Gated 24/7 Security',
      'Elevator'
    ],
    rules: {
      dietaryPreference: 'no_restriction',
      petsAllowed: false,
      quietHours: '10:00 PM - 06:00 AM',
      wfhFriendly: true,
      guestPolicy: 'flexible',
      lockInPeriodMonths: 3
    },
    verificationStatus: 'verified',
    verificationBadgeReason: 'Verified property records on file.',
    c2paAuthentic: true,
    status: 'published',
    viewsCount: 520,
    inquiriesCount: 19,
    createdAt: '2026-09-05T08:00:00Z',
    updatedAt: '2026-09-12T10:00:00Z'
  },
  {
    id: 'prop_gachibowli_06',
    landlordId: 'user_landlord_4',
    landlordName: 'Venkat Rao',
    landlordPhone: '+91 98490 33445',
    landlordAvatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    title: 'Spacious 3 BHK Luxury Flat in Gachibowli Financial District',
    description: 'High-floor 3 BHK apartment in premium gated township right opposite Waverock Tech Park. Lake view balcony, central piped gas, clubhouse with squash court, Olympic pool, and 2 designated covered car parking slots.',
    city: 'Hyderabad',
    locality: 'Gachibowli',
    address: 'Aparna Sarovar, Nallagandla, Gachibowli',
    pincode: '500032',
    rent: 52000,
    deposit: 120000,
    maintenance: 4500,
    bhk: 3,
    bathrooms: 3,
    carpetAreaSqFt: 1650,
    floor: 12,
    totalFloors: 24,
    facing: 'East',
    furnishing: 'semi-furnished',
    propertyType: 'apartment',
    availableFrom: '2026-11-05',
    leaseDurationMonths: 11,
    noticePeriodMonths: 1,
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: [
      'Power Backup (100%)',
      'Gymnasium',
      'Swimming Pool',
      'Covered Car Parking',
      'Gated 24/7 Security',
      'Balcony',
      'Piped Gas'
    ],
    rules: {
      dietaryPreference: 'no_restriction',
      petsAllowed: true,
      quietHours: '10:30 PM - 06:30 AM',
      wfhFriendly: true,
      guestPolicy: 'flexible',
      lockInPeriodMonths: 6
    },
    verificationStatus: 'verified',
    verificationBadgeReason: 'Registered deed and municipal tax receipts validated.',
    c2paAuthentic: true,
    status: 'published',
    viewsCount: 395,
    inquiriesCount: 16,
    createdAt: '2026-08-15T15:00:00Z',
    updatedAt: '2026-09-02T16:00:00Z'
  }
];

export const SEED_MUTUAL_MATCHES: MutualMatch[] = [
  {
    id: 'match_01',
    propertyId: 'prop_indiranagar_01',
    propertyTitle: 'Sunlit 2 BHK with Private Terrace near 12th Main',
    propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    propertyCity: 'Bengaluru',
    propertyLocality: 'Indiranagar',
    propertyRent: 48000,
    tenantId: 'user_tenant_1',
    tenantName: 'Ananya Sharma',
    tenantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    tenantProfession: 'Senior Software Engineer (Atlassian)',
    landlordId: 'user_landlord_1',
    landlordName: 'Rajesh Mehta',
    landlordAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    compatibilityScore: 94,
    status: 'mutual_match',
    initiatedBy: 'tenant',
    tenantNote: 'Love the terrace and quiet environment! My office is hybrid in Bellandur/Indiranagar.',
    landlordNote: 'Profile and company verification look spotless. Happy to connect and schedule a viewing.',
    createdAt: '2026-09-28T10:15:00Z',
    matchedAt: '2026-09-29T14:20:00Z'
  },
  {
    id: 'match_02',
    propertyId: 'prop_hsr_03',
    propertyTitle: 'Peaceful 2 BHK Garden Facing Apartment in HSR Sector 2',
    propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    propertyCity: 'Bengaluru',
    propertyLocality: 'HSR Layout',
    propertyRent: 42000,
    tenantId: 'user_tenant_1',
    tenantName: 'Ananya Sharma',
    tenantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    tenantProfession: 'Senior Software Engineer (Atlassian)',
    landlordId: 'user_landlord_2',
    landlordName: 'Suresh Nambiar',
    landlordAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    compatibilityScore: 78,
    status: 'interest_expressed_by_tenant',
    initiatedBy: 'tenant',
    tenantNote: 'Interested in this property for the convenient HSR location.',
    createdAt: '2026-10-02T16:00:00Z'
  }
];

export const SEED_APPLICATIONS: RentalApplication[] = [
  {
    id: 'app_01',
    propertyId: 'prop_indiranagar_01',
    propertyTitle: 'Sunlit 2 BHK with Private Terrace near 12th Main',
    propertyRent: 48000,
    tenantId: 'user_tenant_1',
    tenantName: 'Ananya Sharma',
    tenantEmail: 'ananya.sharma@example.com',
    tenantPhone: '+91 98452 31456',
    landlordId: 'user_landlord_1',
    proposedMoveInDate: '2026-11-01',
    proposedRent: 48000,
    proposedDeposit: 120000,
    occupantsCount: 1,
    occupantDetails: 'Self only. No roommates.',
    employmentDetails: 'Senior Software Engineer at Atlassian India, CTC ₹45 LPA, 5 years tenure.',
    noteToLandlord: 'I loved the viewing and would treat the apartment with utmost care. Looking for a peaceful long-term stay.',
    status: 'under_review',
    statusHistory: [
      {
        status: 'submitted',
        timestamp: '2026-09-30T10:00:00Z',
        changedBy: 'Ananya Sharma',
        note: 'Application formally submitted after mutual match confirmation.'
      },
      {
        status: 'under_review',
        timestamp: '2026-10-01T11:30:00Z',
        changedBy: 'Rajesh Mehta',
        note: 'Reviewing tenancy timeline and preparing draft lease terms.'
      }
    ],
    createdAt: '2026-09-30T10:00:00Z',
    updatedAt: '2026-10-01T11:30:00Z'
  }
];

export const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_01',
    propertyId: 'prop_indiranagar_01',
    propertyTitle: 'Sunlit 2 BHK with Private Terrace near 12th Main',
    propertyRent: 48000,
    tenantId: 'user_tenant_1',
    tenantName: 'Ananya Sharma',
    tenantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    landlordId: 'user_landlord_1',
    landlordName: 'Rajesh Mehta',
    landlordAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    lastMessageText: 'Sounds great Rajesh ji. I have reviewed the draft terms and will proceed with the digital lease.',
    lastMessageTimestamp: '2026-10-02T18:45:00Z',
    unreadCountTenant: 0,
    unreadCountLandlord: 1,
  }
];

export const SEED_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_01',
    conversationId: 'conv_01',
    senderId: 'user_tenant_1',
    senderName: 'Ananya Sharma',
    senderRole: 'tenant',
    text: 'Hello Rajesh ji! Thank you for accepting the match. The property looks fantastic.',
    timestamp: '2026-09-29T15:00:00Z',
    read: true,
  },
  {
    id: 'msg_02',
    conversationId: 'conv_01',
    senderId: 'user_landlord_1',
    senderName: 'Rajesh Mehta',
    senderRole: 'landlord',
    text: 'Welcome Ananya! Your verified profile and corporate credentials match what I look for in a tenant. Are you free this Saturday for an in-person walkthrough?',
    timestamp: '2026-09-29T16:20:00Z',
    read: true,
  },
  {
    id: 'msg_03',
    conversationId: 'conv_01',
    senderId: 'user_tenant_1',
    senderName: 'Ananya Sharma',
    senderRole: 'tenant',
    text: 'Yes! Saturday 11 AM works well for me. See you then.',
    timestamp: '2026-09-29T17:05:00Z',
    read: true,
  },
  {
    id: 'msg_04',
    conversationId: 'conv_01',
    senderId: 'user_landlord_1',
    senderName: 'Rajesh Mehta',
    senderRole: 'landlord',
    text: 'Great meeting you yesterday! I have received your application on RentMatch and started the lease generation workflow.',
    timestamp: '2026-10-02T10:15:00Z',
    read: true,
  },
  {
    id: 'msg_05',
    conversationId: 'conv_01',
    senderId: 'user_tenant_1',
    senderName: 'Ananya Sharma',
    senderRole: 'tenant',
    text: 'Sounds great Rajesh ji. I have reviewed the draft terms and will proceed with the digital lease.',
    timestamp: '2026-10-02T18:45:00Z',
    read: false,
  }
];

export const SEED_VERIFICATION_REQUESTS: VerificationRequest[] = [
  {
    id: 'vr_01',
    userId: 'user_tenant_2',
    userName: 'Rohit Verma',
    userRole: 'tenant',
    userEmail: 'rohit.verma@example.com',
    verificationType: 'identity',
    status: 'pending_review',
    documents: [
      {
        id: 'doc_01',
        type: 'aadhaar_masked',
        documentName: 'Aadhaar_Masked_Last4_XXXX.pdf',
        url: 'https://example.com/docs/aadhaar_masked_sample.pdf',
        uploadDate: '2026-10-01T09:00:00Z',
        status: 'pending'
      },
      {
        id: 'doc_02',
        type: 'employment_id',
        documentName: 'Company_Work_Badge.png',
        url: 'https://example.com/docs/badge_sample.png',
        uploadDate: '2026-10-01T09:02:00Z',
        status: 'pending'
      }
    ],
    submittedAt: '2026-10-01T09:05:00Z'
  },
  {
    id: 'vr_02',
    userId: 'user_landlord_1',
    userName: 'Rajesh Mehta',
    userRole: 'landlord',
    userEmail: 'rajesh.mehta@example.com',
    propertyId: 'prop_indiranagar_01',
    propertyTitle: 'Sunlit 2 BHK with Private Terrace near 12th Main',
    verificationType: 'property_ownership',
    status: 'verified',
    documents: [
      {
        id: 'doc_03',
        type: 'property_tax_receipt',
        documentName: 'BBMP_Property_Tax_Receipt_2025_26.pdf',
        url: 'https://example.com/docs/bbmp_tax.pdf',
        uploadDate: '2026-08-10T11:00:00Z',
        status: 'verified'
      },
      {
        id: 'doc_04',
        type: 'electricity_bill',
        documentName: 'BESCOM_Electricity_Bill_July2026.pdf',
        url: 'https://example.com/docs/bescom_bill.pdf',
        uploadDate: '2026-08-10T11:05:00Z',
        status: 'verified'
      }
    ],
    reviewerNotes: 'Verified against BBMP GIS portal and BESCOM consumer account #44219. Title matches landlord identity.',
    submittedAt: '2026-08-10T11:05:00Z',
    reviewedAt: '2026-08-11T14:30:00Z'
  }
];

export const SEED_REPORTS: UserReport[] = [
  {
    id: 'rep_01',
    reporterId: 'user_tenant_1',
    reporterName: 'Ananya Sharma',
    reportedPropertyId: 'prop_external_spam',
    reportedPropertyTitle: 'Suspicious 3 BHK in Koramangala 1st Block (Unverified)',
    reportedUserId: 'user_broker_spam',
    reportedUserName: 'Apex Realty Solutions',
    reason: 'rental_bidding_demand',
    description: 'Broker called demanding ₹15,000 upfront token before property viewing and stated "multiple techies are bidding up the rent". This violates RentMatch anti-bidding code.',
    status: 'action_taken',
    resolutionNotes: 'Broker listing suspended permanently. User warned under zero broker exploitation charter.',
    createdAt: '2026-09-14T11:00:00Z'
  }
];

export const SEED_BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'blog_01',
    slug: 'eliminating-rental-bidding-wars-india',
    title: 'Ending the "Bidding War" Trap in Urban Indian Rentals',
    category: 'Market Transparency',
    summary: 'Why artificial rental escalations hurt both owners and tenants over the long run, and how transparent mutual merit matching restores stability.',
    author: 'Vikram Adiga',
    authorRole: 'Head of Platform Ethics & Fair Housing',
    readTimeMinutes: 5,
    publishedAt: '2026-09-20',
    tags: ['Fair Renting', 'Bidding Transparency', 'Bangalore Housing', 'Tenant Rights'],
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
    content: `
For decades, urban tenancy across Bengaluru, Mumbai, and Delhi NCR has operated on an asymmetric information model. Prospective tenants find themselves caught in high-pressure "token races" where brokers leverage artificial urgency to escalate monthly rents by 20% to 30% above fair market value.

### The True Cost of Rental Bidding
1. **Accelerated Tenant Turnover:** Tenants forced into inflated bids inevitably seek replacement housing within 12 months, leading to prolonged vacancy intervals for owners.
2. **Erosion of Mutual Trust:** When a rental relationship begins with commercial extortion, every future interaction—from minor maintenance requests to deposit settlements—becomes adversarial.
3. **Broker Distortions:** Intermediaries incentivised on percentage-based commission have a structural incentive to inflate rent prices.

### How RentMatch Solves This
RentMatch introduces a strict anti-bidding protocol. Property rents are posted transparently with hard price stability locks. Tenants are selected not by who can overbid, but by **practical lifestyle, timeline, and financial compatibility**. Both parties agree to a transparent tenure contract where expectations are documented before the first handshake.
    `.trim()
  },
  {
    id: 'blog_02',
    slug: 'demystifying-model-tenancy-act-2021',
    title: 'A Practical Guide to India\'s Model Tenancy Act (MTA)',
    category: 'Legal & Compliance',
    summary: 'Everything tenants and landlords need to know about the 2-month security deposit cap, digital agreements, and fast-track dispute mechanisms.',
    author: 'Adv. S. N. Deshmukh',
    authorRole: 'Tenancy Law Consultant',
    readTimeMinutes: 7,
    publishedAt: '2026-09-12',
    tags: ['Model Tenancy Act', 'Legal Guide', 'Security Deposit', 'Notice Periods'],
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80',
    content: `
The Model Tenancy Act (MTA) proposed by the Union Ministry of Housing and Urban Affairs marks the most significant reform in India's rental housing jurisprudence since independence.

### Key Tenets of the Act:
- **Security Deposit Ceiling:** Capped at a maximum of two months' rent for residential premises. In cities like Bengaluru where 10-month deposits have historically locked up hard-earned capital, this is transformative.
- **Mandatory Digital Tenancy Agreement:** Verbal agreements and unformatted stamp papers are replaced by structured agreements submitted to the Rent Authority.
- **Fair Notice for Entry:** Landlords must provide at least 24 hours written notice before entering rented premises for repairs.
- **Controlled Revision of Rent:** Rent cannot be hiked unilaterally midway through an ongoing lease period.

RentMatch aligns every generated digital lease draft with the principles of the Model Tenancy Act, giving both parties a clear, legally respectful foundation.
    `.trim()
  },
  {
    id: 'blog_03',
    slug: 'explainable-ai-vs-black-box-algorithms',
    title: 'Why RentMatch Rejects Black-Box Recommendation in PropTech',
    category: 'Fair Rental Guide',
    summary: 'A deep dive into our Mutual Merit scoring engine and our non-negotiable policy against algorithmic discrimination.',
    author: 'RentMatch Engineering Team',
    authorRole: 'Algorithmic Fairness Research',
    readTimeMinutes: 6,
    publishedAt: '2026-08-28',
    tags: ['Ethical AI', 'Explainability', 'Anti-Discrimination', 'Mutual Merit'],
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
    content: `
Traditional AI recommendation engines optimise for engagement and platform profit. In housing, "black-box" models pose grave societal risks: they can reinforce historical biases, hide discriminatory filtering behind opaque mathematical proxies, and lock out deserving tenants without recourse.

### The RentMatch Architectural Standard
1. **Zero Protected Attributes:** We do not collect or process caste, religion, marital status, gender, or dietary prejudice in our compatibility engine.
2. **Full Deterministic Explainability:** Every percentage score generated on RentMatch comes with a detailed breakdown: exactly how many points derived from budget match, date alignment, space specifications, and amenities.
3. **Mutual Consent Before Disclosure:** Personal identities and contact credentials remain protected until both parties inspect the compatibility breakdown and mutually accept the match.
    `.trim()
  },
  {
    id: 'blog_04',
    slug: 'how-to-protect-your-rental-deposit',
    title: 'Deposit Disputes: Why They Happen and How Tripartite Escrow Fixes Them',
    category: 'Tenant Advice',
    summary: 'Understanding standard wear-and-tear vs actual property damage, and how RentMatch Escrow removes the fear of withheld deposits.',
    author: 'Ananya Sharma & Rajesh Mehta',
    authorRole: 'RentMatch Community Voices',
    readTimeMinutes: 4,
    publishedAt: '2026-08-10',
    tags: ['Security Deposit', 'Escrow', 'Fair Handover', 'Bengaluru Tenants'],
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80',
    content: `
For young urban professionals in Indian metros, the security deposit represents months of life savings. For landlords, it represents their sole insurance against unpaid utilities or catastrophic structural damage. When expectations diverge at the end of the tenancy, conflicts erupt.

### Defining Fair Wear-and-Tear
The law distinguishes clearly between normal wear (faded paint from sunlight, minor scuffs from hanging art) and actual damage (broken granite countertops, cracked sanitary ware, unauthorized structural alterations).

### The Future: RentMatch Escrow
By holding deposits in an independent, interest-bearing tripartite escrow account released upon joint digital handover sign-off, RentMatch creates an environment of total security.
    `.trim()
  }
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    userId: 'user_tenant_1',
    type: 'match',
    title: 'Mutual Match Confirmed! 🎉',
    message: 'Rajesh Mehta accepted your match request for Sunlit 2 BHK near 12th Main, Indiranagar.',
    linkUrl: '/messages',
    read: false,
    createdAt: '2026-09-29T14:20:00Z'
  },
  {
    id: 'notif_02',
    userId: 'user_tenant_1',
    type: 'verification',
    title: 'Profile Verified',
    message: 'Your tenant credentials have been verified by RentMatch Trust Desk.',
    linkUrl: '/settings',
    read: true,
    createdAt: '2026-08-16T11:00:00Z'
  },
  {
    id: 'notif_03',
    userId: 'user_landlord_1',
    type: 'application',
    title: 'New Rental Application',
    message: 'Ananya Sharma submitted a formal application for your Indiranagar property.',
    linkUrl: '/applications',
    read: false,
    createdAt: '2026-09-30T10:00:00Z'
  }
];
