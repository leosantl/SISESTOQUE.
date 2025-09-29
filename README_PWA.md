# SISESTOQUE - Progressive Web App (PWA)

## 🚀 Visão Geral

O SISESTOQUE é um Progressive Web App completo para gestão de estoque, desenvolvido com:

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS com design system customizado
- **Backend**: Supabase (Lovable Cloud)
- **PWA**: Manifest.json + Service Workers
- **UI Components**: Shadcn/ui + Radix UI
- **Estado**: TanStack Query (React Query)
- **Roteamento**: React Router v6

## ✨ Funcionalidades Principais

### Core Features
- ✅ **Autenticação completa** (Login/Signup com Supabase Auth)
- ✅ **Dashboard interativo** com métricas em tempo real
- ✅ **Gestão de Produtos** (CRUD completo)
- ✅ **Controle de Movimentações** (entradas/saídas de estoque)
- ✅ **Relatórios e Analytics** (visualizações com gráficos)
- ✅ **Rotas protegidas** para usuários autenticados

### PWA Features
- ✅ **Instalável** em dispositivos móveis e desktop
- ✅ **Funciona offline** (cache inteligente com Service Workers)
- ✅ **Responsivo** (mobile-first design)
- ✅ **Notificações Push** (suporte configurado)
- ✅ **Splash Screen** personalizada
- ✅ **Ícones otimizados** (192x192 e 512x512)
- ✅ **Atalhos rápidos** no launcher do dispositivo

## 📦 Estrutura do Projeto

```
sisestoque/
├── public/
│   ├── manifest.json          # Configuração do PWA
│   ├── service-worker.js      # Service Worker para cache offline
│   ├── icon-192x192.png       # Ícone do app (pequeno)
│   ├── icon-512x512.png       # Ícone do app (grande)
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── layouts/           # AppLayout, AppHeader, AppSidebar
│   │   └── ui/                # Componentes Shadcn/ui
│   ├── hooks/
│   │   ├── useAuth.tsx        # Hook de autenticação
│   │   ├── use-mobile.tsx     # Detecção de mobile
│   │   └── use-toast.ts       # Sistema de notificações
│   ├── integrations/
│   │   └── supabase/          # Cliente e tipos do Supabase
│   ├── pages/
│   │   ├── Index.tsx          # Landing page
│   │   ├── Auth.tsx           # Login/Signup
│   │   ├── Dashboard.tsx      # Dashboard principal
│   │   ├── Products.tsx       # Lista de produtos
│   │   ├── ProductForm.tsx    # Criar/Editar produto
│   │   ├── Movements.tsx      # Histórico de movimentações
│   │   └── Reports.tsx        # Relatórios e gráficos
│   ├── App.tsx                # Rotas e providers
│   ├── main.tsx               # Entry point + PWA registration
│   └── index.css              # Design system
├── supabase/
│   ├── config.toml            # Configuração do Supabase
│   └── migrations/            # Migrações do banco de dados
├── index.html                 # HTML principal com meta tags PWA
├── vite.config.ts             # Configuração do Vite
├── tailwind.config.ts         # Configuração do Tailwind
└── capacitor.config.ts        # Configuração Capacitor (mobile nativo)
```

## 🛠️ Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+ ou Bun
- Conta no Supabase (já configurado via Lovable Cloud)

### Instalação

```bash
# Clone o repositório
git clone [seu-repositorio]
cd sisestoque

# Instale as dependências
npm install
# ou
bun install

# Rode o servidor de desenvolvimento
npm run dev
# ou
bun dev
```

O app estará disponível em `http://localhost:8080`

### Build para Produção

```bash
# Crie o build otimizado
npm run build
# ou
bun build

# Preview do build de produção
npm run preview
# ou
bun preview
```

## 📱 Instalação do PWA

### Desktop (Chrome/Edge)
1. Acesse o app no navegador
2. Clique no ícone ➕ na barra de endereços
3. Selecione "Instalar SISESTOQUE"

### Mobile (Android/iOS)
1. Acesse o app no navegador
2. Abra o menu (⋮) 
3. Selecione "Adicionar à tela inicial"
4. O app será instalado como aplicativo nativo

## 🚀 Deploy em Produção

### Opção 1: Lovable Deploy (Recomendado)
1. Clique em "Publish" no editor Lovable
2. O app será automaticamente deployado com:
   - HTTPS habilitado
   - Service Workers funcionando
   - PWA instalável
   - Backend Supabase conectado

### Opção 2: Vercel/Netlify
```bash
# Build o projeto
npm run build

# Configure as variáveis de ambiente:
VITE_SUPABASE_URL=sua-url-supabase
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica

# Deploy na plataforma escolhida
```

