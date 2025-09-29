import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register Service Worker for PWA
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

// Request notification permission
if ('Notification' in window && navigator.serviceWorker) {
  Notification.requestPermission().then((permission) => {
    console.log('Permissão de notificação:', permission);
  });
}

createRoot(document.getElementById("root")!).render(<App />);
