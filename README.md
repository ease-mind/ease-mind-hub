# EaseMind Hub

Plataforma de saúde mental e cognitiva para pessoas neurodivergentes (TDAH, autismo e outras condições). Composta por uma **API RESTful**, **aplicação mobile** (React Native + Expo) e **website** (Next.js + TurboRepo).

---

## Stack

| Camada | Tecnologias |
|--------|------------|
| **API** | Node.js, Express, TypeScript, MongoDB, JWT, Swagger, Multer |
| **Mobile** | React Native, Expo SDK 54, TypeScript, React Navigation, React Hook Form, AsyncStorage |
| **Website** | Next.js 14, TypeScript, Material-UI, TurboRepo, Storybook |

---

## Estrutura

```
ease-mind-hub/
├── api/                         # Backend REST
├── app/                         # Mobile React Native + Expo
└── website/                     # Monorepo TurboRepo
    ├── apps/
    │   ├── easemind-web/        # Site institucional
    │   ├── mfe-tasks/           # Micro-frontend de tarefas
    │   └── docs/                # Documentação Storybook
    └── packages/
        ├── ui/                  # Biblioteca de componentes
        ├── utils/               # Utilitários compartilhados
        └── data-access/         # Camada de dados
```

---

## Funcionalidades

### Termômetro Sensorial
- Seleção de sintomas categorizados: **Falha na Comunicação**, **Sintomas Físicos** e **Aumento de Estereotipias**
- Cálculo de temperatura emocional com três níveis: `Calmo` (≤36°), `Alerta` (≤38°), `Sobrecarga` (>38°)
- Persistência do último registro por usuário via `POST /user-symptoms`
- Visualização com termômetro animado e feedback de cor dinâmico

### Interface Adaptativa
- **3 níveis de complexidade**: Simples, Moderado, Detalhado — controlam quais elementos da UI são exibidos
- **Contraste**: Baixo, Normal, Alto
- **Espaçamento**: Compacto (8px), Normal (16px), Espaçoso (24px)
- **Tamanho de fonte**: 12px a 20px
- Preferências persistidas via `AsyncStorage`

### Autenticação
- Registro e login com JWT
- Guards de rota (`AuthGuard`, `PublicGuard`) no website
- Rotas protegidas no mobile via `(protected)` layout

### Gerenciamento de Tarefas
- CRUD completo de tarefas
- Associação por usuário autenticado

### Perfil
- Edição de dados: nome, e-mail, telefone
- Upload de foto de perfil via `POST /upload`

---

## Endpoints da API

```
POST   /auth/register                    # Criar conta
POST   /auth/login                       # Autenticar usuário
GET    /auth/verify                      # Validar token JWT
GET    /symptoms                         # Listar sintomas disponíveis
POST   /user-symptoms                    # Registrar avaliação
GET    /user-symptoms/:userId/latest     # Última avaliação do usuário
PUT    /users/:id                        # Atualizar dados do usuário
POST   /upload                           # Upload de arquivo
```

Documentação completa: `http://localhost:8080/api-docs`

---

## Como Executar

### Pré-requisitos
- Node.js 18+
- Yarn ou npm
- MongoDB
- Expo CLI

### API
```bash
cd api
cp .env.example .env   # Configure MONGODB_URI, JWT_SECRET, PORT
yarn install
yarn dev               # http://localhost:8080
```

### Mobile
```bash
cd app
yarn install
npx expo start --clear --localhost
# i → iOS Simulator | a → Android Emulator
```

### Website
```bash
cd website
yarn install
yarn dev               # http://localhost:3001
```

### Storybook
```bash
cd website
yarn storybook         # http://localhost:6006
```

---

## Testes

```bash
# Website
cd website
yarn test

# Mobile
cd app
yarn test

# API
cd api
yarn test
```

---

## Design

- [Figma](https://www.figma.com/design/FHWYI2j60GKDkKzSNVrbnA/EaseMind?node-id=1-728&t=WyV1MFOzy2LVH5AJ-0)

- Storybook: `http://localhost:6006`
