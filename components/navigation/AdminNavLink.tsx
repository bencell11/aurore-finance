'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminNavLink() {
  return (
    <Link href="/admin/login-simple">
      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
        <Shield className="h-4 w-4 mr-2" />
        Admin
      </Button>
    </Link>
  );
}