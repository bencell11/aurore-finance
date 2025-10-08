'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/lib/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Settings, 
  LogOut, 
  Target,
  BarChart3,
  CreditCard
} from 'lucide-react';

export default function UserMenu() {
  const router = useRouter();
  const { user, logout } = useSupabaseAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return (
      <Button 
        variant="outline" 
        onClick={() => router.push('/auth')}
        className="bg-white/80 backdrop-blur-sm"
      >
        <User className="w-4 h-4 mr-2" />
        Se connecter
      </Button>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getUserInitials = () => {
    const initials = `${user.prenom?.[0] || ''}${user.nom?.[0] || ''}`.toUpperCase();
    return initials || user.email[0].toUpperCase();
  };

  const formatUserName = () => {
    if (user.prenom && user.nom) {
      return `${user.prenom} ${user.nom}`;
    }
    return user.email;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-medium">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {formatUserName()}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => {
            router.push('/dashboard');
            setIsOpen(false);
          }}
          className="cursor-pointer"
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          <span>Tableau de bord</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => {
            router.push('/simulateurs');
            setIsOpen(false);
          }}
          className="cursor-pointer"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Simulateurs</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => {
            router.push('/objectifs');
            setIsOpen(false);
          }}
          className="cursor-pointer"
        >
          <Target className="mr-2 h-4 w-4" />
          <span>Mes objectifs</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => {
            router.push('/profil');
            setIsOpen(false);
          }}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Mon profil</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}