import { 
  TenantProfile, 
  Property, 
  CompatibilityResult, 
  CompatibilityFactor, 
  AlgorithmWeights 
} from '../types';

/**
 * DEFAULT ALGORITHM WEIGHTS (Sum must equal 100%)
 * These weights reflect practical urban rental compatibility in India.
 * Can be fine-tuned dynamically by Platform Administrators.
 */
export const DEFAULT_ALGORITHM_WEIGHTS: AlgorithmWeights = {
  budgetWeight: 25,       // High sensitivity to monthly budget ceiling & deposit
  locationWeight: 20,     // Locality proximity & commute relevance
  moveInWeight: 15,       // Move-in date alignment
  propertyTypeWeight: 15, // BHK & furnishing preference
  amenitiesWeight: 15,    // Essential amenities (Power backup, Parking, Security, etc.)
  lifestyleWeight: 10,    // Pets, WFH compatibility, quiet hours & mutual house rules
};

/**
 * MUTUAL MERIT COMPATIBILITY ENGINE
 * 
 * CORE ETHICAL COMMITMENT:
 * This algorithm evaluates ONLY practical rental compatibility (budget, dates, amenities,
 * space requirements, and stated house policies).
 * It EXPLICITLY PROHIBITS and DOES NOT PROCESS caste, religion, gender, marital status,
 * regional origin, or any sensitive demographic indicators.
 */
export class CompatibilityEngine {
  private weights: AlgorithmWeights;

  constructor(customWeights?: Partial<AlgorithmWeights>) {
    this.weights = { ...DEFAULT_ALGORITHM_WEIGHTS, ...customWeights };
  }

  public updateWeights(newWeights: AlgorithmWeights): void {
    this.weights = { ...newWeights };
  }

  public getWeights(): AlgorithmWeights {
    return { ...this.weights };
  }

  /**
   * Evaluates tenant preferences against property attributes.
   * Produces an explainable, deterministic score between 0 and 100.
   */
  public evaluate(tenant: TenantProfile, property: Property): CompatibilityResult {
    const factors: CompatibilityFactor[] = [];
    const strengths: string[] = [];
    const clarificationPoints: string[] = [];

    // 1. BUDGET COMPATIBILITY (Weight: budgetWeight)
    const budgetFactor = this.calculateBudgetScore(tenant, property);
    factors.push(budgetFactor);
    if (budgetFactor.status === 'matched') {
      strengths.push(`Rent (₹${property.rent.toLocaleString('en-IN')}) is comfortably within your budget ceiling.`);
    } else if (budgetFactor.status === 'conflict') {
      clarificationPoints.push(`Rent exceeds your target budget by ₹${(property.rent - tenant.maxRent).toLocaleString('en-IN')}/mo.`);
    }

    // 2. MOVE-IN TIMING (Weight: moveInWeight)
    const moveInFactor = this.calculateMoveInScore(tenant, property);
    factors.push(moveInFactor);
    if (moveInFactor.status === 'matched') {
      strengths.push('Available date closely aligns with your target move-in schedule.');
    } else if (moveInFactor.status === 'conflict') {
      clarificationPoints.push(`Availability gap: Property is ready from ${property.availableFrom}, while your target is ${tenant.targetMoveInDate}.`);
    }

    // 3. LOCATION & LOCALITY (Weight: locationWeight)
    const locationFactor = this.calculateLocationScore(tenant, property);
    factors.push(locationFactor);
    if (locationFactor.status === 'matched') {
      strengths.push(`Located in ${property.locality}, ${property.city} — one of your preferred areas.`);
    }

    // 4. PROPERTY TYPE & FURNISHING (Weight: propertyTypeWeight)
    const typeFactor = this.calculatePropertyTypeScore(tenant, property);
    factors.push(typeFactor);
    if (typeFactor.status === 'matched') {
      strengths.push(`${property.bhk} BHK (${property.furnishing}) matches your exact living specification.`);
    }

    // 5. AMENITIES ALIGNMENT (Weight: amenitiesWeight)
    const amenitiesFactor = this.calculateAmenitiesScore(tenant, property);
    factors.push(amenitiesFactor);
    if (amenitiesFactor.status === 'matched') {
      strengths.push('Offers all your essential amenities.');
    } else if (amenitiesFactor.status === 'partial') {
      clarificationPoints.push('Some preferred amenities may require checking with landlord.');
    }

    // 6. LIFESTYLE & HOUSE RULES (Weight: lifestyleWeight)
    const lifestyleFactor = this.calculateLifestyleScore(tenant, property);
    factors.push(lifestyleFactor);
    if (lifestyleFactor.status === 'matched') {
      strengths.push('Living habits (WFH, pets, quiet hours) are in harmonious agreement.');
    } else if (lifestyleFactor.status === 'conflict') {
      clarificationPoints.push('House rule difference regarding pet policy or quiet hours.');
    }

    // Compute total weighted score
    let totalScore = 0;
    factors.forEach(f => {
      totalScore += (f.scorePercent * f.weightPercent) / 100;
    });

    const roundedScore = Math.min(100, Math.max(0, Math.round(totalScore)));

    let matchLevel: CompatibilityResult['matchLevel'] = 'Low Compatibility';
    if (roundedScore >= 85) {
      matchLevel = 'Exceptional Match';
    } else if (roundedScore >= 70) {
      matchLevel = 'Strong Match';
    } else if (roundedScore >= 50) {
      matchLevel = 'Moderate Match';
    }

    const summaryNote = this.generateSummaryNote(roundedScore, strengths, clarificationPoints);

    return {
      propertyId: property.id,
      overallScore: roundedScore,
      matchLevel,
      factors,
      summaryNote,
      strengths,
      clarificationPoints,
      isEligibleForExpressInterest: roundedScore >= 45,
    };
  }

