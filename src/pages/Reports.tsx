import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, TrendingDown, AlertTriangle, DollarSign, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { exportProducts, exportLowStockReport, exportExpiringReport } from '@/utils/exportData';

interface Product {
  id: string;
  name: string;
  code: string;
  price: number;
  quantity: number;
  min_quantity: number;
  expire_date: string | null;
}

export default function Reports() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('products')
        .select('*')
        .eq('user_id', user!.id);

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar relatórios",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const lowStockProducts = products.filter(p => p.quantity <= p.min_quantity);
  const expiringSoonProducts = products.filter(p => {
    if (!p.expire_date) return false;
    const now = new Date();
    const expire = new Date(p.expire_date);
    const diffDays = Math.ceil((expire.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  });
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">
            Visualize informações e análises do estoque
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => exportProducts(products as any)}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar Produtos
          </Button>
          <Button 
            variant="outline" 
            onClick={() => exportLowStockReport(products as any)}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar Estoque Baixo
          </Button>
          <Button 
            variant="outline" 
            onClick={() => exportExpiringReport(products as any)}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar Vencimentos
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <TrendingDown className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{lowStockProducts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Vencendo em Breve</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{expiringSoonProducts.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="low-stock" className="space-y-4">
        <TabsList>
          <TabsTrigger value="low-stock">Estoque Baixo</TabsTrigger>
          <TabsTrigger value="expiring">Vencendo em Breve</TabsTrigger>
        </TabsList>

        <TabsContent value="low-stock" className="space-y-4">
          {lowStockProducts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Nenhum produto com estoque baixo</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {lowStockProducts.map(product => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>Código: {product.code}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 md:grid-cols-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Quantidade Atual</p>
                        <p className="text-lg font-bold text-warning">{product.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Quantidade Mínima</p>
                        <p className="text-lg font-bold">{product.min_quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Preço Unitário</p>
                        <p className="text-lg font-bold">{formatCurrency(product.price)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="expiring" className="space-y-4">
          {expiringSoonProducts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Nenhum produto vencendo em breve</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {expiringSoonProducts.map(product => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>Código: {product.code}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 md:grid-cols-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Data de Validade</p>
                        <p className="text-lg font-bold text-destructive">
                          {formatDate(product.expire_date!)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Quantidade</p>
                        <p className="text-lg font-bold">{product.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Valor Total</p>
                        <p className="text-lg font-bold">
                          {formatCurrency(product.price * product.quantity)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
