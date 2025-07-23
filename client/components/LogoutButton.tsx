'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Button variant="destructive" onClick={logout}>
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}
