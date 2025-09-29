import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';

interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  expiringProducts: number;
  totalValue: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  useNotifications(); // Initialize notifications
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockProducts: 0,
    expiringProducts: 0,
    totalValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      const { data: products, error } = await (supabase as any)
        .from('products')
        .select('*')
        .eq('user_id', user!.id);

      if (error) throw error;

      const now = new Date();
      const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const totalProducts = products?.length || 0;
      const lowStockProducts = products?.filter(p => p.quantity <= p.min_quantity).length || 0;
      const expiringProducts = products?.filter(p => 
        p.expire_date && new Date(p.expire_date) <= next30Days
      ).length || 0;
      const totalValue = products?.reduce((sum, p) => sum + (p.price * p.quantity), 0) || 0;

      setStats({
        totalProducts,
        lowStockProducts,
        expiringProducts,
        totalValue,
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do seu estoque
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              produtos cadastrados
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">
              produtos com baixo estoque
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo ao Vencimento</CardTitle>
            <Calendar className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.expiringProducts}</div>
            <p className="text-xs text-muted-foreground">
              vencem em 30 dias
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              valor total do estoque
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      {(stats.lowStockProducts > 0 || stats.expiringProducts > 0) && (
        <Card className="border-l-4 border-l-warning bg-warning/5">
          <CardHeader>
            <CardTitle className="text-warning flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Atenção Necessária
            </CardTitle>
            <CardDescription>
              Existem produtos que precisam da sua atenção
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.lowStockProducts > 0 && (
              <p className="text-sm text-muted-foreground">
                • {stats.lowStockProducts} produto(s) com estoque baixo
              </p>
            )}
            {stats.expiringProducts > 0 && (
              <p className="text-sm text-muted-foreground">
                • {stats.expiringProducts} produto(s) próximo(s) ao vencimento
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}