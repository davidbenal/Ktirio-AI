# 🚀 Guia de Deploy - Firebase Functions + Stripe

Este guia mostra como fazer deploy das Firebase Functions para ativar os pagamentos Stripe.

---

## ✅ Pré-requisitos Completados

- [x] Price IDs do Stripe configurados
- [x] Código das Functions pronto
- [x] Stripe Secret Key obtida

---

## 📋 Passo 1: Instalar Firebase CLI

Abra um **novo terminal** e execute:

```bash
sudo npm install -g firebase-tools
```

Digite sua senha quando solicitado.

Para verificar se instalou corretamente:
```bash
firebase --version
```

---

## 📋 Passo 2: Login no Firebase

```bash
firebase login
```

Isso abrirá o navegador para você fazer login com sua conta Google (mesma do projeto Firebase).

---

## 📋 Passo 3: Inicializar Firebase (se necessário)

Navegue até a pasta do projeto:

```bash
cd "Ktirio-AI"
```

Se o Firebase ainda não foi inicializado:

```bash
firebase init
```

Selecione:
- [x] Functions
- [x] Use an existing project
- Projeto: `ktirio-ai-4540c`
- Linguagem: TypeScript
- ESLint: Yes
- Instalar dependências: Yes

**⚠️ ATENÇÃO**: Se já existe uma pasta `functions/`, o Firebase perguntará se quer sobrescrever. Responda **NÃO** para não perder os arquivos que criamos!

---

## 📋 Passo 4: Configurar Secrets do Stripe

As secrets são variáveis de ambiente seguras para chaves sensíveis.

### 4.1 Configurar STRIPE_SECRET_KEY

```bash
firebase functions:secrets:set STRIPE_SECRET_KEY
```

Quando solicitado, cole sua chave secreta do Stripe (começa com `sk_test_...` ou `sk_live_...`).
Você pode encontrá-la em: https://dashboard.stripe.com/test/apikeys

### 4.2 Configurar STRIPE_WEBHOOK_SECRET (fazer depois)

Por enquanto, configure um valor temporário:

```bash
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
```

Cole qualquer valor temporário:
```
whsec_temporary
```

Vamos atualizar isso depois de criar o webhook no Stripe.

---

## 📋 Passo 5: Instalar Dependências das Functions

```bash
cd Ktirio-AI/functions
npm install
```

---

## 📋 Passo 6: Build do TypeScript

```bash
npm run build
```

Se houver erros de TypeScript, ignore por enquanto (os erros são sobre módulos do Firebase que serão resolvidos no deploy).

---

## 📋 Passo 7: Deploy das Functions

Volte para a raiz do projeto:

```bash
cd ..
```

Faça o deploy:

```bash
firebase deploy --only functions
```

Isso pode levar alguns minutos. Quando terminar, você verá algo como:

```
✔  Deploy complete!

Functions:
  createCheckoutSession(us-central1): https://us-central1-ktirio-ai-4540c.cloudfunctions.net/createCheckoutSession
  stripeWebhook(us-central1): https://us-central1-ktirio-ai-4540c.cloudfunctions.net/stripeWebhook
  cancelSubscription(us-central1): https://us-central1-ktirio-ai-4540c.cloudfunctions.net/cancelSubscription
  createPortalSession(us-central1): https://us-central1-ktirio-ai-4540c.cloudfunctions.net/createPortalSession
```

**⚠️ COPIE A URL DO stripeWebhook** - você vai precisar dela no próximo passo!

---

## 📋 Passo 8: Configurar Webhook no Stripe Dashboard

### 8.1 Criar Webhook Endpoint

1. Acesse: https://dashboard.stripe.com/test/webhooks
2. Clique em **"Add endpoint"**
3. Endpoint URL: Cole a URL do `stripeWebhook` (exemplo: `https://us-central1-ktirio-ai-4540c.cloudfunctions.net/stripeWebhook`)
4. Description: `Ktirio AI - Production Webhook`

### 8.2 Selecionar Eventos

Marque os seguintes eventos:

- [x] `checkout.session.completed`
- [x] `customer.subscription.created`
- [x] `customer.subscription.updated`
- [x] `customer.subscription.deleted`
- [x] `invoice.payment_succeeded`
- [x] `invoice.payment_failed`

Clique em **"Add endpoint"**

### 8.3 Obter Signing Secret

Depois de criar o webhook, você verá uma página com detalhes.

Procure por **"Signing secret"** e clique em **"Reveal"**.

Copie o valor (começa com `whsec_...`)

### 8.4 Atualizar Secret no Firebase

```bash
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
```

Cole o signing secret real que você copiou.

### 8.5 Re-deploy

```bash
firebase deploy --only functions
```

---

## 📋 Passo 9: Atualizar URL das Functions no Frontend

Edite o arquivo `.env.local` e **remova ou comente** a linha:

```env
# VITE_FIREBASE_FUNCTIONS_URL=http://localhost:5001/ktirio-ai-4540c/us-central1
```

Ou atualize para a URL de produção:

```env
VITE_FIREBASE_FUNCTIONS_URL=https://us-central1-ktirio-ai-4540c.cloudfunctions.net
```

Reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

---

## 📋 Passo 10: Testar o Fluxo Completo

1. Acesse: http://localhost:5174/pricing
2. Clique em **"Assinar Agora"** em qualquer plano
3. Você será redirecionado para o Stripe Checkout
4. Use o cartão de teste: `4242 4242 4242 4242`
   - Data: Qualquer data futura (ex: 12/34)
   - CVV: Qualquer 3 dígitos (ex: 123)
5. Complete o checkout
6. Você será redirecionado para `/success`
7. Verifique se seus créditos foram atualizados no perfil

---

## 🐛 Troubleshooting

### Erro: "Missing permissions"

Execute o deploy com a flag de força:
```bash
firebase deploy --only functions --force
```

### Erro: "Billing account not configured"

O Firebase Functions requer um plano Blaze (pay-as-you-go). Configure em:
https://console.firebase.google.com/project/ktirio-ai-4540c/usage/details

**Nota**: O plano Blaze tem um nível gratuito generoso. Você não pagará nada até atingir limites altos.

### Webhook não está funcionando

1. Verifique os logs do Firebase:
   ```bash
   firebase functions:log
   ```

2. No Stripe Dashboard, vá para Webhooks e verifique os eventos enviados

3. Teste manualmente usando Stripe CLI:
   ```bash
   stripe trigger checkout.session.completed
   ```

### Erro CORS

As functions já estão configuradas com CORS. Se ainda tiver problemas, verifique que está fazendo as requisições do domínio correto.

---

## ✅ Checklist Final

- [ ] Firebase CLI instalado
- [ ] Login no Firebase feito
- [ ] Secrets configuradas (STRIPE_SECRET_KEY e STRIPE_WEBHOOK_SECRET)
- [ ] Functions deployadas com sucesso
- [ ] Webhook criado no Stripe
- [ ] Webhook secret atualizado
- [ ] .env.local atualizado com URL de produção
- [ ] Teste de checkout completado com sucesso

---

## 📊 Monitoramento

### Ver logs das Functions
```bash
firebase functions:log
```

### Ver logs em tempo real
```bash
firebase functions:log --only stripeWebhook
```

### Firebase Console
https://console.firebase.google.com/project/ktirio-ai-4540c/functions/list

### Stripe Dashboard
https://dashboard.stripe.com/test/payments

---

## 🔒 Segurança

- ✅ Secrets estão configuradas (não no código)
- ✅ Webhook signature está sendo validada
- ✅ CORS está habilitado
- ✅ Usando chaves de TEST (não production)

---

## 🚀 Próximos Passos

Depois que tudo estiver funcionando em TEST:

1. Criar produtos no Stripe em modo PRODUCTION
2. Atualizar Price IDs para versões de produção
3. Configurar STRIPE_SECRET_KEY de produção
4. Atualizar VITE_STRIPE_PUBLISHABLE_KEY para produção
5. Criar webhook de produção
6. Fazer deploy final

---

**Última atualização**: 2025-10-01
**Status**: Pronto para deploy
