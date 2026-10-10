export type UserRole = 'tenant' | 'landlord' | 'admin';

export type SubscriptionTier = 'free' | 'tenant_premium' | 'landlord_premium';

export type VerificationStatus = 
  | 'not_started' 
  | 'pending_review' 
  | 'verified' 
  | 'failed' 
  | 'more_info_required' 
  | 'manual_review_required';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  avatarUrl: string;
  city: string;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  verificationBadgeReason?: string;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt?: string;
  createdAt: string;
  bio?: string;
  demoAccount?: boolean;
}

export interface TenantProfile {
  userId: string;
  preferredLocations: string[];
  minRent: number;
  maxRent: number;
  maxDeposit: number;
  targetMoveInDate: string;
  preferredBhk: number[];
  preferredFurnishing: ('unfurnished' | 'semi-furnished' | 'fully-furnished')[];
  requiredAmenities: string[];
  householdType: 'single' | 'couple' | 'family' | 'roommates';
  workMode: 'remote' | 'hybrid' | 'office';
  petStatus: 'no_pets' | 'dog' | 'cat' | 'plans_to_adopt';
  dietaryPreference: 'veg_only' | 'no_restriction' | 'flexible';
  quietHoursPreference: 'strict' | 'moderate' | 'flexible';
  commutePriority: 'close_to_metro' | 'close_to_techpark' | 'flexible';
  profileCompleteness: number; // 0-100%
  profession?: string;
  employerOrCollege?: string;
}

export interface LandlordProfile {
  userId: string;
  entityType: 'individual_owner' | 'property_manager' | 'family_trust';
  portfolioCount: number;
  yearsHosting: number;
  responseRatePercent: number;
  averageResponseTimeMinutes: number;
  transparencyPledgeSigned: boolean;
  ownershipVerified: boolean;
  panOrGstVerified: boolean;
}

export type PropertyFurnishing = 'unfurnished' | 'semi-furnished' | 'fully-furnished';
export type PropertyType = 'apartment' | 'independent_house' | 'villa' | 'studio' | 'gated_society';
export type ListingStatus = 'published' | 'paused' | 'archived' | 'draft';

export interface PropertyRules {
  dietaryPreference: 'veg_only' | 'no_restriction' | 'open';
  petsAllowed: boolean;
  petDetails?: string;
  quietHours: string; // e.g. "10:00 PM - 06:00 AM"
  wfhFriendly: boolean;
  guestPolicy: 'flexible' | 'family_only' | 'prior_notice' | 'day_visits_only';
  lockInPeriodMonths: number;
}

export interface Property {
  id: string;
  landlordId: string;
  landlordName: string;
  landlordPhone?: string;
  landlordAvatarUrl?: string;
  title: string;
  description: string;
  city: string;
  locality: string;
  address: string;
  pincode: string;
  rent: number; // In INR monthly
  deposit: number; // In INR total
  maintenance: number; // In INR monthly
  bhk: number; // 1, 2, 3, 4, etc.
  bathrooms: number;
  carpetAreaSqFt: number;
  floor: number;
  totalFloors: number;
  facing: 'North' | 'East' | 'West' | 'South' | 'North-East' | 'North-West';
  furnishing: PropertyFurnishing;
  propertyType: PropertyType;
  availableFrom: string; // YYYY-MM-DD
  leaseDurationMonths: number; // e.g. 11 months
  noticePeriodMonths: number; // e.g. 1 or 2 months
  images: string[];
  amenities: string[];
  rules: PropertyRules;
  verificationStatus: VerificationStatus;
  verificationBadgeReason?: string;
  c2paAuthentic: boolean; // Media authenticity check
  status: ListingStatus;
  viewsCount: number;
  inquiriesCount: number;
  createdAt: string;
  updatedAt: string;
}

export type CompatibilityStatus = 'matched' | 'partial' | 'conflict';

export interface CompatibilityFactor {
  category: 'Budget' | 'Move-in Timing' | 'Location & Locality' | 'Property Type & Furnishing' | 'Amenities' | 'Lifestyle & House Rules';
  weightPercent: number;
  scorePercent: number;
  status: CompatibilityStatus;
  tenantRequirement: string;
  propertyOffering: string;
  explanation: string;
}

export interface CompatibilityResult {
  propertyId: string;
  overallScore: number; // 0-100
  matchLevel: 'Exceptional Match' | 'Strong Match' | 'Moderate Match' | 'Low Compatibility';
  factors: CompatibilityFactor[];
  summaryNote: string;
  strengths: string[];
  clarificationPoints: string[];
  isEligibleForExpressInterest: boolean;
}

