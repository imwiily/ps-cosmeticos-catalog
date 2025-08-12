# Dashboard de Gestão de Categorias e Produtos

Sistema completo de gestão de categorias e produtos desenvolvido em React.js com arquitetura modular, design responsivo e suporte a produtos multi-cor.

## Versão Atual: 2.5.1

**Data de Lançamento:** 10/08/2025  
**Status:** ✅ Estável com correções de subcategorias implementadas

---

## 🎯 Funcionalidades

### 🔐 **Autenticação & Segurança**
- Sistema completo de autenticação JWT
- Proteção de rotas com middleware
- Gerenciamento de sessão com auto-refresh
- Logout automático em caso de token expirado

### 📋 **Gestão de Categorias**
- CRUD completo de categorias
- Upload de imagens com otimização automática
- Sistema de status (Ativo/Inativo)
- Filtros avançados e busca em tempo real
- **NOVO:** Sistema de subcategorias hierárquico

### 📦 **Gestão de Produtos Avançada**
- CRUD completo de produtos com validação robusta
- **Produtos Multi-Cor:** Sistema completo de variações de cor
- **Produtos Simples:** Produtos tradicionais sem variações
- Upload de imagens com preview
- Campos avançados: ingredientes, tags, modo de uso
- Preços com desconto e promoções
- Categorização com subcategorias

### 🎨 **Sistema de Cores Inteligente**
- Seletor de cores predefinidas (20+ cores)
- Editor de cores personalizadas com preview
- Validação de códigos hexadecimais
- Geração automática de gradientes
- Detecção de contraste para acessibilidade

### 📊 **Dashboard & Analytics**
- Estatísticas em tempo real de categorias e produtos
- Cards informativos com métricas importantes
- Visualização de produtos e categorias recentes
- Sistema de ações rápidas
- Indicadores de status do sistema

### 🎭 **Interface & UX**
- Design responsivo para desktop, tablet e mobile
- Tema dark/light com gradientes modernos
- Animações suaves e micro-interações
- Sistema de notificações (Toast) não-invasivo
- Loading states com skeleton loaders
- Sidebar colapsível com navegação intuitiva

---

## 🚀 Tecnologias Utilizadas

| Categoria | Tecnologias |
|-----------|-------------|
| **Frontend** | React 18, React Router DOM 6+, React Hooks |
| **Estilização** | Tailwind CSS 3+, CSS Grid/Flexbox, Animações CSS |
| **Ícones** | Lucide React (1000+ ícones) |
| **Estado** | Context API, useReducer, Custom Hooks |
| **API** | Fetch API, FormData, JWT Authentication |
| **Desenvolvimento** | ES6+, Async/Await, Webpack, Babel |

---

## 📁 Estrutura do Projeto

```
src/
├── components/                    # Componentes React reutilizáveis
│   ├── common/                   # Componentes base
│   │   ├── Header.js            # Cabeçalho da aplicação
│   │   ├── Sidebar.js           # Menu lateral responsivo
│   │   ├── Toast.js             # Sistema de notificações
│   │   ├── LoadingSkeleton.js   # Estados de carregamento
│   │   ├── ProtectedRoute.js    # Proteção de rotas
│   │   ├── ColorPicker.js       # Seletor de cores avançado
│   │   └── SubcategoryManager.js # Gerenciador de subcategorias
│   ├── auth/                    # Componentes de autenticação
│   │   └── LoginForm.js         # Formulário de login
│   ├── categories/              # Componentes de categorias
│   │   └── CategorySubcategories.js # Gestão de subcategorias
│   └── dashboard/               # Componentes do dashboard
│       ├── StatsCards.js        # Cards de estatísticas
│       ├── ProductStatsCards.js # Estatísticas de produtos
│       ├── RecentCategories.js  # Categorias recentes
│       └── RecentProducts.js    # Produtos recentes
├── pages/                       # Páginas principais
│   ├── LoginPage.js            # Página de autenticação
│   ├── DashboardPage.js        # Dashboard principal
│   ├── CategoriesPage.js       # Gestão de categorias
│   └── ProductsPage.js         # Gestão de produtos
├── services/                   # Serviços de API
│   ├── api.js                  # Comunicação com backend
│   └── auth.js                 # Serviços de autenticação
├── contexts/                   # Contextos React
│   └── AuthContext.js          # Estado global de autenticação
├── hooks/                      # Hooks customizados
│   ├── useToast.js            # Sistema de notificações
│   ├── useCategories.js       # Gestão de categorias
│   ├── useProducts.js         # Gestão de produtos
│   └── useSubcategories.js    # Gestão de subcategorias
├── utils/                     # Utilitários e helpers
│   ├── config.js              # Configurações centralizadas
│   ├── helpers.js             # Funções auxiliares
│   └── constants.js           # Constantes do sistema
├── App.js                     # Router principal
└── index.js                   # Ponto de entrada
```

