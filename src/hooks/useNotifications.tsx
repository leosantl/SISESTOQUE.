import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  code: string;
  quantity: number;
  min_quantity: number;
  expire_date: string | null;
}

interface NotificationSettings {
  lowStockEnabled: boolean;
  expirationEnabled: boolean;
  expirationDays: number;
}

export function useNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSettings>({
    lowStockEnabled: true,
    expirationEnabled: true,
    expirationDays: 7,
  });

  // Request permission for browser notifications
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Check for notifications periodically
  useEffect(() => {
    if (!user) return;

    const checkNotifications = async () => {
      try {
        const { data: products, error } = await (supabase as any)
          .from('products')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        if (products) {
          checkLowStockProducts(products);
          checkExpiringProducts(products);
        }
      } catch (error) {
        console.error('Erro ao verificar notificações:', error);
      }
    };

    // Check immediately and then every 30 minutes
    checkNotifications();
    const interval = setInterval(checkNotifications, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, settings]);

  const checkLowStockProducts = (products: Product[]) => {
    if (!settings.lowStockEnabled) return;

    const lowStockProducts = products.filter(p => p.quantity <= p.min_quantity);
    
    if (lowStockProducts.length > 0) {
      // Show toast notification
      toast({
        title: "⚠️ Estoque Baixo",
        description: `${lowStockProducts.length} produto(s) com estoque baixo`,
        variant: "destructive",
      });

      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification('SISESTOQUE - Estoque Baixo', {
          body: `${lowStockProducts.length} produto(s) precisam de reposição`,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
        });
      }
    }
  };

  const checkExpiringProducts = (products: Product[]) => {
    if (!settings.expirationEnabled) return;

    const now = new Date();
    const alertDate = new Date(now.getTime() + settings.expirationDays * 24 * 60 * 60 * 1000);

    const expiringProducts = products.filter(p => {
      if (!p.expire_date) return false;
      const expireDate = new Date(p.expire_date);
      return expireDate <= alertDate && expireDate >= now;
    });

    if (expiringProducts.length > 0) {
      // Show toast notification
      toast({
        title: "📅 Produtos Vencendo",
        description: `${expiringProducts.length} produto(s) vencem em ${settings.expirationDays} dias`,
        variant: "destructive",
      });

      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification('SISESTOQUE - Produtos Vencendo', {
          body: `${expiringProducts.length} produto(s) vencem em breve`,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
        });
      }
    }
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    localStorage.setItem('sisestoque-notifications', JSON.stringify({ ...settings, ...newSettings }));
  };

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('sisestoque-notifications');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Erro ao carregar configurações de notificação:', error);
      }
    }
  }, []);

  return {
    settings,
    updateSettings,
    requestPermission: () => Notification.requestPermission(),
    hasPermission: Notification.permission === 'granted',
  };
}