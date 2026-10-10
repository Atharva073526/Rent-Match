import { describe, it, expect } from 'vitest';
import { CompatibilityEngine } from '../services/compatibilityEngine';
import { TenantProfile, Property } from '../types';

describe('Mutual Merit Compatibility Engine', () => {
  const engine = new CompatibilityEngine();

  const mockTenant: TenantProfile = {
    userId: 'tenant_test_1',
    preferredLocations: ['Indiranagar', 'Koramangala'],
    minRent: 30000,
    maxRent: 50000,
    maxDeposit: 150000,
    targetMoveInDate: '2026-11-01',
    preferredBhk: [2],
    preferredFurnishing: ['semi-furnished'],
    requiredAmenities: ['Power Backup (100%)', 'High-Speed Fiber Ready'],
    householdType: 'single',
    workMode: 'hybrid',
    petStatus: 'no_pets',
    dietaryPreference: 'no_restriction',
    quietHoursPreference: 'moderate',
    commutePriority: 'close_to_metro',
    profileCompleteness: 90,
  };

  const mockProperty: Property = {
    id: 'prop_test_1',
    landlordId: 'landlord_test_1',
    landlordName: 'Test Owner',
    title: 'Test 2 BHK Indiranagar',
    description: 'Nice flat',
    city: 'Bengaluru',
    locality: 'Indiranagar',
    address: '100 Feet Road',
    pincode: '560038',
    rent: 45000,
    deposit: 100000,
    maintenance: 3000,
    bhk: 2,
    bathrooms: 2,
    carpetAreaSqFt: 1100,
    floor: 2,
    totalFloors: 4,
    facing: 'East',
    furnishing: 'semi-furnished',
    propertyType: 'apartment',
    availableFrom: '2026-11-01',
    leaseDurationMonths: 11,
    noticePeriodMonths: 1,
    images: ['https://example.com/photo.jpg'],
    amenities: ['Power Backup (100%)', 'High-Speed Fiber Ready', 'Balcony'],
    rules: {
      dietaryPreference: 'no_restriction',
      petsAllowed: true,
      quietHours: '10:00 PM - 06:00 AM',
      wfhFriendly: true,
      guestPolicy: 'flexible',
      lockInPeriodMonths: 6,
    },
    verificationStatus: 'verified',
    c2paAuthentic: true,
    status: 'published',
    viewsCount: 10,
    inquiriesCount: 2,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  };

  it('calculates exceptional match when all parameters align perfectly', () => {
    const result = engine.evaluate(mockTenant, mockProperty);
    expect(result.overallScore).toBeGreaterThanOrEqual(85);
    expect(result.matchLevel).toBe('Exceptional Match');
    expect(result.isEligibleForExpressInterest).toBe(true);
    expect(result.factors).toHaveLength(6);
  });

  it('penalizes when property rent significantly exceeds tenant budget', () => {
    const highRentProp = { ...mockProperty, rent: 90000 };
    const result = engine.evaluate(mockTenant, highRentProp);
    
    const budgetFactor = result.factors.find(f => f.category === 'Budget');
    expect(budgetFactor?.status).toBe('conflict');
    expect(result.overallScore).toBeLessThan(80);
  });

  it('flags conflict when tenant has pets but landlord prohibits pets', () => {
    const tenantWithPet: TenantProfile = { ...mockTenant, petStatus: 'dog' };
    const noPetProp: Property = {
      ...mockProperty,
      rules: { ...mockProperty.rules, petsAllowed: false }
    };

    const result = engine.evaluate(tenantWithPet, noPetProp);
    const lifestyleFactor = result.factors.find(f => f.category === 'Lifestyle & House Rules');
    expect(lifestyleFactor?.status).toBe('conflict');
    expect(result.clarificationPoints.some(cp => cp.toLowerCase().includes('pet'))).toBe(true);
  });

  it('allows dynamic weight adjustments by admin', () => {
    const customEngine = new CompatibilityEngine({
      budgetWeight: 50,
      locationWeight: 10,
      moveInWeight: 10,
      propertyTypeWeight: 10,
      amenitiesWeight: 10,
      lifestyleWeight: 10,
    });

    const weights = customEngine.getWeights();
    expect(weights.budgetWeight).toBe(50);
  });
});