  // --- FACTOR CALCULATORS ---

  private calculateBudgetScore(tenant: TenantProfile, property: Property): CompatibilityFactor {
    const weight = this.weights.budgetWeight;
    const rent = property.rent;
    const maxRent = tenant.maxRent;
    const maxDeposit = tenant.maxDeposit;

    let scorePercent = 0;
    let status: CompatibilityFactor['status'] = 'conflict';
    let explanation = '';

    if (rent <= maxRent && property.deposit <= maxDeposit) {
      scorePercent = 100;
      status = 'matched';
      explanation = `Rent ₹${rent.toLocaleString('en-IN')} and deposit ₹${property.deposit.toLocaleString('en-IN')} are within your ceiling of ₹${maxRent.toLocaleString('en-IN')} & ₹${maxDeposit.toLocaleString('en-IN')}.`;
    } else if (rent <= maxRent * 1.08 && property.deposit <= maxDeposit * 1.15) {
      scorePercent = 75;
      status = 'partial';
      explanation = `Rent is within 8% of your target budget ceiling. Deposit is negotiable within standard norms.`;
    } else if (rent <= maxRent * 1.2) {
      scorePercent = 45;
      status = 'partial';
      explanation = `Rent exceeds preferred budget by ${Math.round(((rent - maxRent) / maxRent) * 100)}%. Requires budget stretching.`;
    } else {
      scorePercent = 15;
      status = 'conflict';
      explanation = `Property rent (₹${rent.toLocaleString('en-IN')}) is substantially above your specified budget (₹${maxRent.toLocaleString('en-IN')}).`;
    }

    return {
      category: 'Budget',
      weightPercent: weight,
      scorePercent,
      status,
      tenantRequirement: `Budget: Max ₹${maxRent.toLocaleString('en-IN')}/mo, Deposit: Max ₹${maxDeposit.toLocaleString('en-IN')}`,
      propertyOffering: `Rent: ₹${rent.toLocaleString('en-IN')}/mo, Deposit: ₹${property.deposit.toLocaleString('en-IN')}`,
      explanation,
    };
  }

