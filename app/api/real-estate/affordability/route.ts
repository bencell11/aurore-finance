/**
 * API: Calculateur d'affordabilité immobilière
 */

import { NextRequest, NextResponse } from 'next/server';
import { AffordabilityService } from '@/lib/services/real-estate/affordability.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { monthlyIncome, hasPartner, propertyPrice, transactionType } = body;

    if (!monthlyIncome || typeof monthlyIncome !== 'number') {
      return NextResponse.json(
        { error: 'monthlyIncome is required and must be a number' },
        { status: 400 }
      );
    }

    console.log('[API affordability] Calculating for income:', monthlyIncome);

    // Calcul général d'affordabilité
    const affordability = AffordabilityService.calculateAffordability(
      monthlyIncome,
      hasPartner || false
    );

    // Si un bien spécifique est fourni, calculer pour ce bien
    let propertyCheck = null;
    if (propertyPrice && transactionType) {
      propertyCheck = AffordabilityService.canAffordProperty(
        monthlyIncome,
        propertyPrice,
        transactionType,
        hasPartner || false
      );
    }

    return NextResponse.json({
      success: true,
      affordability,
      propertyCheck
    });

  } catch (error: any) {
    console.error('[API affordability] Error:', error);

    return NextResponse.json(
      {
        error: 'Erreur lors du calcul',
        details: error.message
      },
      { status: 500 }
    );
  }
}
