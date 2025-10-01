# 🔥 Guia de Configuração do Firebase - Ktirio AI

## ✅ Etapas Concluídas

### 1. Dependências Instaladas
- Firebase SDK instalado: `firebase@^12.3.0`
- Todos os serviços de autenticação e Firestore criados

### 2. Arquivos de Configuração do Firebase Criados
- `/src/services/firebase.js` - Inicialização do Firebase
- `/src/services/authService.js` - Métodos de autenticação
- `/src/services/projectsService.js` - Operações CRUD do Firestore
- `/src/stores/auth.js` - Pinia auth store
- `/src/components/AuthModal.vue` - Modal de Login/Cadastro
- `/src/components/UserProfile.vue` - Dropdown de perfil do usuário

### 3. Integração Concluída
- App.vue atualizado com inicialização da autenticação do Firebase
- Gallery.vue migrado do Clerk para Firebase
- Store de projetos atualizada com sincronização do Firebase

## 🚀 Próximos Passos (Você Precisa Fazer)

### Passo 1: Criar Projeto no Firebase
1. Acesse https://console.firebase.google.com/
2. Clique em "Criar um projeto"
3. Digite o nome do projeto: "ktirio-ai"
4. Desative o Google Analytics (opcional)
5. Clique em "Criar projeto"

### Passo 2: Habilitar Autenticação
1. No console do Firebase, clique em "Authentication" → "Começar"
2. Vá para a aba "Método de login"
3. Habilite o provedor **E-mail/senha**
4. Habilite o provedor **Anônimo** (para acesso de convidado)

### Passo 3: Criar Banco de Dados Firestore
1. Clique em "Firestore Database" → "Criar banco de dados"
2. Escolha **"Iniciar no modo de teste"**
3. Selecione a região mais próxima
4. Clique em "Concluído"

### Passo 4: Obter Configuração do Firebase
1. Clique no ícone de engrenagem → "Configurações do projeto"
2. Role até "Seus apps" → Clique no ícone web (</>)
3. Digite o nome do app: "ktirio-ai-web"
4. Não marque Firebase Hosting
5. Clique em "Registrar app"
6. **Copie o objeto de configuração**

### Passo 5: Adicionar Configuração ao Ambiente
Substitua os valores de exemplo em `.env.local` com sua configuração real do Firebase:

```env
# Configuração do Firebase
VITE_FIREBASE_API_KEY=sua-api-key-real
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-id-do-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=seu-app-id-real
```

## 🎯 Testando a Integração

Após completar a configuração:

1. **Inicie o servidor de desenvolvimento**: `npm run dev`
2. **Teste a autenticação**:
   - Tente criar uma nova conta
   - Teste o login com uma conta existente
   - Teste o acesso anônimo/convidado
3. **Teste o gerenciamento de projetos**:
   - Crie um novo projeto
   - Faça upload de uma imagem
   - Gere imagens com IA
   - Teste o histórico de projetos
4. **Teste a persistência**:
   - Crie projetos como usuário logado
   - Faça logout e login novamente
   - Verifique se os projetos foram salvos

## 🛡️ Regras de Segurança (Opcional)

Posteriormente, você pode proteger seu Firestore com estas regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários só podem acessar seus próprios projetos
    match /projects/{projectId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 🔄 Como Funciona

### Fluxo de Autenticação
1. **Usuários Anônimos**: Podem usar o app com armazenamento local
2. **Usuários Registrados**: Projetos sincronizam automaticamente com o Firestore
3. **Migração Transparente**: Projetos locais podem ser atualizados quando o usuário cria uma conta

### Sincronização de Projetos
- **Criar**: Novos projetos salvam automaticamente no Firestore
- **Atualizar**: Mudanças sincronizam em tempo real
- **Deletar**: Removido tanto do estado local quanto do Firestore
- **Offline**: Volta ao armazenamento local se o Firebase falhar

### Recursos
- **Cadastro e Login com E-mail/Senha**
- **Acesso Anônimo/Convidado**
- **Gerenciamento de Perfil de Usuário**
- **Sincronização Automática de Projetos**
- **Fallback Offline**
- **Segurança e Tratamento de Erros**

## 🎉 Benefícios

✅ **Projetos específicos do usuário** - Cada usuário tem seus próprios projetos
✅ **Sincronização entre dispositivos** - Acesse projetos de qualquer dispositivo
✅ **Acesso de convidado** - Não é necessário cadastro para testar o app
✅ **Persistência de dados** - Projetos nunca são perdidos
✅ **Escalável** - Firebase suporta milhões de usuários
✅ **Seguro** - Dados do usuário são protegidos

---

**Próximo passo**: Complete a configuração no console do Firebase e adicione sua configuração ao `.env.local`!