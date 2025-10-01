<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🏠 Ktírio AI - Virtual Home Staging

**Ktírio AI** é uma plataforma de staging virtual alimentada por IA que permite transformar ambientes vazios em espaços mobiliados profissionalmente em segundos.

## ✨ Funcionalidades

- 🎨 **Editor de Imagens com IA** - Edição avançada com Inpainting, Outpainting e remoção de objetos
- 🔐 **Autenticação Segura** - Login e registro via Clerk
- 💾 **Armazenamento em Nuvem** - Projetos e imagens salvos no Firebase
- 💳 **Sistema de Créditos** - Pagamentos via Stripe com múltiplos planos
- 📁 **Gerenciamento de Projetos** - Organize seus projetos em pastas
- 🎯 **Interface Intuitiva** - UI moderna com Tailwind CSS

## 🛠️ Stack Tecnológica

### Frontend
- ⚛️ **React 19** - Biblioteca JavaScript moderna
- 📘 **TypeScript** - Tipagem estática
- ⚡ **Vite** - Build tool super rápida
- 🎨 **Tailwind CSS** - Framework CSS utilitário

### Backend & Serviços
- 🔐 **Clerk** - Autenticação e gerenciamento de usuários
- 🔥 **Firebase** - Firestore (banco de dados) + Storage (arquivos)
- 💳 **Stripe** - Processamento de pagamentos
- 🤖 **Google Gemini AI** - Geração de imagens com IA

## 🚀 Como Começar

### Pré-requisitos

- Node.js 20+ (recomendado)
- npm ou yarn
- Contas em: Clerk, Firebase, Stripe, Google AI Studio

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/davidbenal/Ktirio-AI.git
cd ktirio-ai
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais (veja [SETUP_GUIDE.md](./SETUP_GUIDE.md) para instruções detalhadas)

4. **Execute o projeto**
```bash
npm run dev
```

5. **Acesse no navegador**
```
http://localhost:5173
```

## 📖 Documentação Completa

Para um guia passo a passo de configuração completo, consulte:

📘 **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Guia completo de configuração

Inclui:
- ✅ Configuração do Clerk
- ✅ Configuração do Firebase (Firestore + Storage)
- ✅ Configuração do Stripe (Produtos e Webhooks)
- ✅ Variáveis de ambiente
- ✅ Estrutura do projeto
- ✅ Solução de problemas

## 🗂️ Estrutura do Projeto

```
ktirio-ai/
├── components/              # Componentes React
│   ├── Editor.tsx          # Editor principal de imagens
│   ├── PricingPage.tsx     # Página de planos e preços
│   ├── ProjectGallery.tsx  # Galeria de projetos
│   └── ...
├── config/                 # Configurações
│   └── firebase.ts         # Configuração do Firebase
├── contexts/               # React Contexts
│   ├── CreditsContext.tsx  # Gerenciamento de créditos
│   ├── ProjectsContext.tsx # Gerenciamento de projetos
│   └── ...
├── services/               # Serviços
│   ├── firebaseService.ts  # CRUD Firebase
│   ├── stripeService.ts    # Integração Stripe
│   └── geminiService.ts    # Integração Gemini AI
├── hooks/                  # Custom React Hooks
├── types.ts                # TypeScript types
└── .env.local             # Variáveis de ambiente (não versionar!)
```

## 💡 Como Usar

### 1. Criar um Projeto
- Faça login na plataforma
- Clique em "Novo Projeto"
- Faça upload de uma imagem de ambiente vazio

### 2. Editar com IA
- Use as ferramentas de desenho para selecionar áreas
- Escolha o tipo de edição (Inpainting, Outpainting, etc.)
- Adicione prompts para guiar a IA
- Gere a nova imagem

### 3. Gerenciar Créditos
- Cada operação consome créditos
- Assine um plano para obter mais créditos
- Veja seu saldo na barra superior

## 💳 Planos Disponíveis

| Plano | Créditos/mês | Preço | Recursos |
|-------|--------------|-------|----------|
| **Gratuito** | 10 | R$ 0 | Qualidade Standard |
| **Básico** | 100 | R$ 29,90 | Qualidade HD + Sem marca d'água |
| **Profissional** | 500 | R$ 99,90 | Qualidade 4K + API Access |
| **Empresarial** | Ilimitado | R$ 299,90 | Qualidade 8K + Suporte dedicado |

## 🔐 Segurança

- ✅ Autenticação via Clerk (OAuth + Email)
- ✅ Regras de segurança do Firebase configuradas
- ✅ Pagamentos seguros via Stripe (PCI compliant)
- ✅ Dados criptografados em trânsito e em repouso

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📧 Contato

David Benal - [@davidbenal](https://github.com/davidbenal)

Link do Projeto: [https://github.com/davidbenal/Ktirio-AI](https://github.com/davidbenal/Ktirio-AI)

## 🙏 Agradecimentos

- [Clerk](https://clerk.com) - Autenticação
- [Firebase](https://firebase.google.com) - Backend
- [Stripe](https://stripe.com) - Pagamentos
- [Google AI](https://ai.google.dev) - Modelos de IA
- [Tailwind CSS](https://tailwindcss.com) - Estilização

---

Feito com ❤️ por [David Benal](https://github.com/davidbenal)