  private calculateMoveInScore(tenant: TenantProfile, property: Property): CompatibilityFactor {
    const weight = this.weights.moveInWeight;
    const targetDate = new Date(tenant.targetMoveInDate).getTime();
    const availableDate = new Date(property.availableFrom).getTime();
    const diffDays = Math.round((availableDate - targetDate) / (1000 * 60 * 60 * 24));

    let scorePercent = 0;
    let status: CompatibilityFactor['status'] = 'conflict';
    let explanation = '';

    if (Math.abs(diffDays) <= 7) {
      scorePercent = 100;
      status = 'matched';
      explanation = `Move-in timing is virtually identical (within 7 days).`;
    } else if (diffDays < 0 && Math.abs(diffDays) <= 30) {
      // Property is available earlier than tenant wants
      scorePercent = 85;
      status = 'matched';
      explanation = `Property is ready immediately, well ahead of your ${tenant.targetMoveInDate} target.`;
    } else if (diffDays > 0 && diffDays <= 20) {
      scorePercent = 70;
      status = 'partial';
      explanation = `Property available ${diffDays} days after your ideal move-in date.`;
    } else {
      scorePercent = 30;
      status = 'conflict';
      explanation = `Timeline difference of ${Math.abs(diffDays)} days between availability and requested date.`;
    }

    return {
      category: 'Move-in Timing',
      weightPercent: weight,
      scorePercent,
      status,
      tenantRequirement: `Target move-in: ${tenant.targetMoveInDate}`,
      propertyOffering: `Available from: ${property.availableFrom}`,
      explanation,
    };
  }

  private calculateLocationScore(tenant: TenantProfile, property: Property): CompatibilityFactor {
    const weight = this.weights.locationWeight;
    const propertyLoc = property.locality.toLowerCase();
    const propertyCity = property.city.toLowerCase();

    const matchesLocality = tenant.preferredLocations.some(loc => 
      propertyLoc.includes(loc.toLowerCase()) || loc.toLowerCase().includes(propertyLoc)
    );

    let scorePercent = 0;
    let status: CompatibilityFactor['status'] = 'conflict';
    let explanation = '';

    if (matchesLocality) {
      scorePercent = 100;
      status = 'matched';
      explanation = `Exact match for your preferred locality (${property.locality}).`;
    } else {
      // In same city, adjacent locality
      scorePercent = 60;
      status = 'partial';
      explanation = `In ${property.city}, in close proximity to your target corridors.`;
    }

    return {
      category: 'Location & Locality',
      weightPercent: weight,
      scorePercent,
      status,
      tenantRequirement: tenant.preferredLocations.join(', '),
      propertyOffering: `${property.locality}, ${property.city}`,
      explanation,
    };
  }

  private calculatePropertyTypeScore(tenant: TenantProfile, property: Property): CompatibilityFactor {
    const weight = this.weights.propertyTypeWeight;
    const bhkMatches = tenant.preferredBhk.includes(property.bhk);
    const furnishingMatches = tenant.preferredFurnishing.includes(property.furnishing);

    let scorePercent = 0;
    let status: CompatibilityFactor['status'] = 'conflict';
    let explanation = '';

    if (bhkMatches && furnishingMatches) {
      scorePercent = 100;
      status = 'matched';
      explanation = `Matches your preferred ${property.bhk} BHK layout and ${property.furnishing} specification.`;
    } else if (bhkMatches) {
      scorePercent = 75;
      status = 'partial';
      explanation = `Desired ${property.bhk} BHK size, but furnishing is ${property.furnishing}.`;
    } else if (furnishingMatches) {
      scorePercent = 50;
      status = 'partial';
      explanation = `Furnishing matches (${property.furnishing}), but BHK differs from initial target.`;
    } else {
      scorePercent = 25;
      status = 'conflict';
      explanation = `Layout (${property.bhk} BHK) and furnishing do not align with preferred criteria.`;
    }

    return {
      category: 'Property Type & Furnishing',
      weightPercent: weight,
      scorePercent,
      status,
      tenantRequirement: `${tenant.preferredBhk.map(b => b + ' BHK').join('/')}, ${tenant.preferredFurnishing.join('/')}`,
      propertyOffering: `${property.bhk} BHK, ${property.furnishing}`,
      explanation,
    };
  }

