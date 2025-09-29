import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ProductFormData {
  name: string;
  code: string;
  price: string;
  quantity: string;
  min_quantity: string;
  expire_date: string;
}

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    code: '',
    price: '',
    quantity: '',
    min_quantity: '5',
    expire_date: '',
  });

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing && user) {
      fetchProduct();
    }
  }, [id, user]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('user_id', user!.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          name: data.name,
          code: data.code,
          price: data.price.toString(),
          quantity: data.quantity.toString(),
          min_quantity: data.min_quantity.toString(),
          expire_date: data.expire_date || '',
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao carregar produto",
        description: error.message,
        variant: "destructive",
      });
      navigate('/products');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        code: formData.code,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        min_quantity: parseInt(formData.min_quantity),
        expire_date: formData.expire_date || null,
        user_id: user!.id,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Produto atualizado",
          description: "O produto foi atualizado com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;

        toast({
          title: "Produto cadastrado",
          description: "O produto foi cadastrado com sucesso.",
        });
      }

      navigate('/products');
    } catch (error: any) {
      toast({
        title: isEditing ? "Erro ao atualizar produto" : "Erro ao cadastrar produto",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/products')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEditing ? 'Editar Produto' : 'Novo Produto'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Atualize as informações do produto' : 'Cadastre um novo produto no estoque'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Produto</CardTitle>
          <CardDescription>
            Preencha os dados do produto abaixo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Notebook Dell"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Código *</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  placeholder="Ex: PROD001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="min_quantity">Quantidade Mínima *</Label>
                <Input
                  id="min_quantity"
                  name="min_quantity"
                  type="number"
                  min="0"
                  value={formData.min_quantity}
                  onChange={handleChange}
                  required
                  placeholder="5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expire_date">Data de Validade</Label>
                <Input
                  id="expire_date"
                  name="expire_date"
                  type="date"
                  value={formData.expire_date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex gap-4 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/products')}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
