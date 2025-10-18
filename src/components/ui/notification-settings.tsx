/**
 * Componente de configuração de notificações
 * Permite ao usuário ativar/desativar alertas e configurar preferências
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Bell, BellOff } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

/**
 * Componente de configurações de notificação
 * Permite gerenciar alertas de estoque baixo e vencimento de produtos
 */
export function NotificationSettings() {
  // Hook com estado e funções de notificação
  const { settings, updateSettings, requestPermission, hasPermission } = useNotifications();

  /**
   * Solicita permissão para notificações e recarrega a página
   * Recarregamento necessário para atualizar status da permissão
   */
  const handlePermissionRequest = async () => {
    await requestPermission();
    window.location.reload();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Configurações de Notificação
        </CardTitle>
        <CardDescription>
          Configure alertas automáticos para controle do estoque
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Aviso se notificações não foram permitidas */}
        {!hasPermission && (
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BellOff className="h-4 w-4 text-warning" />
              <p className="text-sm font-medium text-warning">
                Notificações do navegador desabilitadas
              </p>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Para receber alertas automáticos, permita notificações no seu navegador.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePermissionRequest}
            >
              Permitir Notificações
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {/* Configuração de alertas de estoque baixo */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="low-stock">Alertas de Estoque Baixo</Label>
              <p className="text-xs text-muted-foreground">
                Receba notificações quando produtos atingirem o estoque mínimo
              </p>
            </div>
            <Switch
              id="low-stock"
              checked={settings.lowStockEnabled}
              onCheckedChange={(checked) => 
                updateSettings({ lowStockEnabled: checked })
              }
            />
          </div>

          {/* Configuração de alertas de vencimento */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="expiration">Alertas de Vencimento</Label>
                <p className="text-xs text-muted-foreground">
                  Receba notificações sobre produtos próximos ao vencimento
                </p>
              </div>
              <Switch
                id="expiration"
                checked={settings.expirationEnabled}
                onCheckedChange={(checked) => 
                  updateSettings({ expirationEnabled: checked })
                }
              />
            </div>

            {/* Campo para configurar dias de antecedência - exibido apenas se alertas estiverem ativos */}
            {settings.expirationEnabled && (
              <div className="ml-4 space-y-2">
                <Label htmlFor="expiration-days">
                  Alertar com antecedência de (dias):
                </Label>
                <Input
                  id="expiration-days"
                  type="number"
                  min="1"
                  max="90"
                  value={settings.expirationDays}
                  onChange={(e) => 
                    updateSettings({ expirationDays: parseInt(e.target.value) || 7 })
                  }
                  className="w-20"
                />
              </div>
            )}
          </div>
        </div>

        {/* Informação sobre frequência de verificação */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            As notificações são verificadas automaticamente a cada 30 minutos quando o aplicativo está aberto.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
