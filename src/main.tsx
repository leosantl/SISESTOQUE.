/**
 * Arquivo de entrada principal da aplicação SISESTOQUE
 * Responsável por inicializar o React e registrar o Service Worker para PWA
 */

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

/**
 * Registro do Service Worker para funcionalidade PWA
 * O Service Worker permite que o app funcione offline e seja instalável
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registrado com sucesso:', registration.scope);
      })
      .catch((error) => {
        console.log('Falha ao registrar Service Worker:', error);
      });
  });
}

/**
 * Solicitação de permissão para notificações do navegador
 * Permite enviar alertas sobre estoque baixo e produtos vencendo
 */
if ('Notification' in window && navigator.serviceWorker) {
  Notification.requestPermission().then((permission) => {
    console.log('Permissão de notificação:', permission);
  });
}

// Renderiza o componente principal da aplicação no elemento root do HTML
createRoot(document.getElementById("root")!).render(<App />);