export type MatchStatus = 
  | 'interest_expressed_by_tenant' 
  | 'interest_expressed_by_landlord' 
  | 'mutual_match' 
  | 'declined' 
  | 'withdrawn';

export interface MutualMatch {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyCity: string;
  propertyLocality: string;
  propertyRent: number;
  tenantId: string;
  tenantName: string;
  tenantAvatar: string;
  tenantProfession?: string;
  landlordId: string;
  landlordName: string;
  landlordAvatar: string;
  compatibilityScore: number;
  status: MatchStatus;
  initiatedBy: 'tenant' | 'landlord';
  tenantNote?: string;
  landlordNote?: string;
  createdAt: string;
  matchedAt?: string;
}

export type ApplicationStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'more_info_requested' 
  | 'accepted' 
  | 'declined' 
  | 'withdrawn';

export interface ApplicationStatusHistory {
  status: ApplicationStatus;
  timestamp: string;
  note?: string;
  changedBy: string;
}

export interface RentalApplication {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyRent: number;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  landlordId: string;
  proposedMoveInDate: string;
  proposedRent: number;
  proposedDeposit: number;
  occupantsCount: number;
  occupantDetails: string;
  employmentDetails: string;
  noteToLandlord: string;
  status: ApplicationStatus;
  statusHistory: ApplicationStatusHistory[];
  moreInfoRequestMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export type LeaseStatus = 
  | 'draft' 
  | 'tenant_signed' 
  | 'landlord_signed' 
  | 'fully_executed' 
  | 'cancelled';

export interface LeaseAgreement {
  id: string;
  applicationId: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  tenantId: string;
  tenantName: string;
  landlordId: string;
  landlordName: string;
  monthlyRent: number;
  securityDeposit: number;
  maintenanceCharges: number;
  durationMonths: number;
  lockInMonths: number;
  noticePeriodMonths: number;
  commencementDate: string;
  status: LeaseStatus;
  tenantSignatureStatus: 'pending' | 'signed';
  tenantSignedAt?: string;
  landlordSignatureStatus: 'pending' | 'signed';
  landlordSignedAt?: string;
  agreementText: string;
  escrowStatus: 'not_initiated' | 'deposit_in_escrow' | 'released_to_landlord' | 'refunded';
  escrowAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyRent: number;
  tenantId: string;
  tenantName: string;
  tenantAvatar: string;
  landlordId: string;
  landlordName: string;
  landlordAvatar: string;
  lastMessageText: string;
  lastMessageTimestamp: string;
  unreadCountTenant: number;
  unreadCountLandlord: number;
}

export interface VerificationDocument {
  id: string;
  type: 'aadhaar_masked' | 'pan_card' | 'property_tax_receipt' | 'electricity_bill' | 'employment_id' | 'sale_deed_extract';
  documentName: string;
  url: string;
  uploadDate: string;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userEmail: string;
  propertyId?: string;
  propertyTitle?: string;
  verificationType: 'identity' | 'property_ownership' | 'tenant_reliability';
  status: VerificationStatus;
  documents: VerificationDocument[];
  reviewerNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface UserReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedPropertyId?: string;
  reportedPropertyTitle?: string;
  reportedUserId?: string;
  reportedUserName?: string;
  reason: 
    | 'suspicious_listing' 
    | 'impersonation' 
    | 'misleading_images' 
    | 'harassment' 
    | 'incorrect_details' 
    | 'rental_bidding_demand' 
    | 'dispute_review';
  description: string;
  status: 'submitted' | 'under_review' | 'action_taken' | 'resolved' | 'dismissed';
  resolutionNotes?: string;
  createdAt: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  category: 'Fair Rental Guide' | 'Legal & Compliance' | 'Market Transparency' | 'Tenant Advice' | 'Landlord Playbook';
  summary: string;
  content: string;
  author: string;
  authorRole: string;
  readTimeMinutes: number;
  publishedAt: string;
  tags: string[];
  coverImage: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'match' | 'application' | 'message' | 'verification' | 'lease' | 'system';
  title: string;
  message: string;
  linkUrl: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
}

export interface AlgorithmWeights {
  budgetWeight: number;      // e.g. 25
  moveInWeight: number;      // e.g. 15
  locationWeight: number;    // e.g. 20
  propertyTypeWeight: number;// e.g. 15
  amenitiesWeight: number;   // e.g. 15
  lifestyleWeight: number;   // e.g. 10
}
