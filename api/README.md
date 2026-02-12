# Easemind API - Tech Challenge #2

Bem-vindo à **Easemind API**, o backend responsável por gerenciar todas as funcionalidades do Easemind.  
Desenvolvida em **Node.js** com **Express** e **MongoDB**, esta API fornece endpoints para autenticação, gerenciamento de usuários, transações, categorias, cartões e widgets personalizados.

---

## 🚀 Funcionalidades

A API fornece suporte para:

- **Autenticação** com JWT;
- **CRUD de transações** (criar, editar, excluir e listar);
- **Gestão de categorias**;
- **Gerenciamento de cartões**;
- **Widgets** com dados agregados sobre as finanças do usuário (gastos diários, resumo mensal, categoria mais cara, etc.);
- **Upload de arquivos** (ex: imagem de perfil);
- **Documentação de API** via Swagger e YAML.

---

## 📂 Estrutura do Projeto

A estrutura principal da API é organizada da seguinte forma:

```
src/
 ├── config/              # Configurações (MongoDB, Swagger)
 ├── controllers/         # Controladores das rotas
 ├── docs/                # Documentação Swagger
 ├── enums/               # Enums para padronização
 ├── middlewares/         # Middlewares de autenticação e validação
 ├── models/              # Modelos do MongoDB
 ├── routes/              # Definição das rotas da API
 ├── services/            # Serviços e lógica de negócio
 ├── validators/          # Validações de entrada
 ├── app.ts               # Configuração principal do Express
 └── uploads/             # Diretório para arquivos enviados
```

---

## 🛠️ Pré-requisitos

Certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [Docker](https://www.docker.com/)
- [MongoDB](https://www.mongodb.com/) (se rodar localmente sem Docker)

---

## 📦 Instalação

Clone o repositório:

```bash
git clone https://github.com/TechChallengeJourney/easemind-api.git
cd easemind-api
```

Instale as dependências:

```bash
npm install
```

---

## 🚀 Como Executar

### Modo Desenvolvimento

```bash
npm run dev
```

### Usando Docker

```bash
docker-compose build
docker-compose up
```

A API estará disponível em:

```
http://localhost:8080
```

---

## 📜 Documentação da API

A documentação completa dos endpoints pode ser acessada em:

```
http://localhost:8080/api-docs
```

A documentação foi escrita em **Swagger** utilizando arquivos YAML, localizados em `src/docs`.

---

## 🗄️ Banco de Dados

O projeto utiliza **MongoDB** como banco de dados principal.  
A configuração de conexão está localizada em `src/config/mongodb.ts` e utiliza variáveis de ambiente definidas no arquivo `.env`.

Exemplo de `.env`:

```env
# Porta em que a API será executada
PORT=8080

# Senha do usuário admin do MongoDB
MONGODB_ADMIN_PASS=

# URI de conexão com o MongoDB (ex: mongodb+srv://user:pass@cluster.mongodb.net/dbname)
MONGODB_URI=

# Chave secreta para geração e validação de tokens JWT
JWT_SECRET=
```

---

## 🛠️ Principais Tecnologias

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Swagger](https://swagger.io/)
- [JWT](https://jwt.io/)
- [Multer](https://github.com/expressjs/multer) (upload de arquivos)
- [Docker](https://www.docker.com/)

---

## 📊 Widgets Implementados

Os serviços de widgets estão localizados em `src/services/widgets` e atualmente incluem:

- **dailyExpenseAverageWidget** → Média de gastos diários.
- **financialAnalysisWidget** → Análise financeira geral.
- **financialStatusWidget** → Status financeiro.
- **highestIncomeThisMonthWidget** → Maior receita do mês.
- **monthlySummaryWidget** → Resumo mensal.
- **mostExpensiveCategoryWidget** → Categoria mais cara.

---

## 🌐 Deploy

O backend é hospedado na **AWS ECS** com imagens armazenadas no **AWS ECR**.  
O deploy é realizado via pipelines automatizados para manter a API atualizada.

---

## 📎 Links Úteis

- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/docs/)
- [Swagger](https://swagger.io/specification/)
- [JWT](https://jwt.io/)
- [Docker](https://docs.docker.com/)
