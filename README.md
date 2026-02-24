# EaseMind Hub - Plataforma de Saúde Mental e Cognitiva

Bem-vindo ao projeto **EaseMind Hub**, uma plataforma moderna e completa desenvolvida para auxiliar no monitoramento e cuidado da saúde mental e cognitiva. O projeto é composto por uma **API RESTful**, uma **aplicação mobile** desenvolvida com **React Native (Expo)** e um **website** desenvolvido com **Next.js**.

---

## 🚀 Começando

Estas instruções vão te ajudar a rodar o projeto localmente e explorar as funcionalidades que implementamos:

- **Autenticação completa**: Criar conta, login e logout de usuários;
- **Termômetro de sintomas**: Registrar e monitorar sintomas relacionados à saúde mental;
- **Perfil do usuário**: Visualizar e editar informações pessoais, incluindo foto de perfil;
- **Upload de arquivos**: Sistema de upload integrado com Firebase Storage;
- **API RESTful**: Backend robusto com MongoDB e documentação Swagger;
- **Aplicação Mobile**: App nativo para iOS e Android com React Native e Expo;

### Pré-requisitos

Certifique-se de ter instalado:
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Yarn](https://yarnpkg.com/) ou npm
- [Docker](https://www.docker.com/) (opcional, para rodar via containers)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (para desenvolvimento mobile)

---

## 🛠️ Instalação

Clone este repositório:

```bash
git clone https://github.com/ease-mind/ease-mind-hub.git
cd ease-mind-hub
```

Instale as dependências de cada projeto:

```bash
# Instalar dependências da API
cd api
yarn install

# Instalar dependências do App Mobile
cd ../app
yarn install

# Instalar dependências do Website
cd ../website
yarn install
```

---

## 🚀 Como Executar

### Rodar a API

1. Configure as variáveis de ambiente criando um arquivo `.env` na pasta `api`:

```env
PORT=3000
MONGODB_URI=sua_connection_string_mongodb
JWT_SECRET=seu_secret_jwt
FIREBASE_STORAGE_BUCKET=seu_bucket_firebase
```

2. Execute a API:

```bash
cd api
yarn dev
```

Ou usando Docker:

```bash
cd api
docker-compose up
```

A API estará disponível em http://localhost:8080
Documentação Swagger em http://localhost:8080/api-docs

### Rodar o App Mobile

1. Configure o Firebase criando um arquivo `firebaseConfig.ts` na pasta `app` (use o `firebaseConfig.example.ts` como base)

2. Execute o app:

```bash
cd app
yarn start
```

3. Use o Expo Go no seu celular ou rode em um emulador:
   - Pressione `i` para iOS
   - Pressione `a` para Android
   - Escaneie o QR Code com Expo Go

### Rodar o Website

```bash
cd website
yarn dev
```

O website estará disponível em http://localhost:3001

---

## 📱 Estrutura do Projeto

### API (Backend)
- **Node.js + Express + TypeScript**
- **MongoDB** como banco de dados
- **JWT** para autenticação
- **Swagger** para documentação
- **Multer** para upload de arquivos

### App Mobile
- **React Native + Expo**
- **TypeScript**
- **React Hook Form** para formulários
- **React Navigation** para navegação
- **Firebase Storage** para armazenamento de arquivos
- **Axios** para requisições HTTP

### Website
- **Next.js**
- **TypeScript**
- **TurboRepo** para monorepo

---

## 📚 Funcionalidades Principais

### Autenticação
- Cadastro de novos usuários
- Login com e-mail e senha
- Logout com redirecionamento

### Termômetro de Sintomas
- Registro diário de sintomas
- Visualização de histórico
- Alertas quando múltiplos sintomas são selecionados

### Perfil do Usuário
- Edição de dados pessoais (nome, e-mail, telefone)
- Upload de foto de perfil
- Modo de edição com validação de formulários

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas:

- **Camada de Apresentação**: App Mobile (React Native) e Website (Next.js)
- **Camada de API**: Express.js com controllers, services e middlewares
- **Camada de Dados**: MongoDB para persistência

### Segurança
- Autenticação via JWT
- Validação de tokens em rotas protegidas
- Senhas criptografadas com bcrypt
- Validação de dados de entrada

---

## 🧪 Testes

Para executar os testes:

```bash
# API
cd api
yarn test

# App Mobile
cd app
yarn test
```

---

## 📖 Documentação da API

Acesse a documentação Swagger da API em:
http://localhost:8080/api-docs

Principais endpoints:
- `POST /auth/register` - Criar nova conta
- `POST /auth/login` - Fazer login
- `GET /auth/verify` - Verificar token
- `GET /symptoms` - Listar sintomas
- `POST /user-symptoms` - Registrar sintomas do usuário
- `PUT /users/:id` - Atualizar dados do usuário

---

## 🎨 Design e UI

O design da aplicação foi desenvolvido com foco em:
- **Acessibilidade**: Interface clara e intuitiva
- **Responsividade**: Adaptação para diferentes tamanhos de tela
- **Experiência do usuário**: Feedback visual em todas as ações
- **Paleta de cores**: Tons de coral e neutros para transmitir tranquilidade

---

## 🔗 Links Úteis

- [React Native](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/docs/)
- [TypeScript](https://www.typescriptlang.org/)
- [Next.js](https://nextjs.org/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Swagger](https://swagger.io/)

---

## 👥 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

## 📄 Licença

Este projeto é um estudo acadêmico desenvolvido para a FIAP.
