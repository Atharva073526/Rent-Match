import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../services/store';

describe('RentMatch Store & Workflow Integration Tests', () => {
  beforeEach(() => {
    store.resetToSeeds();
  });

  it('initializes with seed users and default tenant session', () => {
    const user = store.getCurrentUser();
    expect(user).not.toBeNull();
    expect(user?.role).toBe('tenant');
    expect(user?.email).toBe('ananya.sharma@example.com');
  });

  it('supports seamless demo user role switching', () => {
    store.switchUser('user_landlord_1');
    const landlord = store.getCurrentUser();
    expect(landlord?.role).toBe('landlord');
    expect(landlord?.name).toBe('Rajesh Mehta');

    store.switchUser('user_admin_1');
    const admin = store.getCurrentUser();
    expect(admin?.role).toBe('admin');
  });

  it('allows tenant to express interest in a property', () => {
    store.switchUser('user_tenant_1');
    const propId = 'prop_bandra_04';
    const match = store.expressInterest(propId, 'Interested in Bandra listing');
    
    expect(match.status).toBe('interest_expressed_by_tenant');
    expect(match.tenantId).toBe('user_tenant_1');
    expect(match.propertyId).toBe(propId);
  });

  it('progresses to mutual match when landlord accepts', () => {
    store.switchUser('user_tenant_1');
    const match = store.expressInterest('prop_gachibowli_06', 'Please review');

    store.switchUser('user_landlord_4');
    store.acceptMutualMatch(match.id, 'Welcome, let us connect!');

    const updatedMatches = store.getMatchesForUser('user_tenant_1');
    const targetMatch = updatedMatches.find(m => m.id === match.id);
    expect(targetMatch?.status).toBe('mutual_match');
  });

  it('submits rental application and generates draft lease upon landlord approval', () => {
    store.switchUser('user_tenant_1');
    const app = store.submitApplication({
      propertyId: 'prop_indiranagar_01',
      proposedMoveInDate: '2026-11-01',
      proposedRent: 48000,
      proposedDeposit: 120000,
      occupantsCount: 1,
      occupantDetails: 'Single working professional',
      employmentDetails: 'Senior Engineer at Atlassian',
      noteToLandlord: 'Ready for lease'
    });

    expect(app.status).toBe('submitted');

    // Landlord accepts application
    store.switchUser('user_landlord_1');
    store.updateApplicationStatus(app.id, 'accepted', 'Approved for tenancy');

    const updatedApp = store.getApplicationById(app.id);
    expect(updatedApp?.status).toBe('accepted');

    const leases = store.getLeasesForUser('user_tenant_1');
    const activeLease = leases.find(l => l.applicationId === app.id);
    expect(activeLease).toBeDefined();
    expect(activeLease?.monthlyRent).toBe(48000);
    expect(activeLease?.status).toBe('draft');
  });

  it('correctly calculates live platform metrics from database state', () => {
    const metrics = store.getPlatformMetrics();
    expect(metrics.totalUsers).toBeGreaterThanOrEqual(3);
    expect(metrics.totalProperties).toBeGreaterThanOrEqual(6);
    expect(metrics.activeListings).toBeGreaterThanOrEqual(5);
  });
});
