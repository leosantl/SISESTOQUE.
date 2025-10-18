/**
 * Hook personalizado para gerenciamento de notificações
 * Controla alertas de estoque baixo e produtos vencendo
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

/**
 * Interface que define a estrutura de um produto
 */
interface Product {
  id: string;
  name: string;
  code: string;
  quantity: number;
  min_quantity: number;
  expire_date: string | null;
}

/**
 * Interface para configurações de notificação
 */
interface NotificationSettings {
  lowStockEnabled: boolean;       // Alertas de estoque baixo habilitados
  expirationEnabled: boolean;     // Alertas de vencimento habilitados
  expirationDays: number;         // Dias de antecedência para alertar vencimento
}

/**
 * Hook customizado para gerenciar notificações do sistema
 * Verifica periodicamente produtos com estoque baixo ou próximos ao vencimento
 * 
 * @returns Objeto com configurações e funções para gerenciar notificações
 */
export function useNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Estado das configurações de notificação
  const [settings, setSettings] = useState<NotificationSettings>({
    lowStockEnabled: true,
    expirationEnabled: true,
    expirationDays: 7,
  });

  /**
   * Solicita permissão para notificações do navegador ao montar o componente
   */
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  /**
   * Effect que verifica notificações periodicamente
   * Executa verificação imediatamente e depois a cada 30 minutos
   */
  useEffect(() => {
    if (!user) return;

    /**
     * Função que busca produtos e verifica condições para notificação
     */
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

    // Verifica imediatamente e depois a cada 30 minutos
    checkNotifications();
    const interval = setInterval(checkNotifications, 30 * 60 * 1000);

    // Cleanup: limpa o intervalo ao desmontar
    return () => clearInterval(interval);
  }, [user, settings]);

  /**
   * Verifica produtos com estoque baixo e envia notificações
   * 
   * @param products - Array de produtos a serem verificados
   */
  const checkLowStockProducts = (products: Product[]) => {
    if (!settings.lowStockEnabled) return;

    // Filtra produtos com quantidade menor ou igual ao estoque mínimo
    const lowStockProducts = products.filter(p => p.quantity <= p.min_quantity);
    
    if (lowStockProducts.length > 0) {
      // Exibe notificação toast na aplicação
      toast({
        title: "⚠️ Estoque Baixo",
        description: `${lowStockProducts.length} produto(s) com estoque baixo`,
        variant: "destructive",
      });

      // Envia notificação do navegador se permissão concedida
      if (Notification.permission === 'granted') {
        new Notification('SISESTOQUE - Estoque Baixo', {
          body: `${lowStockProducts.length} produto(s) precisam de reposição`,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
        });
      }
    }
  };

  /**
   * Verifica produtos próximos ao vencimento e envia notificações
   * 
   * @param products - Array de produtos a serem verificados
   */
  const checkExpiringProducts = (products: Product[]) => {
    if (!settings.expirationEnabled) return;

    const now = new Date();
    // Calcula data limite para alerta baseado nas configurações
    const alertDate = new Date(now.getTime() + settings.expirationDays * 24 * 60 * 60 * 1000);

    // Filtra produtos que vencem dentro do período configurado
    const expiringProducts = products.filter(p => {
      if (!p.expire_date) return false;
      const expireDate = new Date(p.expire_date);
      return expireDate <= alertDate && expireDate >= now;
    });

    if (expiringProducts.length > 0) {
      // Exibe notificação toast na aplicação
      toast({
        title: "📅 Produtos Vencendo",
        description: `${expiringProducts.length} produto(s) vencem em ${settings.expirationDays} dias`,
        variant: "destructive",
      });

      // Envia notificação do navegador se permissão concedida
      if (Notification.permission === 'granted') {
        new Notification('SISESTOQUE - Produtos Vencendo', {
          body: `${expiringProducts.length} produto(s) vencem em breve`,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
        });
      }
    }
  };

  /**
   * Atualiza configurações de notificação e salva no localStorage
   * 
   * @param newSettings - Objeto com configurações a serem atualizadas
   */
  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    localStorage.setItem('sisestoque-notifications', JSON.stringify({ ...settings, ...newSettings }));
  };

  /**
   * Carrega configurações salvas do localStorage ao montar
   */
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

  // Retorna configurações e funções para uso no componente
  return {
    settings,                                               // Configurações atuais
    updateSettings,                                         // Função para atualizar configurações
    requestPermission: () => Notification.requestPermission(), // Função para solicitar permissão
    hasPermission: Notification.permission === 'granted',   // Status da permissão
  };
}
