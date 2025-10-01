# ✅ Checklist de Implementação - Ktírio AI

Use este checklist para acompanhar o progresso da implementação das integrações.

---

## 📦 Fase 1: Setup Inicial

- [x] Clonar repositório
- [x] Instalar dependências base
- [x] Instalar Firebase SDK
- [x] Instalar Stripe.js
- [x] Configurar Vite com plugin React
- [x] Criar estrutura de pastas (`config/`, `services/`)

---

## 🔐 Fase 2: Integração Clerk

### Configuração Básica
- [ ] Criar conta no Clerk
- [ ] Criar nova aplicação
- [ ] Copiar Publishable Key
- [ ] Adicionar `VITE_CLERK_PUBLISHABLE_KEY` no .env.local

### Integração no Código
- [ ] Adicionar `ClerkProvider` no App.tsx
- [ ] Testar página de login
- [ ] Testar página de registro
- [ ] Configurar rotas protegidas
- [ ] Testar logout

### Páginas Necessárias
- [ ] Atualizar SignInPage.tsx com componentes Clerk
- [ ] Atualizar SignUpPage.tsx com componentes Clerk
- [ ] Criar página de perfil do usuário
- [ ] Adicionar botão de logout no header

---

## 🔥 Fase 3: Integração Firebase

### Configuração Firebase Console
- [ ] Criar projeto no Firebase
- [ ] Ativar Firestore Database
- [ ] Configurar regras do Firestore (ver SETUP_GUIDE.md)
- [ ] Ativar Storage
- [ ] Configurar regras do Storage (ver SETUP_GUIDE.md)
- [ ] Copiar credenciais do Firebase Config
- [ ] Adicionar variáveis do Firebase no .env.local

### Implementação no Código
- [x] Criar `config/firebase.ts`
- [x] Criar `services/firebaseService.ts`
- [ ] Testar conexão com Firestore
- [ ] Testar upload de imagem no Storage

### Migração de Dados
- [ ] Atualizar `ProjectsContext.tsx` para usar Firebase
  - [ ] Substituir mock data por `getUserProjects()`
  - [ ] Implementar `createProject()` com Firebase
  - [ ] Implementar `updateProject()` com Firebase
  - [ ] Implementar `deleteProject()` com Firebase
  
- [ ] Atualizar `FoldersContext.tsx` para usar Firebase
  - [ ] Substituir mock data por `getUserFolders()`
  - [ ] Implementar `createFolder()` com Firebase
  - [ ] Implementar `updateFolder()` com Firebase
  - [ ] Implementar `deleteFolder()` com Firebase

### Upload de Imagens
- [ ] Integrar `uploadImage()` no Editor
- [ ] Salvar URLs das imagens no Firestore
- [ ] Implementar preview de imagens do Storage
- [ ] Adicionar loading states durante upload

---

## 💳 Fase 4: Integração Stripe

### Configuração Stripe Dashboard
- [ ] Criar conta no Stripe
- [ ] Copiar Publishable Key (pk_test_...)
- [ ] Copiar Secret Key (sk_test_...) - guardar com segurança
- [ ] Adicionar `VITE_STRIPE_PUBLISHABLE_KEY` no .env.local

### Criar Produtos e Preços
- [ ] Criar produto "Plano Básico" (R$ 29,90/mês)
  - [ ] Copiar Price ID
  - [ ] Atualizar em `services/stripeService.ts`
  
- [ ] Criar produto "Plano Profissional" (R$ 99,90/mês)
  - [ ] Copiar Price ID
  - [ ] Atualizar em `services/stripeService.ts`
  
- [ ] Criar produto "Plano Empresarial" (R$ 299,90/mês)
  - [ ] Copiar Price ID
  - [ ] Atualizar em `services/stripeService.ts`

### Implementação Frontend
- [x] Criar `services/stripeService.ts`
- [x] Criar `contexts/CreditsContext.tsx`
- [x] Criar `components/PricingPage.tsx`
- [ ] Adicionar `CreditsProvider` no App.tsx
- [ ] Adicionar rota `/pricing` no router
- [ ] Criar componente de exibição de créditos no Header
- [ ] Implementar verificação de créditos antes de operações de IA

### Implementação Backend
- [ ] Escolher plataforma (Vercel Functions / Firebase Functions / Express)
- [ ] Criar endpoint `POST /api/create-checkout-session`
  - [ ] Receber priceId, userId, userEmail
  - [ ] Criar sessão de checkout no Stripe
  - [ ] Retornar sessionId
  
- [ ] Criar endpoint `POST /api/stripe-webhook`
  - [ ] Verificar assinatura do webhook
  - [ ] Processar evento `checkout.session.completed`
  - [ ] Processar evento `customer.subscription.created`
  - [ ] Processar evento `customer.subscription.updated`
  - [ ] Processar evento `customer.subscription.deleted`
  - [ ] Processar evento `invoice.payment_succeeded`
  - [ ] Processar evento `invoice.payment_failed`
  - [ ] Atualizar créditos do usuário no Firestore

### Configurar Webhooks
- [ ] Adicionar endpoint de webhook no Stripe Dashboard
- [ ] Copiar Webhook Signing Secret
- [ ] Testar webhook com Stripe CLI
- [ ] Deploy do webhook para produção

