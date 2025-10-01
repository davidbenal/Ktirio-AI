# 🚀 Guia de Configuração do Ktírio AI

Este guia vai te ajudar a configurar completamente o Ktírio AI com Clerk, Firebase e Stripe.

---

## 📋 Índice

1. [Configuração do Clerk](#1-configuração-do-clerk)
2. [Configuração do Firebase](#2-configuração-do-firebase)
3. [Configuração do Stripe](#3-configuração-do-stripe)
4. [Configuração das Variáveis de Ambiente](#4-variáveis-de-ambiente)
5. [Estrutura do Projeto](#5-estrutura-do-projeto)
6. [Próximos Passos](#6-próximos-passos)

---

## 1. 🔐 Configuração do Clerk

### Passo 1: Criar Conta no Clerk
1. Acesse [clerk.com](https://clerk.com)
2. Crie uma conta gratuita
3. Crie uma nova aplicação

### Passo 2: Configurar Aplicação
1. No dashboard do Clerk, vá em **Applications**
2. Clique na sua aplicação
3. Copie o **Publishable Key**

### Passo 3: Configurar Rotas
No Clerk dashboard:
- **Home URL**: `http://localhost:5173` (desenvolvimento)
- **Sign-in URL**: `/sign-in`
- **Sign-up URL**: `/sign-up`
- **After sign-in URL**: `/editor`
- **After sign-up URL**: `/editor`

### Passo 4: Adicionar ao .env
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

---

## 2. 🔥 Configuração do Firebase

### Passo 1: Criar Projeto
1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em **Adicionar projeto**
3. Nomeie o projeto (ex: `ktirio-ai`)
4. Desabilite Google Analytics (opcional)
5. Clique em **Criar projeto**

### Passo 2: Configurar Firestore
1. No menu lateral, clique em **Firestore Database**
2. Clique em **Criar banco de dados**
3. Selecione **Iniciar no modo de produção**
4. Escolha a localização (ex: `southamerica-east1` para São Paulo)
5. Clique em **Ativar**

### Passo 3: Configurar Regras do Firestore
Cole as seguintes regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para coleção de usuários
    match /users/{userId} {
      // Permite ler/escrever apenas dados do próprio usuário
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Permite ler/escrever projetos do usuário
      match /projects/{projectId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Permite ler/escrever pastas do usuário
      match /folders/{folderId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### Passo 4: Configurar Storage
1. No menu lateral, clique em **Storage**
2. Clique em **Começar**
3. Aceite as regras padrão
4. Escolha a mesma localização do Firestore

### Passo 5: Configurar Regras do Storage
Cole as seguintes regras:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      // Permite upload/download apenas para o próprio usuário
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Passo 6: Obter Credenciais
1. No menu lateral, clique no ícone de engrenagem ⚙️
2. Clique em **Configurações do projeto**
3. Role até **Seus apps**
4. Clique no ícone **</>** (Web)
5. Registre o app (nome: `ktirio-ai-web`)
6. Copie todas as credenciais do `firebaseConfig`

### Passo 7: Adicionar ao .env
```bash
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=ktirio-ai.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ktirio-ai
VITE_FIREBASE_STORAGE_BUCKET=ktirio-ai.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## 3. 💳 Configuração do Stripe

### Passo 1: Criar Conta
1. Acesse [stripe.com](https://stripe.com)
2. Crie uma conta
3. Complete o processo de verificação

### Passo 2: Obter Chaves de API
1. No dashboard, clique em **Developers** > **API keys**
2. Copie a **Publishable key** (começa com `pk_test_`)
3. Guarde a **Secret key** (começa com `sk_test_`) - você vai usar no backend

### Passo 3: Criar Produtos
1. No dashboard, clique em **Products**
2. Clique em **+ Add product**

Crie os seguintes produtos:

#### Produto 1: Plano Básico
- **Name**: Ktírio AI - Plano Básico
- **Description**: 100 créditos por mês
- **Price**: R$ 29.90/mês
- Depois de criar, copie o **Price ID** (ex: `price_abc123`)

#### Produto 2: Plano Profissional
- **Name**: Ktírio AI - Plano Profissional
- **Description**: 500 créditos por mês
- **Price**: R$ 99.90/mês
- Copie o **Price ID**

#### Produto 3: Plano Empresarial
- **Name**: Ktírio AI - Plano Empresarial
- **Description**: Créditos ilimitados
- **Price**: R$ 299.90/mês
- Copie o **Price ID**

### Passo 4: Atualizar Price IDs
Abra o arquivo `services/stripeService.ts` e substitua os `priceId` pelos IDs reais:

```typescript
export const PLANS = {
  [PricingPlan.BASIC]: {
    // ...
    priceId: 'price_seu_id_real_aqui', // ← Substitua aqui
  },
  // ... faça o mesmo para PRO e ENTERPRISE
};
```

### Passo 5: Adicionar ao .env
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Passo 6: Configurar Webhooks (Importante!)
Os webhooks são necessários para sincronizar pagamentos com o Firebase.

1. No dashboard Stripe, vá em **Developers** > **Webhooks**
2. Clique em **+ Add endpoint**
3. URL do endpoint: `https://seu-dominio.com/api/stripe-webhook`
4. Selecione os eventos:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copie o **Signing secret** (começa com `whsec_`)

**Nota**: Você precisará criar um endpoint de webhook no backend para processar esses eventos.

---

## 4. 🔑 Variáveis de Ambiente

### Criar arquivo .env.local
Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

### Preencher todas as variáveis
Abra `.env.local` e preencha com suas credenciais:

```bash
# Gemini AI
VITE_GEMINI_API_KEY=sua_chave_aqui

# Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_test_sua_chave_aqui

# Firebase
VITE_FIREBASE_API_KEY=sua_chave_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_id
VITE_FIREBASE_APP_ID=seu_app_id

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_aqui
```

---

## 5. 📁 Estrutura do Projeto

```
ktirio-ai/
├── components/           # Componentes React
│   ├── Editor.tsx       # Editor principal
│   ├── PricingPage.tsx  # Página de planos
│   └── ...
├── config/              # Configurações
│   └── firebase.ts      # Config Firebase
├── contexts/            # Context API
│   ├── CreditsContext.tsx
│   ├── ProjectsContext.tsx
│   └── ...
├── services/            # Serviços
│   ├── firebaseService.ts
│   ├── stripeService.ts
│   └── geminiService.ts
├── hooks/               # Custom hooks
├── types.ts             # TypeScript types
├── .env.local          # Variáveis de ambiente (NÃO commitar!)
└── .env.example        # Exemplo de variáveis
```

---

## 6. ✅ Próximos Passos

### Passo 1: Integrar Clerk no App
Edite `index.tsx` ou `App.tsx` para adicionar o ClerkProvider:

```typescript
import { ClerkProvider } from '@clerk/clerk-react';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      {/* Seu app aqui */}
    </ClerkProvider>
  );
}
```

### Passo 2: Adicionar CreditsProvider
Envolva sua aplicação com o CreditsProvider:

```typescript
import { CreditsProvider } from './contexts/CreditsContext';

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <CreditsProvider>
        {/* Seu app aqui */}
      </CreditsProvider>
    </ClerkProvider>
  );
}
```

### Passo 3: Atualizar ProjectsContext
Migre os dados mockados para usar o Firebase:

```typescript
import { 
  getUserProjects, 
  createProject, 
  updateProject, 
  deleteProject 
} from '../services/firebaseService';
```

### Passo 4: Criar Backend para Stripe
Você precisará criar endpoints para:
- `POST /api/create-checkout-session` - Criar sessão de checkout
- `POST /api/stripe-webhook` - Processar webhooks do Stripe

Recomendo usar:
- **Vercel Functions** (serverless)
- **Firebase Functions**
- **Express.js** no Node.js

### Passo 5: Testar Localmente
```bash
npm run dev
```

Acesse: `http://localhost:5173`

---

## 🆘 Solução de Problemas

### Erro: "Firebase: Error (auth/operation-not-allowed)"
- Vá no Firebase Console > Authentication
- Ative o provedor de email/senha

### Erro: "Clerk: Invalid publishable key"
- Verifique se a chave está correta no .env.local
- Reinicie o servidor de desenvolvimento

### Erro: "Stripe: No such price"
- Verifique se os Price IDs estão corretos em `stripeService.ts`
- Certifique-se que os produtos estão ativos no Stripe

---

## 📚 Recursos Úteis

- [Documentação do Clerk](https://clerk.com/docs)
- [Documentação do Firebase](https://firebase.google.com/docs)
- [Documentação do Stripe](https://stripe.com/docs)
- [Documentação do React](https://react.dev)

---

## 🎉 Pronto!

Agora você tem todas as ferramentas necessárias para integrar Clerk, Firebase e Stripe no Ktírio AI!

Se tiver dúvidas, consulte a documentação oficial de cada serviço.
