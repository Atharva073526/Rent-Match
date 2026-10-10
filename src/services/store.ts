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
  NotificationItem,
  AuditLogItem,
  AlgorithmWeights,
  CompatibilityResult,
  ApplicationStatus,
  LeaseStatus
} from '../types';
import { 
  SEED_USERS, 
  SEED_TENANT_PROFILE, 
  SEED_LANDLORD_PROFILE, 
  SEED_PROPERTIES, 
  SEED_MUTUAL_MATCHES, 
  SEED_APPLICATIONS, 
  SEED_CONVERSATIONS, 
  SEED_MESSAGES, 
  SEED_VERIFICATION_REQUESTS, 
  SEED_REPORTS, 
  SEED_BLOG_ARTICLES, 
  SEED_NOTIFICATIONS 
} from './seedData';
import { compatibilityEngine, DEFAULT_ALGORITHM_WEIGHTS } from './compatibilityEngine';
import { generateDraftLeaseAgreement } from './leaseGenerator';

const STORAGE_KEY_PREFIX = 'rentmatch_state_v1_';

type StoreListener = () => void;

class RentMatchStore {
  private listeners: Set<StoreListener> = new Set();

  private users: User[] = [];
  private currentUserId: string = 'user_tenant_1'; // Default demo user: Ananya Sharma (Tenant)
  private tenantProfiles: Record<string, TenantProfile> = {};
  private landlordProfiles: Record<string, LandlordProfile> = {};
  private properties: Property[] = [];
  private savedPropertyIds: Set<string> = new Set();
  private matches: MutualMatch[] = [];
  private applications: RentalApplication[] = [];
  private leases: LeaseAgreement[] = [];
  private conversations: Conversation[] = [];
  private messages: ChatMessage[] = [];
  private verifications: VerificationRequest[] = [];
  private reports: UserReport[] = [];
  private blogArticles: BlogArticle[] = [];
  private notifications: NotificationItem[] = [];
  private auditLogs: AuditLogItem[] = [];
  private algorithmWeights: AlgorithmWeights = { ...DEFAULT_ALGORITHM_WEIGHTS };

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      this.resetToSeeds();
      return;
    }

    try {
      const storedUsers = localStorage.getItem(STORAGE_KEY_PREFIX + 'users');
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
        this.currentUserId = localStorage.getItem(STORAGE_KEY_PREFIX + 'current_user_id') || 'user_tenant_1';
        this.tenantProfiles = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'tenant_profiles') || '{}');
        this.landlordProfiles = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'landlord_profiles') || '{}');
        this.properties = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'properties') || '[]');
        this.savedPropertyIds = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'saved_props') || '[]'));
        this.matches = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'matches') || '[]');
        this.applications = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'applications') || '[]');
        this.leases = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'leases') || '[]');
        this.conversations = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'conversations') || '[]');
        this.messages = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'messages') || '[]');
        this.verifications = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'verifications') || '[]');
        this.reports = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'reports') || '[]');
        this.blogArticles = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'blog') || '[]');
        this.notifications = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'notifications') || '[]');
        this.auditLogs = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'audit_logs') || '[]');
        const storedWeights = localStorage.getItem(STORAGE_KEY_PREFIX + 'weights');
        if (storedWeights) {
          this.algorithmWeights = JSON.parse(storedWeights);
          compatibilityEngine.updateWeights(this.algorithmWeights);
        }
        return;
      }
    } catch (e) {
      console.warn('Could not hydrate RentMatch state from localStorage, loading seeds.', e);
    }

    this.resetToSeeds();
  }

  public resetToSeeds(): void {
    this.users = [...SEED_USERS];
    this.currentUserId = 'user_tenant_1';
    this.tenantProfiles = {
      'user_tenant_1': { ...SEED_TENANT_PROFILE }
    };
    this.landlordProfiles = {
      'user_landlord_1': { ...SEED_LANDLORD_PROFILE }
    };
    this.properties = [...SEED_PROPERTIES];
    this.savedPropertyIds = new Set(['prop_indiranagar_01', 'prop_hsr_03']);
    this.matches = [...SEED_MUTUAL_MATCHES];
    this.applications = [...SEED_APPLICATIONS];
    
    // Seed an initial lease agreement for demonstration
    const sampleProperty = this.properties[0];
    const tenantUser = this.users.find(u => u.id === 'user_tenant_1')!;
    const landlordUser = this.users.find(u => u.id === 'user_landlord_1')!;
    const initialLease = generateDraftLeaseAgreement(
      sampleProperty,
      tenantUser,
      landlordUser,
      'app_01',
      {
        monthlyRent: 48000,
        securityDeposit: 120000,
        maintenanceCharges: 3500,
        durationMonths: 11,
        lockInMonths: 6,
        noticePeriodMonths: 1,
        commencementDate: '2026-11-01'
      }
    );
    this.leases = [initialLease];

    this.conversations = [...SEED_CONVERSATIONS];
    this.messages = [...SEED_MESSAGES];
    this.verifications = [...SEED_VERIFICATION_REQUESTS];
    this.reports = [...SEED_REPORTS];
    this.blogArticles = [...SEED_BLOG_ARTICLES];
    this.notifications = [...SEED_NOTIFICATIONS];
    this.auditLogs = [
      {
        id: 'audit_01',
        timestamp: new Date().toISOString(),
        userId: 'system',
        userName: 'RentMatch Core',
        userRole: 'system',
        action: 'PLATFORM_INITIALIZED',
        entityType: 'System',
        entityId: 'rentmatch_v1',
        details: 'Initial system seed loaded successfully with sample verified listings.'
      }
    ];
    this.algorithmWeights = { ...DEFAULT_ALGORITHM_WEIGHTS };
    compatibilityEngine.updateWeights(this.algorithmWeights);

    this.persist();
    this.notify();
  }

  private persist(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'users', JSON.stringify(this.users));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'current_user_id', this.currentUserId);
      localStorage.setItem(STORAGE_KEY_PREFIX + 'tenant_profiles', JSON.stringify(this.tenantProfiles));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'landlord_profiles', JSON.stringify(this.landlordProfiles));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'properties', JSON.stringify(this.properties));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'saved_props', JSON.stringify(Array.from(this.savedPropertyIds)));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'matches', JSON.stringify(this.matches));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'applications', JSON.stringify(this.applications));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'leases', JSON.stringify(this.leases));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'conversations', JSON.stringify(this.conversations));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'messages', JSON.stringify(this.messages));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'verifications', JSON.stringify(this.verifications));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'reports', JSON.stringify(this.reports));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'blog', JSON.stringify(this.blogArticles));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'notifications', JSON.stringify(this.notifications));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'audit_logs', JSON.stringify(this.auditLogs));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'weights', JSON.stringify(this.algorithmWeights));
    } catch (e) {
      console.error('Failed to persist RentMatch state to localStorage:', e);
    }
  }

  public subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(fn => fn());
  }

  // --- AUTHENTICATION & USER MANAGEMENT ---

  public getCurrentUser(): User | null {
    if (!this.currentUserId) return null;
    return this.users.find(u => u.id === this.currentUserId) || null;
  }

  public getAllUsers(): User[] {
    return [...this.users];
  }

  public switchUser(userId: string): void {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      this.currentUserId = user.id;
      this.logAudit(user.id, user.name, user.role, 'USER_SWITCH', 'User', user.id, `Switched session to ${user.name} (${user.role})`);
      this.persist();
      this.notify();
    }
  }

  public logout(): void {
    this.currentUserId = '';
    this.persist();
    this.notify();
  }

  public registerUser(name: string, email: string, phone: string, role: User['role'], city: string = 'Bengaluru'): User {
    const newUser: User = {
      id: 'user_' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      phone,
      role,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=0d9488`,
      city,
      isVerified: false,
      verificationStatus: 'not_started',
      subscriptionTier: 'free',
      createdAt: new Date().toISOString(),
      demoAccount: false,
    };
    this.users.push(newUser);
    this.currentUserId = newUser.id;

    if (role === 'tenant') {
      this.tenantProfiles[newUser.id] = {
        userId: newUser.id,
        preferredLocations: [city],
        minRent: 20000,
        maxRent: 50000,
        maxDeposit: 150000,
        targetMoveInDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        preferredBhk: [2],
        preferredFurnishing: ['semi-furnished'],
        requiredAmenities: ['Power Backup (100%)', 'High-Speed Fiber Ready'],
        householdType: 'single',
        workMode: 'hybrid',
        petStatus: 'no_pets',
        dietaryPreference: 'no_restriction',
        quietHoursPreference: 'moderate',
        commutePriority: 'close_to_metro',
        profileCompleteness: 40,
      };
    } else if (role === 'landlord') {
      this.landlordProfiles[newUser.id] = {
        userId: newUser.id,
        entityType: 'individual_owner',
        portfolioCount: 1,
        yearsHosting: 1,
        responseRatePercent: 100,
        averageResponseTimeMinutes: 30,
        transparencyPledgeSigned: true,
        ownershipVerified: false,
        panOrGstVerified: false,
      };
    }

    this.logAudit(newUser.id, newUser.name, newUser.role, 'USER_REGISTERED', 'User', newUser.id, `New account registered as ${role}`);
    this.persist();
    this.notify();
    return newUser;
  }

  public updateCurrentUser(updates: Partial<User>): void {
    const user = this.getCurrentUser();
    if (!user) return;
    Object.assign(user, updates);
    this.persist();
    this.notify();
  }

  // --- PROFILES ---

  public getTenantProfile(userId: string): TenantProfile | null {
    return this.tenantProfiles[userId] || null;
  }

  public updateTenantProfile(userId: string, updates: Partial<TenantProfile>): void {
    const current = this.tenantProfiles[userId] || {
      userId,
      preferredLocations: ['Bengaluru'],
      minRent: 25000,
      maxRent: 50000,
      maxDeposit: 150000,
      targetMoveInDate: new Date().toISOString().split('T')[0],
      preferredBhk: [2],
      preferredFurnishing: ['semi-furnished'],
      requiredAmenities: ['Power Backup (100%)'],
      householdType: 'single',
      workMode: 'hybrid',
      petStatus: 'no_pets',
      dietaryPreference: 'no_restriction',
      quietHoursPreference: 'moderate',
      commutePriority: 'close_to_metro',
      profileCompleteness: 80,
    };
    this.tenantProfiles[userId] = { ...current, ...updates };
    this.persist();
    this.notify();
  }

  public getLandlordProfile(userId: string): LandlordProfile | null {
    return this.landlordProfiles[userId] || null;
  }

  // --- PROPERTIES ---

  public getProperties(): Property[] {
    return [...this.properties];
  }

  public getPropertyById(id: string): Property | undefined {
    return this.properties.find(p => p.id === id);
  }

  public getLandlordProperties(landlordId: string): Property[] {
    return this.properties.filter(p => p.landlordId === landlordId);
  }

  public createProperty(propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'inquiriesCount'>): Property {
    const user = this.getCurrentUser();
    const newProperty: Property = {
      ...propertyData,
      id: 'prop_' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewsCount: 1,
      inquiriesCount: 0,
    };
    this.properties.unshift(newProperty);

    this.logAudit(user?.id || 'unknown', user?.name || 'Landlord', 'landlord', 'PROPERTY_CREATED', 'Property', newProperty.id, `Created listing: ${newProperty.title}`);
    this.persist();
    this.notify();
    return newProperty;
  }

  public updateProperty(id: string, updates: Partial<Property>): void {
    const prop = this.properties.find(p => p.id === id);
    if (prop) {
      Object.assign(prop, updates, { updatedAt: new Date().toISOString() });
      const user = this.getCurrentUser();
      this.logAudit(user?.id || 'unknown', user?.name || 'Landlord', user?.role || 'landlord', 'PROPERTY_UPDATED', 'Property', id, `Updated property ${prop.title}`);
      this.persist();
      this.notify();
    }
  }

  public togglePropertyStatus(id: string): void {
    const prop = this.properties.find(p => p.id === id);
    if (prop) {
      prop.status = prop.status === 'published' ? 'paused' : 'published';
      prop.updatedAt = new Date().toISOString();
      this.persist();
      this.notify();
    }
  }

  public deleteProperty(id: string): void {
    this.properties = this.properties.filter(p => p.id !== id);
    this.persist();
    this.notify();
  }

  // --- FAVORITES / SAVED ---

  public getSavedPropertyIds(): string[] {
    return Array.from(this.savedPropertyIds);
  }

  public isPropertySaved(id: string): boolean {
    return this.savedPropertyIds.has(id);
  }

  public toggleSaveProperty(id: string): void {
    if (this.savedPropertyIds.has(id)) {
      this.savedPropertyIds.delete(id);
    } else {
      this.savedPropertyIds.add(id);
    }
    this.persist();
    this.notify();
  }

  // --- COMPATIBILITY ENGINE ---

  public calculateCompatibilityForCurrentTenant(property: Property): CompatibilityResult | null {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'tenant') return null;
    const profile = this.getTenantProfile(currentUser.id);
    if (!profile) return null;
    return compatibilityEngine.evaluate(profile, property);
  }

  // --- MUTUAL MATCHES ---

  public getMatchesForUser(userId: string): MutualMatch[] {
    return this.matches.filter(m => m.tenantId === userId || m.landlordId === userId);
  }

  public expressInterest(propertyId: string, note?: string): MutualMatch {
    const user = this.getCurrentUser();
    if (!user || user.role !== 'tenant') {
      throw new Error('Only registered tenants can express interest in properties.');
    }
    const prop = this.getPropertyById(propertyId);
    if (!prop) throw new Error('Property not found');

    const existing = this.matches.find(m => m.propertyId === propertyId && m.tenantId === user.id);
    if (existing) return existing;

    const tenantProfile = this.getTenantProfile(user.id) || { ...SEED_TENANT_PROFILE, userId: user.id };
    const compResult = compatibilityEngine.evaluate(tenantProfile, prop);

    const match: MutualMatch = {
      id: 'match_' + Math.random().toString(36).substring(2, 9),
      propertyId: prop.id,
      propertyTitle: prop.title,
      propertyImage: prop.images[0] || '',
      propertyCity: prop.city,
      propertyLocality: prop.locality,
      propertyRent: prop.rent,
      tenantId: user.id,
      tenantName: user.name,
      tenantAvatar: user.avatarUrl,
      tenantProfession: tenantProfile.profession || 'Professional',
      landlordId: prop.landlordId,
      landlordName: prop.landlordName,
      landlordAvatar: prop.landlordAvatarUrl || '',
      compatibilityScore: compResult.overallScore,
      status: 'interest_expressed_by_tenant',
      initiatedBy: 'tenant',
      tenantNote: note || 'Interested in this property. Looking forward to discussing compatibility.',
      createdAt: new Date().toISOString()
    };

    this.matches.unshift(match);
    prop.inquiriesCount += 1;

    // Send notification to landlord
    this.addNotification({
      userId: prop.landlordId,
      type: 'match',
      title: 'New Interest Expressed! 🤝',
      message: `${user.name} expressed interest in ${prop.title} (${compResult.overallScore}% compatibility).`,
      linkUrl: '/landlord/dashboard'
    });

    this.logAudit(user.id, user.name, user.role, 'EXPRESS_INTEREST', 'Match', match.id, `Expressed interest in ${prop.title}`);
    this.persist();
    this.notify();
    return match;
  }

  public acceptMutualMatch(matchId: string, landlordNote?: string): void {
    const match = this.matches.find(m => m.id === matchId);
    if (!match) return;

    match.status = 'mutual_match';
    match.matchedAt = new Date().toISOString();
    if (landlordNote) match.landlordNote = landlordNote;

    // Create a conversation if one doesn't already exist
    let conv = this.conversations.find(c => c.propertyId === match.propertyId && c.tenantId === match.tenantId);
    if (!conv) {
      conv = {
        id: 'conv_' + Math.random().toString(36).substring(2, 9),
        propertyId: match.propertyId,
        propertyTitle: match.propertyTitle,
        propertyRent: match.propertyRent,
        tenantId: match.tenantId,
        tenantName: match.tenantName,
        tenantAvatar: match.tenantAvatar,
        landlordId: match.landlordId,
        landlordName: match.landlordName,
        landlordAvatar: match.landlordAvatar,
        lastMessageText: 'Mutual match confirmed! Direct chat unlocked.',
        lastMessageTimestamp: new Date().toISOString(),
        unreadCountTenant: 1,
        unreadCountLandlord: 0,
      };
      this.conversations.unshift(conv);

      // System greeting message
      this.messages.push({
        id: 'msg_' + Math.random().toString(36).substring(2, 9),
        conversationId: conv.id,
        senderId: 'system',
        senderName: 'RentMatch Arbiter',
        senderRole: 'admin',
        text: `🎉 Mutual Match Confirmed! Both parties have agreed to connect based on verified compatibility. You can now discuss viewing schedules, clarify terms, and proceed to digital leasing.`,
        timestamp: new Date().toISOString(),
        read: false,
      });
    }

    // Notify tenant
    this.addNotification({
      userId: match.tenantId,
      type: 'match',
      title: 'Mutual Match Confirmed! 🎉',
      message: `${match.landlordName} accepted your match request for ${match.propertyTitle}. Direct chat is now open!`,
      linkUrl: '/messages'
    });

    const user = this.getCurrentUser();
    this.logAudit(user?.id || 'unknown', user?.name || 'User', user?.role || 'landlord', 'MATCH_ACCEPTED', 'Match', matchId, `Mutual match established for ${match.propertyTitle}`);
    this.persist();
    this.notify();
  }

  public declineMatch(matchId: string): void {
    const match = this.matches.find(m => m.id === matchId);
    if (match) {
      match.status = 'declined';
      this.persist();
      this.notify();
    }
  }

  // --- APPLICATIONS ---

  public getApplicationsForUser(userId: string): RentalApplication[] {
    return this.applications.filter(a => a.tenantId === userId || a.landlordId === userId);
  }

  public getApplicationById(id: string): RentalApplication | undefined {
    return this.applications.find(a => a.id === id);
  }

  public submitApplication(data: {
    propertyId: string;
    proposedMoveInDate: string;
    proposedRent: number;
    proposedDeposit: number;
    occupantsCount: number;
    occupantDetails: string;
    employmentDetails: string;
    noteToLandlord: string;
  }): RentalApplication {
    const user = this.getCurrentUser();
    if (!user || user.role !== 'tenant') throw new Error('Only tenants can submit applications');

    const prop = this.getPropertyById(data.propertyId);
    if (!prop) throw new Error('Property not found');

    const app: RentalApplication = {
      id: 'app_' + Math.random().toString(36).substring(2, 9),
      propertyId: prop.id,
      propertyTitle: prop.title,
      propertyRent: prop.rent,
      tenantId: user.id,
      tenantName: user.name,
      tenantEmail: user.email,
      tenantPhone: user.phone,
      landlordId: prop.landlordId,
      proposedMoveInDate: data.proposedMoveInDate,
      proposedRent: data.proposedRent,
      proposedDeposit: data.proposedDeposit,
      occupantsCount: data.occupantsCount,
      occupantDetails: data.occupantDetails,
      employmentDetails: data.employmentDetails,
      noteToLandlord: data.noteToLandlord,
      status: 'submitted',
      statusHistory: [
        {
          status: 'submitted',
          timestamp: new Date().toISOString(),
          changedBy: user.name,
          note: 'Application formally submitted with verified profile data.'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.applications.unshift(app);

    this.addNotification({
      userId: prop.landlordId,
      type: 'application',
      title: 'New Tenancy Application Submitted',
      message: `${user.name} submitted a formal application for ${prop.title}.`,
      linkUrl: '/applications'
    });

    this.logAudit(user.id, user.name, 'tenant', 'APPLICATION_SUBMITTED', 'RentalApplication', app.id, `Application submitted for ${prop.title}`);
    this.persist();
    this.notify();
    return app;
  }

  public updateApplicationStatus(applicationId: string, status: ApplicationStatus, note?: string): void {
    const app = this.applications.find(a => a.id === applicationId);
    if (!app) return;

    const user = this.getCurrentUser();
    app.status = status;
    app.updatedAt = new Date().toISOString();
    app.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      changedBy: user?.name || 'Reviewer',
      note: note || `Application moved to ${status}`
    });

    // If application is accepted, automatically generate a draft lease agreement!
    if (status === 'accepted') {
      const prop = this.getPropertyById(app.propertyId);
      const tenant = this.users.find(u => u.id === app.tenantId);
      const landlord = this.users.find(u => u.id === app.landlordId);
      if (prop && tenant && landlord) {
        const lease = generateDraftLeaseAgreement(
          prop,
          tenant,
          landlord,
          app.id,
          {
            monthlyRent: app.proposedRent,
            securityDeposit: app.proposedDeposit,
            maintenanceCharges: prop.maintenance,
            durationMonths: prop.leaseDurationMonths,
            lockInMonths: prop.rules.lockInPeriodMonths,
            noticePeriodMonths: prop.noticePeriodMonths,
            commencementDate: app.proposedMoveInDate,
          }
        );
        this.leases.unshift(lease);

        this.addNotification({
          userId: app.tenantId,
          type: 'lease',
          title: 'Draft Lease Agreement Generated! 📝',
          message: `Your application was accepted! Review and e-sign your draft lease agreement for ${prop.title}.`,
          linkUrl: '/leases'
        });
      }
    }

    this.addNotification({
      userId: app.tenantId,
      type: 'application',
      title: `Application Update: ${status.replace('_', ' ').toUpperCase()}`,
      message: note || `Your application status is now ${status}.`,
      linkUrl: '/applications'
    });

    this.logAudit(user?.id || 'unknown', user?.name || 'User', user?.role || 'landlord', 'APPLICATION_STATUS_CHANGE', 'RentalApplication', app.id, `Status set to ${status}`);
    this.persist();
    this.notify();
  }

  public requestMoreInfoApplication(applicationId: string, question: string): void {
    const app = this.applications.find(a => a.id === applicationId);
    if (!app) return;

    app.status = 'more_info_requested';
    app.moreInfoRequestMessage = question;
    app.updatedAt = new Date().toISOString();
    const user = this.getCurrentUser();
    app.statusHistory.push({
      status: 'more_info_requested',
      timestamp: new Date().toISOString(),
      changedBy: user?.name || 'Landlord',
      note: question
    });

    this.addNotification({
      userId: app.tenantId,
      type: 'application',
      title: 'More Information Requested for Application',
      message: question,
      linkUrl: '/applications'
    });

    this.persist();
    this.notify();
  }

  // --- LEASES ---

  public getLeasesForUser(userId: string): LeaseAgreement[] {
    return this.leases.filter(l => l.tenantId === userId || l.landlordId === userId);
  }

  public signLeaseAsTenant(leaseId: string): void {
    const lease = this.leases.find(l => l.id === leaseId);
    if (!lease) return;

    lease.tenantSignatureStatus = 'signed';
    lease.tenantSignedAt = new Date().toISOString();
    lease.updatedAt = new Date().toISOString();

    if (lease.landlordSignatureStatus === 'signed') {
      lease.status = 'fully_executed';
    } else {
      lease.status = 'tenant_signed';
    }

    this.addNotification({
      userId: lease.landlordId,
      type: 'lease',
      title: 'Tenant E-Signed Agreement ✍️',
      message: `${lease.tenantName} has reviewed and e-signed the agreement. Please review and countersign.`,
      linkUrl: '/leases'
    });

    const user = this.getCurrentUser();
    this.logAudit(user?.id || 'unknown', user?.name || 'Tenant', 'tenant', 'LEASE_SIGNED_TENANT', 'Lease', leaseId, `Tenant digitally signed lease for ${lease.propertyTitle}`);
    this.persist();
    this.notify();
  }

  public signLeaseAsLandlord(leaseId: string): void {
    const lease = this.leases.find(l => l.id === leaseId);
    if (!lease) return;

    lease.landlordSignatureStatus = 'signed';
    lease.landlordSignedAt = new Date().toISOString();
    lease.updatedAt = new Date().toISOString();

    if (lease.tenantSignatureStatus === 'signed') {
      lease.status = 'fully_executed';
      lease.escrowStatus = 'deposit_in_escrow';
    } else {
      lease.status = 'landlord_signed';
    }

    this.addNotification({
      userId: lease.tenantId,
      type: 'lease',
      title: lease.status === 'fully_executed' ? 'Agreement Fully Executed! 🎉' : 'Landlord Signed Lease',
      message: `${lease.landlordName} has countersigned the agreement for ${lease.propertyTitle}.`,
      linkUrl: '/leases'
    });

    const user = this.getCurrentUser();
    this.logAudit(user?.id || 'unknown', user?.name || 'Landlord', 'landlord', 'LEASE_SIGNED_LANDLORD', 'Lease', leaseId, `Landlord signed lease for ${lease.propertyTitle}`);
    this.persist();
    this.notify();
  }

  // --- MESSAGES & CONVERSATIONS ---

  public getConversationsForUser(userId: string): Conversation[] {
    return this.conversations.filter(c => c.tenantId === userId || c.landlordId === userId);
  }

  public getMessagesForConversation(conversationId: string): ChatMessage[] {
    return this.messages.filter(m => m.conversationId === conversationId);
  }

  public sendMessage(conversationId: string, text: string): ChatMessage {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Must be logged in to send messages');

    const conv = this.conversations.find(c => c.id === conversationId);
    if (!conv) throw new Error('Conversation not found');

    const msg: ChatMessage = {
      id: 'msg_' + Math.random().toString(36).substring(2, 9),
      conversationId,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      text,
      timestamp: new Date().toISOString(),
      read: false,
    };

    this.messages.push(msg);
    conv.lastMessageText = text;
    conv.lastMessageTimestamp = msg.timestamp;

    const recipientId = user.id === conv.tenantId ? conv.landlordId : conv.tenantId;
    if (user.id === conv.tenantId) {
      conv.unreadCountLandlord += 1;
    } else {
      conv.unreadCountTenant += 1;
    }

    this.addNotification({
      userId: recipientId,
      type: 'message',
      title: `Message from ${user.name}`,
      message: text.length > 60 ? text.substring(0, 60) + '...' : text,
      linkUrl: '/messages'
    });

    this.persist();
    this.notify();
    return msg;
  }

  public markMessagesRead(conversationId: string): void {
    const user = this.getCurrentUser();
    if (!user) return;

    this.messages
      .filter(m => m.conversationId === conversationId && m.senderId !== user.id)
      .forEach(m => { m.read = true; });

    const conv = this.conversations.find(c => c.id === conversationId);
    if (conv) {
      if (user.id === conv.tenantId) conv.unreadCountTenant = 0;
      if (user.id === conv.landlordId) conv.unreadCountLandlord = 0;
    }

    this.persist();
    this.notify();
  }

  // --- VERIFICATIONS ---

  public getVerifications(): VerificationRequest[] {
    return [...this.verifications];
  }

  public submitVerification(data: {
    verificationType: VerificationRequest['verificationType'];
    propertyId?: string;
    docName: string;
    docType: 'aadhaar_masked' | 'pan_card' | 'property_tax_receipt' | 'electricity_bill' | 'employment_id' | 'sale_deed_extract';
  }): VerificationRequest {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Must be logged in');

    const prop = data.propertyId ? this.getPropertyById(data.propertyId) : undefined;

    const req: VerificationRequest = {
      id: 'vr_' + Math.random().toString(36).substring(2, 9),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      userEmail: user.email,
      propertyId: data.propertyId,
      propertyTitle: prop?.title,
      verificationType: data.verificationType,
      status: 'pending_review',
      documents: [
        {
          id: 'doc_' + Math.random().toString(36).substring(2, 9),
          type: data.docType,
          documentName: data.docName,
          url: 'https://example.com/mock-upload/' + encodeURIComponent(data.docName),
          uploadDate: new Date().toISOString(),
          status: 'pending'
        }
      ],
      submittedAt: new Date().toISOString()
    };

    this.verifications.unshift(req);
    user.verificationStatus = 'pending_review';

    this.logAudit(user.id, user.name, user.role, 'VERIFICATION_SUBMITTED', 'VerificationRequest', req.id, `Submitted ${data.verificationType} documents`);
    this.persist();
    this.notify();
    return req;
  }

  public reviewVerification(id: string, status: VerificationRequest['status'], reviewerNotes?: string): void {
    const req = this.verifications.find(r => r.id === id);
    if (!req) return;

    req.status = status;
    req.reviewerNotes = reviewerNotes;
    req.reviewedAt = new Date().toISOString();

    const targetUser = this.users.find(u => u.id === req.userId);
    if (targetUser) {
      targetUser.verificationStatus = status;
      if (status === 'verified') {
        targetUser.isVerified = true;
        targetUser.verificationBadgeReason = reviewerNotes || 'Verified by RentMatch Trust Desk';
      }
    }

    if (req.propertyId) {
      const prop = this.getPropertyById(req.propertyId);
      if (prop) {
        prop.verificationStatus = status;
        if (status === 'verified') {
          prop.verificationBadgeReason = reviewerNotes || 'Property deeds verified';
        }
      }
    }

    this.addNotification({
      userId: req.userId,
      type: 'verification',
      title: `Verification Status: ${status.replace('_', ' ').toUpperCase()}`,
      message: reviewerNotes || `Your verification request has been updated to ${status}.`,
      linkUrl: '/settings'
    });

    const admin = this.getCurrentUser();
    this.logAudit(admin?.id || 'admin', admin?.name || 'Admin', 'admin', 'VERIFICATION_REVIEWED', 'VerificationRequest', id, `Verification set to ${status}: ${reviewerNotes}`);
    this.persist();
    this.notify();
  }

  // --- USER REPORTS ---

  public getReports(): UserReport[] {
    return [...this.reports];
  }

  public submitReport(data: {
    reportedPropertyId?: string;
    reportedUserId?: string;
    reason: UserReport['reason'];
    description: string;
  }): UserReport {
    const user = this.getCurrentUser();
    const prop = data.reportedPropertyId ? this.getPropertyById(data.reportedPropertyId) : undefined;
    const targetUser = data.reportedUserId ? this.users.find(u => u.id === data.reportedUserId) : undefined;

    const rep: UserReport = {
      id: 'rep_' + Math.random().toString(36).substring(2, 9),
      reporterId: user?.id || 'anonymous',
      reporterName: user?.name || 'Anonymous User',
      reportedPropertyId: data.reportedPropertyId,
      reportedPropertyTitle: prop?.title,
      reportedUserId: data.reportedUserId,
      reportedUserName: targetUser?.name,
      reason: data.reason,
      description: data.description,
      status: 'submitted',
      createdAt: new Date().toISOString()
    };

    this.reports.unshift(rep);
    this.logAudit(user?.id || 'anon', user?.name || 'User', user?.role || 'user', 'REPORT_SUBMITTED', 'UserReport', rep.id, `Report filed for ${data.reason}`);
    this.persist();
    this.notify();
    return rep;
  }

  public resolveReport(id: string, status: UserReport['status'], resolutionNotes?: string): void {
    const rep = this.reports.find(r => r.id === id);
    if (!rep) return;

    rep.status = status;
    rep.resolutionNotes = resolutionNotes;

    const admin = this.getCurrentUser();
    this.logAudit(admin?.id || 'admin', admin?.name || 'Admin', 'admin', 'REPORT_RESOLVED', 'UserReport', id, `Report marked as ${status}: ${resolutionNotes}`);
    this.persist();
    this.notify();
  }

  // --- BLOG / KNOWLEDGE HUB ---

  public getBlogArticles(): BlogArticle[] {
    return [...this.blogArticles];
  }

  public getBlogArticleBySlug(slug: string): BlogArticle | undefined {
    return this.blogArticles.find(a => a.slug === slug);
  }

  public createBlogArticle(articleData: Omit<BlogArticle, 'id'>): BlogArticle {
    const article: BlogArticle = {
      ...articleData,
      id: 'blog_' + Math.random().toString(36).substring(2, 9),
    };
    this.blogArticles.unshift(article);
    this.persist();
    this.notify();
    return article;
  }

  public updateBlogArticle(id: string, updates: Partial<BlogArticle>): void {
    const art = this.blogArticles.find(a => a.id === id);
    if (art) {
      Object.assign(art, updates);
      this.persist();
      this.notify();
    }
  }

  public deleteBlogArticle(id: string): void {
    this.blogArticles = this.blogArticles.filter(a => a.id !== id);
    this.persist();
    this.notify();
  }

  // --- NOTIFICATIONS ---

  public getNotificationsForUser(userId: string): NotificationItem[] {
    return this.notifications.filter(n => n.userId === userId);
  }

  public addNotification(item: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>): void {
    const notif: NotificationItem = {
      ...item,
      id: 'notif_' + Math.random().toString(36).substring(2, 9),
      read: false,
      createdAt: new Date().toISOString()
    };
    this.notifications.unshift(notif);
  }

  public markNotificationRead(id: string): void {
    const n = this.notifications.find(item => item.id === id);
    if (n) {
      n.read = true;
      this.persist();
      this.notify();
    }
  }

  public markAllNotificationsRead(userId: string): void {
    this.notifications.filter(n => n.userId === userId).forEach(n => { n.read = true; });
    this.persist();
    this.notify();
  }

  // --- ALGORITHM WEIGHTS ---

  public getAlgorithmWeights(): AlgorithmWeights {
    return { ...this.algorithmWeights };
  }

  public updateAlgorithmWeights(newWeights: AlgorithmWeights): void {
    this.algorithmWeights = { ...newWeights };
    compatibilityEngine.updateWeights(newWeights);
    const admin = this.getCurrentUser();
    this.logAudit(admin?.id || 'admin', admin?.name || 'Admin', 'admin', 'ALGORITHM_WEIGHTS_UPDATED', 'Algorithm', 'compatibility_engine', `Weights adjusted: Budget=${newWeights.budgetWeight}%, Location=${newWeights.locationWeight}%`);
    this.persist();
    this.notify();
  }

  // --- SUBSCRIPTIONS (SIMULATED DEMO) ---

  public upgradeSubscription(tier: User['subscriptionTier'], simulatedPaymentId: string): void {
    const user = this.getCurrentUser();
    if (!user) return;

    user.subscriptionTier = tier;
    user.subscriptionExpiresAt = new Date(Date.now() + 30 * 86400000).toISOString();

    this.logAudit(user.id, user.name, user.role, 'SUBSCRIPTION_UPGRADED', 'Subscription', tier, `Subscribed to ${tier} (Simulated Payment ref: ${simulatedPaymentId})`);
    
    this.addNotification({
      userId: user.id,
      type: 'system',
      title: 'Subscription Activated! 🌟',
      message: `You are now on the ${tier.replace('_', ' ').toUpperCase()} tier. Enjoy unmetered inquiries & verified features.`,
      linkUrl: '/settings'
    });

    this.persist();
    this.notify();
  }

  // --- AUDIT LOGS ---

  public getAuditLogs(): AuditLogItem[] {
    return [...this.auditLogs];
  }

  private logAudit(userId: string, userName: string, userRole: string, action: string, entityType: string, entityId: string, details: string): void {
    const log: AuditLogItem = {
      id: 'audit_' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      userId,
      userName,
      userRole,
      action,
      entityType,
      entityId,
      details,
    };
    this.auditLogs.unshift(log);
  }

  // --- PLATFORM METRICS (LIVE CALCULATED) ---

  public getPlatformMetrics() {
    const totalUsers = this.users.length;
    const totalProperties = this.properties.length;
    const activeListings = this.properties.filter(p => p.status === 'published').length;
    const activeMatches = this.matches.filter(m => m.status === 'mutual_match').length;
    const totalApplications = this.applications.length;
    const activeLeases = this.leases.filter(l => l.status === 'fully_executed' || l.status === 'tenant_signed' || l.status === 'landlord_signed').length;
    const pendingVerifications = this.verifications.filter(v => v.status === 'pending_review' || v.status === 'manual_review_required').length;
    const openReports = this.reports.filter(r => r.status === 'submitted' || r.status === 'under_review').length;
    
    // Simulated Monthly Volume (Rent volume moving through platform)
    const activeRentVolumeInr = this.leases.reduce((sum, l) => sum + l.monthlyRent, 0) + 
      this.properties.filter(p => p.status === 'published').slice(0, 5).reduce((sum, p) => sum + p.rent, 0);

    return {
      totalUsers,
      totalProperties,
      activeListings,
      activeMatches,
      totalApplications,
      activeLeases,
      pendingVerifications,
      openReports,
      activeRentVolumeInr,
    };
  }
}

export const store = new RentMatchStore();
