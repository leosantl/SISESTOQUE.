/**
 * Utilitários gerais da aplicação
 * Funções auxiliares para uso em toda a aplicação
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Função de utilitário para mesclar classes CSS de forma inteligente
 * Combina clsx e tailwind-merge para resolver conflitos de classes Tailwind
 * 
 * @param inputs - Array de classes CSS ou condicionais
 * @returns String com classes CSS mescladas sem conflitos
 * 
 * Exemplo:
 * cn("text-red-500", "text-blue-500") => "text-blue-500"
 * cn("p-4", condition && "p-8") => "p-8" (se condition for true)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
