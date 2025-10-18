/**
 * Componente principal da aplicação SISESTOQUE
 * Configura as rotas, provedores de contexto e layout geral
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { AppLayout } from "@/components/layouts/AppLayout";

// Importação de todas as páginas da aplicação
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import Reports from "./pages/Reports";
import Movements from "./pages/Movements";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

/**
 * Configuração do cliente React Query
 * Gerencia cache e estado de requisições assíncronas
 */
const queryClient = new QueryClient();

/**
 * Componente App - Raiz da aplicação
 * Configura todos os provedores de contexto e define as rotas
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        {/* Componentes de notificação toast */}
        <Toaster />
        <Sonner />
        
        <BrowserRouter>
          <Routes>
            {/* ===== ROTAS PÚBLICAS ===== */}
            {/* Página inicial de apresentação do sistema */}
            <Route path="/" element={<Index />} />
            
            {/* Página de autenticação (login/cadastro) */}
            <Route path="/auth" element={<Auth />} />
            
            {/* ===== ROTAS PROTEGIDAS ===== */}
            {/* Requerem autenticação e são envolvidas pelo AppLayout */}
            
            {/* Dashboard principal com resumo do estoque */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* Listagem de produtos */}
            <Route path="/products" element={
              <ProtectedRoute>
                <AppLayout>
                  <Products />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* Formulário de criação de novo produto */}
            <Route path="/products/new" element={
              <ProtectedRoute>
                <AppLayout>
                  <ProductForm />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* Formulário de edição de produto existente */}
            <Route path="/products/edit/:id" element={
              <ProtectedRoute>
                <AppLayout>
                  <ProductForm />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* Página de relatórios e análises */}
            <Route path="/reports" element={
              <ProtectedRoute>
                <AppLayout>
                  <Reports />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* Página de movimentações de estoque */}
            <Route path="/movements" element={
              <ProtectedRoute>
                <AppLayout>
                  <Movements />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* Página de configurações do sistema */}
            <Route path="/settings" element={
              <ProtectedRoute>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* Rota 404 - Página não encontrada */}
            {/* IMPORTANTE: Manter sempre como última rota */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
