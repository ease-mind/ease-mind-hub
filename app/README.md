# Easemind - Tech Challenge #4

Bem-vindo ao projeto de estudo **Easemind**, uma aplicação mobile moderna desenvolvida em **React Native** utilizando o **Expo**. Este projeto foi criado para explorar boas práticas de arquitetura, componentes reutilizáveis e integração com recursos nativos, proporcionando uma experiência fluida e responsiva para o usuário.

---

## 🚀 Funcionalidades

-   Autenticação de usuário (login e cadastro)
-   Criação, edição e exclusão de transações financeiras
-   Filtro e visualização do extrato de transações
-   Visualização do saldo total
-   Edição de perfil do usuário
-   Visualização e exclusão de cartões vinculados à conta

---

## 📖 Documentação

> **Importante**: As explicações específicas solicitadas no Tech Challenge – Fase 4 sobre arquitetura, performance e segurança estão documentadas separadamente nos seguintes documentos:

-   **[Documentação de Arquitetura](./docs/architecture.md)** – Detalha a organização da arquitetura do projeto, módulos de funcionalidade, camadas (Domain, Infrastructure, Presentation) e estrutura geral do código.
-   **[Documentação de Performance](./docs/performance-test-plan.md)** – Explica a melhoria de performance implementada no projeto, detalhando os testes realizados e as otimizações de renderização e cache de dados.
-   **[Documentação de Segurança](./docs/security.md)** – Explica a implementação de autenticação segura e criptografia de dados sensíveis, incluindo proteção de rotas e validações de segurança.

---

## 🛠️ Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) e o [Expo CLI](https://docs.expo.dev/get-started/installation/) instalados em sua máquina.

---

## 📦 Instalação

Clone este repositório:

```bash
git clone https://github.com/laconicamente/tech-challenge-3.git
cd tech-challenge-3
```

Instale as dependências:

```bash
npm install
```

---

## 🚀 Como Executar

Para iniciar o projeto em modo de desenvolvimento, execute:

```bash
npx expo start
```

Você pode abrir o app em:

-   [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
-   [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
-   [Expo Go](https://expo.dev/go) no seu dispositivo físico

---

## 🌐 Backend

Foram utilizados os serviços do Firebase para integração de funcionalides, sendo eles: **Firestore Database** para salvar os dados no banco do Firebase e o **Firebase Storage** para armazenar os comprovantes de transações e imagens do usuário.

Para configurar o Firebase no projeto foi necessário seguir os seguintes passos:

1.  **Criar um projeto no Firebase:** Acesse o [console do Firebase](https://console.firebase.google.com/) e crie um novo projeto.

2.  **Adicionar um aplicativo Web ao projeto:** No painel do seu projeto Firebase, adicione um novo aplicativo Web para obter as credenciais de configuração.

3.  **Criar o arquivo de configuração:** Na raiz do projeto, crie um arquivo chamado `firebaseConfig.ts` e adicione o seguinte código, substituindo os valores pelas credenciais do seu projeto Firebase:

    ```typescript
    import { initializeApp } from "firebase/app";
    import { initializeAuth, getReactNativePersistence } from "firebase/auth";
    import { getFirestore } from "firebase/firestore";
    import { getStorage } from "firebase/storage";
    import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

    const firebaseConfig = {
    	apiKey: "SUA_API_KEY",
    	authDomain: "SEU_AUTH_DOMAIN",
    	projectId: "SEU_PROJECT_ID",
    	storageBucket: "SEU_STORAGE_BUCKET",
    	messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    	appId: "SEU_APP_ID",
    	measurementId: "SEU_MEASUREMENT_ID"
    };

    const app = initializeApp(firebaseConfig);

    const auth = initializeAuth(app, {
    	persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
    const firestore = getFirestore(app);
    const storage = getStorage(app);

    export { auth, firestore, storage };
    ```

4.  **Instale as dependências do Firebase:** Certifique-se de que as seguintes dependências estão instaladas no seu projeto:

    ```bash
    npm install firebase @react-native-async-storage/async-storage
    ```

Com essas configurações, o aplicativo estará pronto para se conectar aos serviços do Firebase.

---

## 🎨 Design & Estilização

O layout do app foi baseado no protótipo Web do [Figma](https://www.figma.com/design/ZeXkGB9NhAr5ypgpgF1gWf/Easemind---Redesign?node-id=118-103&t=hyMOJlYGyckL9kYm-1), seguindo o Design System do Easemind para garantir consistência visual e acessibilidade.

---

## 📚 Documentação e Links Úteis

-   [React Native](https://reactnative.dev/docs/getting-started)
-   [Expo](https://docs.expo.dev/)
-   [React Navigation](https://reactnavigation.org/docs/getting-started)
-   [React Native Paper](https://callstack.github.io/react-native-paper/)
