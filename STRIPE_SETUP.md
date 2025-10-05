# Stripe + Firebase Functions Setup Guide

Este guia completo mostra como configurar e implementar a integração Stripe com Firebase Functions para processamento de pagamentos no Ktirio AI.

---

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração do Stripe](#configuração-do-stripe)
3. [Configuração do Firebase](#configuração-do-firebase)
4. [Desenvolvimento Local](#desenvolvimento-local)
5. [Deploy para Produção](#deploy-para-produção)
6. [Testes](#testes)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Pré-requisitos

- Node.js 18 ou superior
- Conta no [Stripe](https://stripe.com)
- Projeto Firebase configurado
- Firebase CLI instalado globalmente:
  ```bash
  npm install -g firebase-tools
  ```

---

## 💳 Configuração do Stripe

### Passo 1: Criar Produtos e Preços no Stripe Dashboard

1. Acesse o [Stripe Dashboard](https://dashboard.stripe.com)
2. Vá para **Products** → **Add Product**
3. Crie 3 produtos com preços recorrentes mensais:

#### Plano Básico
- **Nome**: Ktirio AI - Plano Básico
- **Preço**: R$ 29,90/mês
- **Descrição**: 100 créditos mensais
- **Billing**: Recorrente mensal
- Copie o **Price ID** (ex: `price_1ABC123...`)

#### Plano Pro
- **Nome**: Ktirio AI - Plano Profissional
- **Preço**: R$ 99,90/mês
- **Descrição**: 500 créditos mensais
- **Billing**: Recorrente mensal
- Copie o **Price ID** (ex: `price_1XYZ456...`)

#### Plano Enterprise
- **Nome**: Ktirio AI - Plano Empresarial
- **Preço**: R$ 299,90/mês
- **Descrição**: Créditos ilimitados
- **Billing**: Recorrente mensal
- Copie o **Price ID** (ex: `price_1DEF789...`)

### Passo 2: Obter as Chaves de API

1. Vá para **Developers** → **API keys**
2. Copie:
   - **Publishable key** (pk_test_... ou pk_live_...)
   - **Secret key** (sk_test_... ou sk_live_...)

⚠️ **IMPORTANTE**: Use chaves de TEST durante desenvolvimento!

### Passo 3: Configurar Webhook Endpoint (será feito após deploy)

Por enquanto, apenas anote que precisaremos configurar o webhook após o deploy das Functions.

---

## 🔥 Configuração do Firebase

### Passo 1: Login no Firebase CLI

```bash
firebase login
```

### Passo 2: Inicializar Firebase no Projeto

Se ainda não foi feito:

```bash
cd Ktirio-AI
firebase init
```

Selecione:
- ✅ Functions
- ✅ Firestore
- ✅ Hosting (opcional)

Escolha:
- Linguagem: **TypeScript**
- ESLint: **Sim**
- Instalar dependências: **Sim**

### Passo 3: Atualizar Price IDs nos Arquivos

Edite `services/stripeService.ts` e substitua os placeholders pelos Price IDs reais:

```typescript
[PricingPlan.BASIC]: {
  name: 'Básico',
  credits: 100,
  price: 29.90,
  priceId: 'price_1ABC123...', // ⬅️ Seu Price ID real aqui
  // ...
},
[PricingPlan.PRO]: {
  name: 'Profissional',
  credits: 500,
  price: 99.90,
  priceId: 'price_1XYZ456...', // ⬅️ Seu Price ID real aqui
  // ...
},
[PricingPlan.ENTERPRISE]: {
  name: 'Empresarial',
  credits: -1,
  price: 299.90,
  priceId: 'price_1DEF789...', // ⬅️ Seu Price ID real aqui
  // ...
},
```

Edite `functions/src/index.ts` e atualize a função `getPlanFromPriceId`:

```typescript
function getPlanFromPriceId(priceId: string): { plan: string; credits: number } | null {
  const priceMapping: Record<string, { plan: string; credits: number }> = {
    'price_1ABC123...': { plan: 'basic', credits: 100 },
    'price_1XYZ456...': { plan: 'pro', credits: 500 },
    'price_1DEF789...': { plan: 'enterprise', credits: -1 },
  };

  return priceMapping[priceId] || null;
}
```

### Passo 4: Configurar Variáveis de Ambiente do Firebase Functions

Configure as variáveis de ambiente secretas usando o Firebase CLI:

```bash
# Stripe Secret Key
firebase functions:secrets:set STRIPE_SECRET_KEY
# Cole sua chave secreta quando solicitado: sk_test_...

# Stripe Webhook Secret (configurar após criar webhook)
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
# Cole o webhook signing secret: whsec_...
```

Para listar as secrets configuradas:
```bash
firebase functions:secrets:access
```

---

## 🛠️ Desenvolvimento Local

### Passo 1: Criar Arquivo .env Local para Functions

Crie `functions/.env.local` (NÃO commitar no Git!):

```env
STRIPE_SECRET_KEY=sk_test_seu_secret_key_aqui
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret_aqui
```

### Passo 2: Atualizar .env.local Principal

Adicione ao `.env.local` na raiz do projeto:

```env
# ... outras variáveis existentes ...

# Firebase Functions URL (local)
VITE_FIREBASE_FUNCTIONS_URL=http://localhost:5001/ktirio-ai-4540c/us-central1
```

Substitua `ktirio-ai-4540c` pelo ID do seu projeto Firebase.

### Passo 3: Iniciar Emuladores do Firebase

Em um terminal:

```bash
cd Ktirio-AI/functions
npm run serve
```

Isso iniciará:
- Functions emulator em `http://localhost:5001`
- Firestore emulator (se configurado)

### Passo 4: Iniciar Dev Server do Frontend

Em outro terminal:

```bash
cd Ktirio-AI
npm run dev
```

### Passo 5: Testar Localmente com Stripe CLI

Instale o [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
brew install stripe/stripe-cli/stripe
```

Login:
```bash
stripe login
```

Encaminhar webhooks para seu emulator local:
```bash
stripe listen --forward-to http://localhost:5001/ktirio-ai-4540c/us-central1/stripeWebhook
```

Isso retornará um webhook signing secret. Use-o no `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_... # do output do stripe listen
```

---

## 🚀 Deploy para Produção

### Passo 1: Build do TypeScript

```bash
cd Ktirio-AI/functions
npm run build
```

### Passo 2: Deploy das Functions

```bash
firebase deploy --only functions
```

Anote as URLs das functions deployadas, exemplo:
```
✔  functions[createCheckoutSession(us-central1)]: https://us-central1-ktirio-ai-4540c.cloudfunctions.net/createCheckoutSession
✔  functions[stripeWebhook(us-central1)]: https://us-central1-ktirio-ai-4540c.cloudfunctions.net/stripeWebhook
✔  functions[cancelSubscription(us-central1)]: https://us-central1-ktirio-ai-4540c.cloudfunctions.net/cancelSubscription
✔  functions[createPortalSession(us-central1)]: https://us-central1-ktirio-ai-4540c.cloudfunctions.net/createPortalSession
```

### Passo 3: Configurar Webhook no Stripe Dashboard

1. Vá para **Developers** → **Webhooks**
2. Clique em **Add endpoint**
3. URL do endpoint:
   ```
   https://us-central1-seu-projeto.cloudfunctions.net/stripeWebhook
   ```
4. Selecione os eventos:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
5. Clique em **Add endpoint**
6. Copie o **Signing secret** (whsec_...)
7. Configure no Firebase:
   ```bash
   firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
   # Cole o signing secret
   ```
8. Re-deploy:
   ```bash
   firebase deploy --only functions
   ```

### Passo 4: Atualizar .env.local para Produção

Atualize `VITE_FIREBASE_FUNCTIONS_URL` para a URL de produção:

```env
VITE_FIREBASE_FUNCTIONS_URL=https://us-central1-ktirio-ai-4540c.cloudfunctions.net
```

Ou remova essa variável para usar a URL de produção por padrão.

### Passo 5: Deploy do Frontend

```bash
cd Ktirio-AI
npm run build
firebase deploy --only hosting
```

---

## ✅ Testes

### Checklist de Testes em Desenvolvimento

- [ ] Carregar página de pricing
- [ ] Clicar em "Assinar Agora" para plano Basic
- [ ] Verificar redirecionamento para Stripe Checkout
- [ ] Completar checkout com cartão de teste: `4242 4242 4242 4242`
- [ ] Verificar redirecionamento para `/success`
- [ ] Verificar atualização de créditos no Firestore
- [ ] Verificar atualização do plano no UI
- [ ] Testar cancelamento de assinatura
- [ ] Testar acesso ao Customer Portal

### Cartões de Teste do Stripe

```
Sucesso: 4242 4242 4242 4242
Falha:   4000 0000 0000 0002
3D Sec:  4000 0025 0000 3155

Qualquer data futura (ex: 12/34)
Qualquer CVV (ex: 123)
Qualquer CEP (ex: 12345)
```

### Verificar Logs das Functions

```bash
firebase functions:log
```

Ou no Firebase Console → Functions → Logs

---

## 🐛 Troubleshooting

### Erro: "Missing Stripe Secret Key"

**Solução**: Configure a variável de ambiente:
```bash
firebase functions:secrets:set STRIPE_SECRET_KEY
```

### Erro: "Webhook signature verification failed"

**Solução**:
1. Verifique se o `STRIPE_WEBHOOK_SECRET` está correto
2. Use o Stripe CLI para testar localmente
3. Verifique se o endpoint do webhook está correto no Stripe Dashboard

### Erro: "CORS policy blocked"

**Solução**: As functions já têm CORS habilitado. Verifique se está fazendo requisição do domínio correto.

### Erro: "User document not found"

**Solução**: O CreditsContext deve criar o documento automaticamente. Verifique se o usuário está autenticado com Clerk.

### Functions não estão atualizando

**Solução**:
```bash
cd functions
npm run build
firebase deploy --only functions --force
```

### Teste de Webhook Local não funciona

**Solução**:
```bash
# Terminal 1: Emulator
cd functions && npm run serve

# Terminal 2: Stripe CLI
stripe listen --forward-to http://localhost:5001/PROJECT_ID/us-central1/stripeWebhook

# Terminal 3: Trigger evento de teste
stripe trigger checkout.session.completed
```

---

## 📊 Arquitetura do Fluxo

```
User clica "Assinar"
    ↓
PricingPage.tsx
    ↓
redirectToCheckout() (stripeService.ts)
    ↓
createCheckoutSession() → Firebase Function
    ↓
Stripe Checkout Session criada
    ↓
User redireciona para Stripe Checkout
    ↓
User completa pagamento
    ↓
Stripe envia webhook → stripeWebhook Firebase Function
    ↓
handleCheckoutSessionCompleted()
    ↓
updateUserSubscription()
    ↓
Firestore atualizado (plan, credits, subscriptionId)
    ↓
CreditsContext detecta mudança (onSnapshot)
    ↓
UI atualizada automaticamente
```

---

## 📚 Recursos Adicionais

- [Stripe Documentation](https://stripe.com/docs)
- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)

---

## 🔐 Segurança

- ✅ Nunca exponha Secret Keys no frontend
- ✅ Use environment variables para chaves sensíveis
- ✅ Valide webhooks usando signing secrets
- ✅ Sempre use HTTPS em produção
- ✅ Configure regras de segurança do Firestore adequadamente
- ✅ Adicione `.env` e `.env.local` ao `.gitignore`

---

## ✨ Próximos Passos

Após configurar completamente:

1. Criar página de sucesso (`/success`)
2. Criar página de perfil com gerenciamento de assinatura
3. Implementar página de histórico de créditos
4. Adicionar notificações de pagamento
5. Implementar limites de rate limiting nas Functions
6. Adicionar analytics e monitoramento
7. Configurar alertas para falhas de pagamento

---

**Última atualização**: 2025-01-01
**Versão**: 1.0.0