---

## ⚡ Instalação e Configuração

### Pré-requisitos
- **Node.js** 16.0+ ou superior
- **npm** 7.0+ ou **yarn** 1.22+
- **Git** para controle de versão

### Instalação Rápida

```bash
# 1. Clone o repositório
git clone [url-do-repositorio]
cd dashboard-categorias

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env

# 4. Execute em modo desenvolvimento
npm start
```

### Configuração Avançada

```javascript
// src/utils/config.js
export const config = {
  api: {
    baseUrl: 'http://localhost:8080', // URL da sua API
    version: 'v1',
    timeout: 30000,
  },
  dashboard: {
    version: '2.5.1',
    name: 'Seu Dashboard',
  }
};
```

---

## 🛣️ Rotas da Aplicação

| Rota | Descrição | Autenticação | Funcionalidades |
|------|-----------|--------------|-----------------|
| `/login` | Autenticação | ❌ Não | Login, recuperação de sessão |
| `/dashboard` | Página principal | ✅ Sim | Estatísticas, ações rápidas |
| `/categories` | Gestão de categorias | ✅ Sim | CRUD, subcategorias, upload |
| `/products` | Gestão de produtos | ✅ Sim | CRUD, multi-cor, categorização |
| `/settings` | Configurações | ✅ Sim | Em desenvolvimento |

---

## 🎨 Sistema de Produtos Multi-Cor

### Recursos Avançados
- **Até 10 cores por produto** com validação inteligente
- **Cores predefinidas:** 20+ cores populares pré-configuradas
- **Cores personalizadas:** Editor hexadecimal com preview
- **Validação automática:** Detecção de códigos inválidos
- **Preview de gradiente:** Visualização em tempo real
- **Detecção de contraste:** Texto claro/escuro automático

### Exemplo de Uso
```javascript
// Produto Multi-Cor
{
  tipo: 'MULTI_COLOR',
  cores: {
    'Azul Royal': '#0066CC',
    'Vermelho Cereja': '#CC0000',
    'Verde Esmeralda': '#00CC66'
  }
}
```

---

## 📊 Sistema de Subcategorias

### Funcionalidades
- **Hierarquia:** Categoria → Subcategoria → Produto
- **Gestão completa:** Criar, editar, excluir subcategorias
- **Seleção inteligente:** Interface otimizada para escolha
- **Validação:** Prevenção de produtos órfãos
- **Cache inteligente:** Performance otimizada

### Fluxo de Uso
1. **Criar categoria** principal (ex: "Eletrônicos")
2. **Adicionar subcategorias** (ex: "Smartphones", "Laptops")
3. **Categorizar produtos** com precisão máxima
4. **Filtrar e buscar** por categoria/subcategoria

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm start              # Servidor de desenvolvimento (localhost:3000)
npm run dev           # Alias para npm start

# Produção
npm run build         # Build otimizado para produção
npm run preview       # Preview do build de produção

# Qualidade
npm test              # Executa testes (se configurados)
npm run lint          # Análise de código com ESLint
npm run format        # Formatação com Prettier

# Utilitários
npm run analyze       # Análise do bundle
npm run clean         # Limpa cache e dependências
```

---

## 🏗️ Padrões de Desenvolvimento

### Arquitetura
- **Componentes funcionais** com React Hooks
- **Custom Hooks** para lógica compartilhada
- **Context API** para estado global
- **Separation of Concerns** com camadas bem definidas

### Convenções de Código
- **ESLint + Prettier** para consistência
- **Nomenclatura em inglês** para código
- **Comentários em português** para documentação
- **Conventional Commits** para versionamento

### Estrutura de Commits
```bash
feat(products): add multi-color support with advanced color picker

- Add ColorPicker component with predefined colors
- Implement custom color creation with hex validation
- Add gradient preview for multi-color products
- Update product form with color management

