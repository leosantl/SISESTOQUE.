import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, BarChart3, Shield, Smartphone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">SISESTOQUE</h1>
          </div>
          <Button onClick={() => navigate('/auth')} variant="outline">
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Sistema de
            <span className="block text-primary">Controle de Estoque</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Simplifique o controle do seu estoque com uma solução intuitiva, 
            desenvolvida especialmente para micro e pequenas empresas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')} className="gap-2">
              <Package className="h-5 w-5" />
              Começar Agora
            </Button>
            <Button size="lg" variant="outline">
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Funcionalidades Principais
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tudo que você precisa para gerenciar seu estoque de forma eficiente
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center p-6 rounded-xl bg-card/50 border border-border">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Gestão de Produtos</h3>
            <p className="text-sm text-muted-foreground">
              Cadastre e gerencie produtos com código, preço, quantidade e validade
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-card/50 border border-border">
            <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-success" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Relatórios</h3>
            <p className="text-sm text-muted-foreground">
              Acompanhe movimentações de entrada e saída com relatórios detalhados
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-card/50 border border-border">
            <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-warning" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Notificações</h3>
            <p className="text-sm text-muted-foreground">
              Alertas automáticos para estoque baixo e produtos próximos ao vencimento
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-card/50 border border-border">
            <div className="h-12 w-12 rounded-lg bg-info/10 flex items-center justify-center mx-auto mb-4">
              <Smartphone className="h-6 w-6 text-info" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Mobile</h3>
            <p className="text-sm text-muted-foreground">
              Acesse seu estoque de qualquer lugar com nossa aplicação móvel
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Pronto para começar?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Crie sua conta gratuita e comece a gerenciar seu estoque hoje mesmo
          </p>
          <Button size="lg" onClick={() => navigate('/auth')} className="gap-2">
            <Package className="h-5 w-5" />
            Criar Conta Grátis
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border">
        <div className="text-center text-muted-foreground">
          <p>&copy; 2024 SISESTOQUE. Desenvolvido para micro e pequenas empresas.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
