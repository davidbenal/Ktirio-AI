# 🎯 Próximos Passos - Ktírio AI

## 📍 Situação Atual

✅ **Concluído:**
- Repositório clonado
- Dependências instaladas (Firebase + Stripe)
- Estrutura de serviços criada
- Documentação completa

⏳ **Em Andamento:**
- Configuração das integrações

---

## 🚀 O que fazer AGORA (em ordem)

### 1️⃣ Configurar Variáveis de Ambiente (5 minutos)

```bash
# 1. Copie o arquivo de exemplo
cp .env.example .env.local

# 2. Edite o arquivo
nano .env.local  # ou use seu editor favorito
```

**Você já tem?**
- ✅ Gemini API Key (parece que sim, no .env.local existente)
- ❓ Clerk Publishable Key → [Criar conta](https://clerk.com)
- ❓ Firebase Config → [Criar projeto](https://console.firebase.google.com)
- ❓ Stripe Publishable Key → [Criar conta](https://stripe.com)

---

### 2️⃣ Configurar Clerk (15 minutos)

**Acesse:** https://clerk.com

1. **Criar conta** e nova aplicação
2. **Copiar** Publishable Key
3. **Configurar** URLs:
   - Home URL: `http://localhost:5173`
   - Sign-in: `/sign-in`
   - Sign-up: `/sign-up`
   - After sign-in: `/editor`

4. **Adicionar ao .env.local:**
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_seu_key_aqui
```

5. **Testar:** Execute `npm run dev` e teste o login

📖 **Guia completo:** [SETUP_GUIDE.md - Seção Clerk](./SETUP_GUIDE.md#1-configuração-do-clerk)

---

### 3️⃣ Configurar Firebase (20 minutos)

**Acesse:** https://console.firebase.google.com

1. **Criar projeto** "ktirio-ai"
2. **Ativar Firestore:**
   - Modo: Produção
   - Localização: southamerica-east1 (São Paulo)
3. **Ativar Storage:**
   - Mesma localização
4. **Configurar regras** (copie do SETUP_GUIDE.md)
5. **Copiar credenciais** da Web App
6. **Adicionar ao .env.local**

📖 **Guia completo:** [SETUP_GUIDE.md - Seção Firebase](./SETUP_GUIDE.md#2-configuração-do-firebase)

---

### 4️⃣ Configurar Stripe (20 minutos)

**Acesse:** https://stripe.com

1. **Criar conta** e ativar modo teste
2. **Copiar** Publishable Key (pk_test_...)
3. **Criar produtos:**
   - Plano Básico: R$ 29,90/mês
   - Plano Pro: R$ 99,90/mês
   - Plano Enterprise: R$ 299,90/mês
4. **Copiar** Price IDs de cada produto
5. **Atualizar** `services/stripeService.ts` com os Price IDs
6. **Adicionar** ao .env.local

📖 **Guia completo:** [SETUP_GUIDE.md - Seção Stripe](./SETUP_GUIDE.md#3-configuração-do-stripe)

---

### 5️⃣ Integrar Clerk no App (10 minutos)

Edite `index.tsx`:

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <App />
    </ClerkProvider>
  </StrictMode>
);
```

---

### 6️⃣ Adicionar CreditsProvider (5 minutos)

Edite `App.tsx`:

```typescript
import React from 'react';
import { CreditsProvider } from './contexts/CreditsContext';
import AppRouter from './components/AppRouter';

const App: React.FC = () => {
  return (
    <CreditsProvider>
      <div className="min-h-screen bg-[#F7F7F8] font-sans text-gray-800">
        <AppRouter />
      </div>
    </CreditsProvider>
  );
};

export default App;
```

---

### 7️⃣ Atualizar Componentes de Auth (15 minutos)

Edite `components/SignInPage.tsx`:

```typescript
import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const SignInPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SignIn 
        routing="path" 
        path="/sign-in"
        signUpUrl="/sign-up"
      />
    </div>
  );
};

export default SignInPage;
```

Faça o mesmo para `SignUpPage.tsx`.

---

### 8️⃣ Testar (10 minutos)

```bash
# Execute o projeto
npm run dev

# Acesse no navegador
http://localhost:5173

# Teste:
# 1. Criar nova conta
# 2. Fazer login
# 3. Acessar editor
# 4. Fazer logout
```

---

## 📅 Cronograma Sugerido

### **Dia 1** (Hoje) - Setup Básico
- ✅ Passos 1-4: Configurar contas e credenciais (1 hora)
- ✅ Passos 5-8: Integrar e testar (40 minutos)

### **Dia 2** - Integração Firebase
- Migrar ProjectsContext para Firebase
- Migrar FoldersContext para Firebase
- Testar CRUD de projetos

### **Dia 3** - Upload de Imagens
- Integrar Firebase Storage no Editor
- Implementar upload de imagens
- Testar salvamento de projetos

### **Dia 4** - Sistema de Créditos
- Adicionar display de créditos no header
- Implementar verificação antes de operações
- Criar modal de créditos insuficientes

### **Dia 5** - Backend Stripe
- Criar endpoints de checkout
- Configurar webhooks
- Testar fluxo de pagamento

---

## 🆘 Se Precisar de Ajuda

### Erro comum 1: "Clerk: Invalid publishable key"
**Solução:** 
- Verifique se a chave está correta no .env.local
- Reinicie o servidor (Ctrl+C e npm run dev novamente)

### Erro comum 2: "Firebase: Error (auth/operation-not-allowed)"
**Solução:**
- Vá em Firebase Console > Authentication
- Ative o provedor de Email/Senha

### Erro comum 3: "Module not found"
**Solução:**
- Delete node_modules e package-lock.json
- Execute `npm install` novamente

---

## 📞 Próximos Comandos

```bash
# Ver todos os arquivos criados
ls -la

# Ver estrutura do projeto
tree -L 2 -I 'node_modules'

# Verificar se o projeto compila
npm run build

# Executar em modo desenvolvimento
npm run dev
```

---

## ✅ Checklist Rápido

Antes de começar a codificar, certifique-se de ter:

- [ ] Node.js 20+ instalado
- [ ] Conta no Clerk criada
- [ ] Conta no Firebase criada
- [ ] Conta no Stripe criada (modo teste)
- [ ] Todas as chaves API copiadas
- [ ] Arquivo .env.local configurado
- [ ] npm install executado sem erros

---

**Está pronto?** Execute `npm run dev` e comece a desenvolver! 🚀

**Tem dúvidas?** Consulte o [SETUP_GUIDE.md](./SETUP_GUIDE.md) ou o [CHECKLIST.md](./CHECKLIST.md).
