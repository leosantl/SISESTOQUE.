/**
 * Componente de rota protegida
 * Redireciona usuários não autenticados para a página de login
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/**
 * Props do componente ProtectedRoute
 */
interface ProtectedRouteProps {
  children: React.ReactNode;  // Componentes filhos que devem ser protegidos
}

/**
 * Componente que protege rotas que requerem autenticação
 * Exibe um loading enquanto verifica autenticação
 * Redireciona para /auth se usuário não estiver autenticado
 * 
 * @param children - Componentes que serão renderizados se usuário estiver autenticado
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // Exibe tela de carregamento enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          {/* Spinner de carregamento */}
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redireciona para página de autenticação se não houver usuário
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Renderiza componentes filhos se usuário estiver autenticado
  return <>{children}</>;
}
