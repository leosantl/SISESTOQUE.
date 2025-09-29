import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp, TrendingDown, Package, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { exportMovements } from '@/utils/exportData';

interface Movement {
  id: string;
  product_id: string;
  movement_type: string;
  quantity: number;
  reason: string | null;
  created_at: string;
  products: {
    name: string;
    code: string;
  };
}

interface Product {
  id: string;
  name: string;
  code: string;
}

export default function Movements() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [movements, setMovements] = useState<Movement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    movement_type: 'in',
    quantity: '',
    reason: '',
  });

  useEffect(() => {
    if (user) {
      fetchMovements();
      fetchProducts();
    }
  }, [user]);

  const fetchMovements = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('stock_movements')
        .select(`
          *,
          products (name, code)
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMovements(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar movimentações",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('products')
        .select('id, name, code')
        .eq('user_id', user!.id);

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar produtos",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await (supabase as any)
        .from('stock_movements')
        .insert([{
          product_id: formData.product_id,
          movement_type: formData.movement_type,
          quantity: parseInt(formData.quantity),
          reason: formData.reason || null,
          user_id: user!.id,
        }]);

      if (error) throw error;

      toast({
        title: "Movimentação registrada",
        description: "A movimentação foi registrada com sucesso.",
      });

      setDialogOpen(false);
      setFormData({
        product_id: '',
        movement_type: 'in',
        quantity: '',
        reason: '',
      });
      fetchMovements();
    } catch (error: any) {
      toast({
        title: "Erro ao registrar movimentação",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Movimentações</h1>
          <p className="text-muted-foreground">Carregando movimentações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Movimentações</h1>
          <p className="text-muted-foreground">
            Histórico de entradas e saídas de estoque
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => exportMovements(movements)}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Movimentação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Movimentação</DialogTitle>
                <DialogDescription>
                  Registre uma entrada ou saída de estoque
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Produto *</Label>
                  <Select
                    value={formData.product_id}
                    onValueChange={(value) => setFormData({ ...formData, product_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - {product.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="movement_type">Tipo de Movimentação *</Label>
                  <Select
                    value={formData.movement_type}
                    onValueChange={(value) => setFormData({ ...formData, movement_type: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in">Entrada</SelectItem>
                      <SelectItem value="out">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Motivo</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Descreva o motivo da movimentação"
                  />
                </div>

                <div className="flex gap-4 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Registrar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {movements.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhuma movimentação registrada
            </h3>
            <p className="text-muted-foreground mb-4">
              Comece registrando sua primeira movimentação de estoque
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {movements.map((movement) => (
            <Card key={movement.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{movement.products.name}</CardTitle>
                    <CardDescription>Código: {movement.products.code}</CardDescription>
                  </div>
                  <Badge variant={movement.movement_type === 'in' ? 'success' : 'destructive'}>
                    {movement.movement_type === 'in' ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {movement.movement_type === 'in' ? 'Entrada' : 'Saída'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Quantidade</p>
                    <p className="text-lg font-bold">{movement.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="text-sm">{formatDate(movement.created_at)}</p>
                  </div>
                  {movement.reason && (
                    <div className="md:col-span-1">
                      <p className="text-sm text-muted-foreground">Motivo</p>
                      <p className="text-sm">{movement.reason}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}