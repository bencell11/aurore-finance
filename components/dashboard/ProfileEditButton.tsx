'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Settings, User } from 'lucide-react';

export default function ProfileEditButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push('/profil')}
      variant="outline"
      className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
    >
      <Settings className="w-4 h-4" />
      Modifier mon profil
    </Button>
  );
}