Resolves: #123
Version: 2.5.1
```

---

## 📈 Versionamento

Este projeto segue o **Semantic Versioning (SemVer)**:

- **MAJOR** (X.0.0): Mudanças que quebram compatibilidade
- **MINOR** (0.X.0): Novas funcionalidades mantendo compatibilidade  
- **PATCH** (0.0.X): Correções de bugs e melhorias menores

### Histórico de Versões

| Versão | Data | Principais Funcionalidades |
|--------|------|---------------------------|
| **2.5.1** | 10/08/2025 | ✅ Correções de subcategorias, async/await otimizado |
| **2.5.0** | 09/08/2025 | 🎨 Sistema completo multi-cor, ColorPicker avançado |
| **2.4.0** | 08/08/2025 | 📋 Subcategorias, melhorias de UX |
| **2.3.0** | 07/08/2025 | 📦 Sistema completo de produtos |
| **2.2.0** | 06/08/2025 | 🎭 Interface responsiva, Tailwind CSS |
| **2.1.0** | 05/08/2025 | 🔐 Sistema de autenticação JWT |
| **2.0.0** | 04/08/2025 | 🚀 Refatoração completa, React Router |

---

## 🔌 API Endpoints

### Autenticação
```http
POST /api/v1/login          # Login do usuário
GET  /api/v1/health         # Status da API
```

### Categorias
```http
GET    /api/v1/categorias           # Listar categorias
POST   /api/v1/categorias           # Criar categoria
PUT    /api/v1/categorias/{id}      # Atualizar categoria
DELETE /api/v1/categorias/{id}      # Excluir categoria
```

### Subcategorias
```http
GET    /api/v1/subcategorias                        # Listar todas
POST   /api/v1/subcategorias                        # Criar subcategoria
PUT    /api/v1/subcategorias/{id}                   # Atualizar subcategoria
DELETE /api/v1/subcategorias/{id}                   # Excluir subcategoria
GET    /api/v1/categorias/subcategorias/{categoryId} # Por categoria
```

### Produtos
```http
GET    /api/v1/produtos           # Listar produtos
POST   /api/v1/produtos           # Criar produto
PUT    /api/v1/produtos/{id}      # Atualizar produto
DELETE /api/v1/produtos/{id}      # Excluir produto
GET    /api/v1/produtos/{id}      # Buscar por ID
```

---

## 🎯 Performance & Otimização

### Frontend
- **Code Splitting** automático com React Router
- **Lazy Loading** de componentes pesados
- **Image Optimization** com tipos ICON/MID-DISPLAY/DISPLAY
- **Cache inteligente** para requisições API
- **Debounce** em buscas e filtros

### API Integration
- **Request Deduplication** para evitar calls duplicadas
- **Error Boundaries** para captura de erros
- **Retry Logic** automático em falhas de rede
- **Token Refresh** automático antes da expiração

---

## 🐛 Troubleshooting & Debug

### Problemas Comuns

**🔸 Subcategorias não carregam na edição**
```javascript
// Verificar mapeamento correto no ProductsPage.js
const subcategoryId = product?.subcategoriaId || product?.subCategoryId;
console.log('Debug subcategory ID:', subcategoryId);
```

**🔸 Cores não salvam em produtos multi-cor**
```javascript
// Verificar validação de cores no helpers.js
const validation = validateColorsObject(formData.cores);
console.log('Color validation:', validation);
```

**🔸 Imagens não aparecem**
```javascript
// Verificar URLs de imagem no config.js
console.log('Image URL:', getMidDisplayUrl(imageUrl));
```

---

## 📜 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 🌟 Agradecimentos

Desenvolvido com ❤️ usando as melhores práticas de desenvolvimento React.js moderno.

**Tecnologias que tornaram este projeto possível:**
- React Team pela excelente biblioteca
- Tailwind CSS pela facilidade de estilização
- Lucide Icons pelo conjunto completo de ícones
- Comunidade open source pelas contribuições

---

<div align="center">

**Dashboard de Gestão de Categorias v2.5.1**  
*Sistema completo de gestão com interface moderna e funcionalidades avançadas*

[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-green.svg)](https://tailwindcss.com/)
[![Version](https://img.shields.io/badge/Version-2.5.1-purple.svg)](#)
[![Status](https://img.shields.io/badge/Status-Stable-brightgreen.svg)](#)

</div>