  private calculateAmenitiesScore(tenant: TenantProfile, property: Property): CompatibilityFactor {
    const weight = this.weights.amenitiesWeight;
    const required = tenant.requiredAmenities;

    if (!required || required.length === 0) {
      return {
        category: 'Amenities',
        weightPercent: weight,
        scorePercent: 100,
        status: 'matched',
        tenantRequirement: 'No strict required amenities',
        propertyOffering: `${property.amenities.length} amenities available`,
        explanation: 'All property amenities meet baseline requirements.',
      };
    }

    const matchedAmenities = required.filter(item => 
      property.amenities.some(propAmenity => 
        propAmenity.toLowerCase().includes(item.toLowerCase()) || 
        item.toLowerCase().includes(propAmenity.toLowerCase())
      )
    );

    const ratio = matchedAmenities.length / required.length;
    const scorePercent = Math.round(ratio * 100);

    let status: CompatibilityFactor['status'] = 'conflict';
    if (ratio >= 0.8) {
      status = 'matched';
    } else if (ratio >= 0.5) {
      status = 'partial';
    }

    return {
      category: 'Amenities',
      weightPercent: weight,
      scorePercent,
      status,
      tenantRequirement: `${required.length} required (${required.slice(0, 3).join(', ')}${required.length > 3 ? '...' : ''})`,
      propertyOffering: `${matchedAmenities.length} of ${required.length} preferred available`,
      explanation: `${matchedAmenities.length} of your ${required.length} requested amenities are available on-premise.`,
    };
  }

  private calculateLifestyleScore(tenant: TenantProfile, property: Property): CompatibilityFactor {
    const weight = this.weights.lifestyleWeight;
    let points = 0;
    const maxPoints = 3;

    // Pet compatibility
    const tenantHasPet = tenant.petStatus !== 'no_pets';
    const landlordAllowsPet = property.rules.petsAllowed;
    let petConflict = false;

    if (tenantHasPet && !landlordAllowsPet) {
      petConflict = true;
    } else {
      points += 1;
    }

    // WFH compatibility
    if (tenant.workMode === 'remote' || tenant.workMode === 'hybrid') {
      if (property.rules.wfhFriendly) {
        points += 1;
      } else {
        points += 0.5;
      }
    } else {
      points += 1;
    }

    // Quiet hours compatibility
    if (property.rules.quietHours) {
      points += 1;
    } else {
      points += 0.8;
    }

    const scorePercent = Math.round((points / maxPoints) * 100);
    let status: CompatibilityFactor['status'] = 'matched';

    if (petConflict) {
      status = 'conflict';
    } else if (scorePercent < 75) {
      status = 'partial';
    }

    return {
      category: 'Lifestyle & House Rules',
      weightPercent: weight,
      scorePercent: petConflict ? Math.min(scorePercent, 35) : scorePercent,
      status,
      tenantRequirement: `Pet: ${tenant.petStatus.replace('_', ' ')}, Work: ${tenant.workMode}`,
      propertyOffering: `Pets: ${landlordAllowsPet ? 'Allowed' : 'Not permitted'}, WFH: ${property.rules.wfhFriendly ? 'Supported' : 'Standard'}`,
      explanation: petConflict 
        ? 'Pet policy conflict: Landlord prefers no pets without prior clearance.' 
        : 'Lifestyle habits, working routines, and community quiet hours are compatible.',
    };
  }

  private generateSummaryNote(score: number, strengths: string[], clarifications: string[]): string {
    if (score >= 85) {
      return `Outstanding mutual alignment (${score}%). Stated preferences on budget, space layout, and living standards are in high synergy.`;
    } else if (score >= 70) {
      return `Solid compatibility (${score}%). Most core parameters match; ${clarifications.length > 0 ? clarifications[0] : 'recommended for conversation'}.`;
    } else if (score >= 50) {
      return `Moderate alignment (${score}%). Key aspects align, but a few areas may require mutual clarification before formal agreement.`;
    } else {
      return `Low compatibility (${score}%). Noticeable discrepancies in budget, availability timeline, or lifestyle guidelines.`;
    }
  }
}

// Singleton instance
export const compatibilityEngine = new CompatibilityEngine();
