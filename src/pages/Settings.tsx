import React from 'react';
import { NotificationSettings } from '@/components/ui/notification-settings';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema
        </p>
      </div>

      <NotificationSettings />
    </div>
  );
}