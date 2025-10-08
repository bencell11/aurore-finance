/**
 * Exports simplifiés des données fiscales suisses
 * Re-exporte depuis swiss-tax-database.ts
 */

import { SWISS_TAX_DATABASE, type CantonTaxData } from './swiss-tax-database';

// Export des données cantonales
export const cantonalTaxData = SWISS_TAX_DATABASE;

// Taux fédéraux IFD 2024
export const federalTaxRates = {
  single: [
    { from: 0, to: 17800, rate: 0 },
    { from: 17800, to: 31600, rate: 0.77 },
    { from: 31600, to: 41400, rate: 0.88 },
    { from: 41400, to: 55200, rate: 2.64 },
    { from: 55200, to: 72500, rate: 2.97 },
    { from: 72500, to: 78100, rate: 5.94 },
    { from: 78100, to: 103600, rate: 6.60 },
    { from: 103600, to: 134600, rate: 8.80 },
    { from: 134600, to: 176000, rate: 11.00 },
    { from: 176000, to: 755200, rate: 13.20 },
    { from: 755200, to: Infinity, rate: 11.50 }
  ],
  married: [
    { from: 0, to: 35600, rate: 0 },
    { from: 35600, to: 63200, rate: 1.00 },
    { from: 63200, to: 82800, rate: 2.00 },
    { from: 82800, to: 110400, rate: 3.00 },
    { from: 110400, to: 145000, rate: 4.00 },
    { from: 145000, to: 156200, rate: 5.00 },
    { from: 156200, to: 207200, rate: 6.00 },
    { from: 207200, to: 269200, rate: 7.00 },
    { from: 269200, to: 352000, rate: 8.00 },
    { from: 352000, to: 907800, rate: 9.00 },
    { from: 907800, to: Infinity, rate: 11.50 }
  ]
};

// Export des types
export type { CantonTaxData } from './swiss-tax-database';