---

## 🎨 Fase 5: UI/UX Melhorias

### Header/Navbar
- [ ] Adicionar display de créditos atuais
- [ ] Adicionar botão para página de pricing
- [ ] Adicionar menu de perfil do usuário
- [ ] Adicionar indicador de plano atual

### Editor
- [ ] Adicionar verificação de créditos antes de gerar
- [ ] Mostrar custo em créditos de cada operação
- [ ] Adicionar modal de "créditos insuficientes"
- [ ] Adicionar link para página de pricing no modal

### Páginas Auxiliares
- [ ] Criar página de "Créditos Insuficientes"
- [ ] Criar página de "Sucesso no Pagamento"
- [ ] Criar página de "Erro no Pagamento"
- [ ] Criar página de configurações da conta

---

## 🧪 Fase 6: Testes

### Testes de Autenticação
- [ ] Testar registro de novo usuário
- [ ] Testar login com email/senha
- [ ] Testar login com Google OAuth
- [ ] Testar logout
- [ ] Testar acesso a rotas protegidas sem login

### Testes de Projetos
- [ ] Criar novo projeto
- [ ] Editar projeto existente
- [ ] Deletar projeto
- [ ] Mover projeto para pasta
- [ ] Favoritar/desfavoritar projeto
- [ ] Arquivar/desarquivar projeto

### Testes de Upload
- [ ] Upload de imagem pequena (<1MB)
- [ ] Upload de imagem grande (>5MB)
- [ ] Upload de formato PNG
- [ ] Upload de formato JPG
- [ ] Testar erro de formato inválido

### Testes de Créditos
- [ ] Criar novo usuário (deve ter 10 créditos)
- [ ] Executar operação de IA (deve descontar créditos)
- [ ] Tentar executar sem créditos (deve bloquear)
- [ ] Assinar plano (deve adicionar créditos)

### Testes de Pagamento
- [ ] Testar checkout com cartão de teste do Stripe
- [ ] Verificar se créditos foram adicionados após pagamento
- [ ] Testar cancelamento de assinatura
- [ ] Testar reativação de assinatura
- [ ] Testar webhook de pagamento falho

---

## 🚀 Fase 7: Deploy

### Preparação
- [ ] Criar .env.production com variáveis de produção
- [ ] Atualizar URLs do Clerk para domínio de produção
- [ ] Atualizar regras do Firebase para produção
- [ ] Configurar CORS no Firebase
- [ ] Ativar modo produção do Stripe

### Deploy Frontend
- [ ] Escolher plataforma (Vercel / Netlify / Firebase Hosting)
- [ ] Configurar variáveis de ambiente
- [ ] Build de produção (`npm run build`)
- [ ] Deploy
- [ ] Testar em produção

### Deploy Backend
- [ ] Deploy dos endpoints de API
- [ ] Configurar variáveis de ambiente (incluindo Stripe Secret Key)
- [ ] Atualizar URL do webhook no Stripe
- [ ] Testar webhooks em produção

### DNS e Domínio
- [ ] Registrar domínio personalizado
- [ ] Configurar DNS
- [ ] Configurar SSL/HTTPS
- [ ] Testar acesso pelo domínio

---

## 📊 Fase 8: Monitoramento

- [ ] Configurar Firebase Analytics
- [ ] Configurar Stripe Dashboard alerts
- [ ] Configurar logs de erro (Sentry/LogRocket)
- [ ] Criar dashboard de métricas
- [ ] Configurar backup do Firestore

---

## 📚 Fase 9: Documentação

- [ ] Atualizar README.md com instruções de uso
- [ ] Criar documentação da API (se aplicável)
- [ ] Criar guia do usuário
- [ ] Criar vídeo tutorial
- [ ] Documentar processo de deploy

---

## 💡 Melhorias Futuras (Opcional)

- [ ] Implementar sistema de convite/referral
- [ ] Adicionar histórico de transações
- [ ] Implementar compartilhamento de projetos
- [ ] Adicionar templates pré-configurados
- [ ] Criar API pública
- [ ] Adicionar suporte a múltiplos idiomas (i18n)
- [ ] Implementar modo dark
- [ ] Adicionar notificações push
- [ ] Criar aplicativo móvel (React Native)

---

## 🎯 Progresso Geral

**Fase 1**: ✅ 100% (6/6)
**Fase 2**: ⏳ 0% (0/13)
**Fase 3**: ⏳ 20% (2/10 + 0/14)
**Fase 4**: ⏳ 23% (3/13 + 0/9 + 0/4)
**Fase 5**: ⏳ 0% (0/15)
**Fase 6**: ⏳ 0% (0/21)
**Fase 7**: ⏳ 0% (0/14)
**Fase 8**: ⏳ 0% (0/5)
**Fase 9**: ⏳ 0% (0/5)

**TOTAL GERAL**: ~8% concluído

---

## 📝 Notas

- Priorize as Fases 2, 3 e 4 - são as mais críticas
- Teste cada funcionalidade antes de passar para a próxima
- Use o modo de teste do Stripe para desenvolvimento
- Faça commits frequentes no Git
- Documente decisões importantes

---

**Última atualização**: 2025-09-30
