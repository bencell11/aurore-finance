'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminNavLink() {
  // Ne montrer le lien admin qu'en développement ou si explicitement activé
  const showAdminLink = process.env.NODE_ENV === 'development' || 
                       process.env.NEXT_PUBLIC_SHOW_ADMIN === 'true';

  if (!showAdminLink) {
    return null;
  }

  return (
    <Link href="/admin/users">
      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
        <Shield className="h-4 w-4 mr-2" />
        Admin
      </Button>
    </Link>
  );
}