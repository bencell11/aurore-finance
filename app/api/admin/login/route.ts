import { NextRequest, NextResponse } from 'next/server';
import { createAdminSession } from '@/middleware/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const { accessKey } = await request.json();
    
    const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY || 'aurore-admin-2025';
    
    if (accessKey === ADMIN_ACCESS_KEY) {
      const response = NextResponse.json({ 
        success: true, 
        message: 'Accès admin accordé' 
      });
      
      return createAdminSession(response);
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Clé d\'accès invalide' 
      }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur serveur' 
    }, { status: 500 });
  }
}