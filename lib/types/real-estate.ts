/**
 * Types pour la recherche immobilière
 */

export interface PropertySearchCriteria {
  propertyType: 'apartment' | 'house' | 'studio' | 'commercial' | 'land';
  transactionType: 'rent' | 'buy';
  location?: {
    city?: string;
    canton?: string;
    postalCode?: string;
    radius?: number; // km
  };
  price?: {
    min?: number;
    max?: number;
  };
  rooms?: {
    min?: number;
    max?: number;
  };
  surface?: {
    min?: number; // m²
    max?: number; // m²
  };
  features?: string[]; // balcony, parking, elevator, etc.
}

export interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: 'apartment' | 'house' | 'studio' | 'commercial' | 'land';
  transactionType: 'rent' | 'buy';

  // Location
  address: {
    street?: string;
    city: string;
    postalCode: string;
    canton: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  // Price
  price: number; // CHF per month (rent) or total price (buy)
  charges?: number; // Charges mensuelles (rent)
  deposit?: number; // Caution (rent)

  // Characteristics
  rooms: number;
  surface: number; // m²
  floor?: number;
  totalFloors?: number;
  yearBuilt?: number;

  // Features
  features: string[];

  // Images
  images: string[];
  mainImage?: string;

  // Contact
  agency?: string;
  contact?: {
    name?: string;
    phone?: string;
    email?: string;
  };

  // Metadata
  source?: 'ai-generated' | 'immoscout24' | 'homegate' | 'comparis';
  sourceUrl?: string; // URL de l'annonce originale (si données réelles)
  publishedDate?: string;
  availability?: string;

  // Calculated fields
  pricePerSqm?: number;
  affordabilityScore?: number; // 0-100
}

export interface AffordabilityCalculation {
  monthlyIncome: number;
  maxMonthlyRent: number; // 30% rule
  maxMonthlyMortgage: number; // 33% rule
  maxLoanAmount: number;
  maxPropertyPrice: number;
  downPaymentRequired: number; // 20% minimum
  canAfford: boolean;
  recommendation: string;
}

export interface LocationAnalysis {
  city: string;
  canton: string;

  // Cost of living
  averageRent1Room: number;
  averageRent3Rooms: number;
  averageRent5Rooms: number;

  // Transportation
  publicTransportScore: number; // 0-10
  nearestTrainStation?: string;
  distanceToStation?: number; // km

  // Amenities
  schoolsNearby: number;
  shoppingScore: number; // 0-10
  healthcareScore: number; // 0-10

  // Tax
  averageTaxRate: number; // %
  taxFriendliness: 'low' | 'medium' | 'high';

  // Market
  averagePricePerSqm: number;
  marketTrend: 'rising' | 'stable' | 'falling';

  // Quality of life
  qualityOfLifeScore: number; // 0-100
}

export interface PropertyAlert {
  id: string;
  userId: string;
  criteria: PropertySearchCriteria;
  email: string;
  frequency: 'instant' | 'daily' | 'weekly';
  active: boolean;
  createdAt: string;
  lastNotified?: string;
}

export interface MortgageSimulation {
  propertyPrice: number;
  downPayment: number;
  loanAmount: number;
  interestRate: number; // %
  duration: number; // years

  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;

  amortizationSchedule?: {
    year: number;
    principal: number;
    interest: number;
    remaining: number;
  }[];
}

export interface TaxImplication {
  canton: string;
  propertyValue: number;

  // Annual costs
  propertyTax: number; // Impôt foncier
  wealthTax: number; // Impôt sur la fortune
  rentalValue: number; // Valeur locative (for owners)

  // Deductions (for owners)
  mortgageInterestDeduction: number;
  maintenanceDeduction: number;

  // Total impact
  annualTaxImpact: number;
  monthlyImpact: number;
}
