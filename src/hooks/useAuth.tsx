/**
 * Hook personalizado de autenticação
 * Gerencia todo o estado de autenticação da aplicação usando Supabase Auth
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Interface que define o tipo do contexto de autenticação
 * Contém o usuário atual, sessão e funções de autenticação
 */
interface AuthContextType {
  user: User | null;                                                    // Usuário autenticado ou null
  session: Session | null;                                              // Sessão ativa ou null
  loading: boolean;                                                     // Estado de carregamento
  signIn: (email: string, password: string) => Promise<{ error: any }>; // Função de login
  signUp: (email: string, password: string) => Promise<{ error: any }>; // Função de cadastro
  signOut: () => Promise<void>;                                         // Função de logout
}

// Criação do contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provedor do contexto de autenticação
 * Componente que envolve a aplicação e fornece o contexto de autenticação
 * 
 * @param children - Componentes filhos que terão acesso ao contexto
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Estados locais para armazenar informações de autenticação
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  /**
   * Effect que configura o listener de mudanças no estado de autenticação
   * Executa quando o componente é montado
   */
  useEffect(() => {
    // Configura listener para mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Verifica se já existe uma sessão ativa ao carregar a página
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Cleanup: cancela a inscrição ao desmontar o componente
    return () => subscription.unsubscribe();
  }, []);

  /**
   * Função de login do usuário
   * Autentica o usuário com email e senha usando Supabase
   * 
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @returns Objeto com possível erro da operação
   */
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // Exibe toast de erro se houver falha no login
      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
      }
      
      return { error };
    } catch (error: any) {
      // Tratamento de erros inesperados
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
      return { error };
    }
  };

  /**
   * Função de cadastro de novo usuário
   * Cria uma nova conta de usuário no Supabase
   * 
   * @param email - Email para cadastro
   * @param password - Senha para cadastro
   * @returns Objeto com possível erro da operação
   */
  const signUp = async (email: string, password: string) => {
    try {
      // Define URL de redirecionamento após confirmação do email
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      // Exibe mensagem de erro ou sucesso
      if (error) {
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Cadastro realizado!",
          description: "Você já pode fazer login com suas credenciais.",
        });
      }
      
      return { error };
    } catch (error: any) {
      // Tratamento de erros inesperados
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
      return { error };
    }
  };

  /**
   * Função de logout do usuário
   * Encerra a sessão atual do usuário
   */
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      // Tratamento de erros inesperados
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    }
  };

  // Objeto com todos os valores do contexto
  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook customizado para acessar o contexto de autenticação
 * Deve ser usado dentro de um componente envolvido pelo AuthProvider
 * 
 * @returns Objeto com estado e funções de autenticação
 * @throws Error se usado fora do AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}