**Importante**: Configure o `_headers` ou `vercel.json` para:
- Servir o service-worker.js com cache headers corretos
- Habilitar HTTPS (obrigatório para PWA)

### Opção 3: Servidor próprio
```bash
# Build do projeto
npm run build

# Copie a pasta dist/ para seu servidor
# Configure NGINX/Apache para:
# 1. Servir arquivos estáticos
# 2. Habilitar HTTPS
# 3. Configurar cache headers apropriados
```

## 🔧 Configuração do Service Worker

O `service-worker.js` implementa:

### Cache Strategy
- **Precache**: Assets críticos (HTML, manifest, ícones)
- **Network First**: Requisições de API (sempre busca dados frescos)
- **Cache Fallback**: Se offline, serve cache
- **Runtime Cache**: Cache dinâmico de assets durante uso

### Offline Support
- App funciona offline com dados em cache
- Formulários salvam dados localmente (localStorage)
- Sincroniza quando conexão retorna

## 🔔 Notificações Push

### Setup Backend (Edge Function)
```typescript
// supabase/functions/send-notification/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { title, body, userId } = await req.json()
  
  // Implementar lógica de envio via Web Push API
  // Requer configuração de VAPID keys
  
  return new Response(JSON.stringify({ success: true }))
})
```

### Request Permission (já implementado)
```typescript
// No main.tsx
Notification.requestPermission()
```

## 🎨 Design System

O app usa um design system customizado com:
- **Cores semânticas** (primary, secondary, accent, muted)
- **Dark/Light mode** automático
- **Componentes responsivos** (mobile-first)
- **Animações suaves** (tailwindcss-animate)

### Customização de Cores
Edite `src/index.css` para ajustar o tema:
```css
:root {
  --primary: [seu-hsl];
  --secondary: [seu-hsl];
  /* ... */
}
```

## 📊 Database Schema

### Tabelas Principais
- `products` - Produtos do estoque
- `movements` - Entradas/saídas de produtos
- `profiles` - Perfis de usuários (se necessário)

### RLS Policies
Todas as tabelas têm Row Level Security habilitada:
- Usuários só acessam seus próprios dados
- Políticas de SELECT, INSERT, UPDATE, DELETE configuradas

## 🔐 Autenticação

### Fluxos Implementados
- ✅ Signup com email/senha
- ✅ Login com email/senha
- ✅ Logout
- ✅ Sessão persistente
- ✅ Redirecionamento automático
- ✅ Rotas protegidas

### Configuração
Auto-confirm habilitado para desenvolvimento.
Para produção, configure no Supabase:
- Email templates
- SMTP provider
- Confirmação de email

## 🧪 Testing PWA

### Lighthouse Audit
```bash
# Instale o Lighthouse CLI
npm install -g lighthouse

# Rode audit PWA
lighthouse https://seu-app.com --view --preset=pwa
```

### Checklist PWA
- [ ] Score PWA 100% no Lighthouse
- [ ] Instalável em todos os dispositivos
- [ ] Funciona offline
- [ ] Fast loading (< 3s)
- [ ] HTTPS habilitado
- [ ] Responsive design
- [ ] Manifest válido
- [ ] Service Worker registrado

## 📱 Build Mobile Nativo (Capacitor)

O projeto já tem Capacitor configurado para builds nativos:

```bash
# Adicione as plataformas
npx cap add android
npx cap add ios

# Build do projeto
npm run build

# Sincronize com plataformas nativas
npx cap sync

# Abra no Android Studio / Xcode
npx cap open android
npx cap open ios
```

## 🐛 Troubleshooting

### Service Worker não registra
- Verifique se está em HTTPS (localhost funciona em HTTP)
- Limpe cache do navegador
- Verifique console para erros

### App não instala
- Confirme manifest.json válido
- Verifique se service worker está ativo
- Teste score PWA no Lighthouse

### Dados não sincronizam offline
- Verifique se service worker está cacheando corretamente
- Implemente sincronização com Background Sync API
- Use localStorage para dados temporários

## 📚 Recursos Adicionais

- [Documentação Lovable](https://docs.lovable.dev/)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)
- [Service Workers Guide](https://developers.google.com/web/fundamentals/primers/service-workers)
- [Supabase Docs](https://supabase.com/docs)
- [React Query](https://tanstack.com/query/latest)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Entre em contato: [seu-email]
- Documentação: [link-docs]

---

**Desenvolvido com ❤️ usando Lovable + React + Supabase**
