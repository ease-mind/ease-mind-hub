# Migração de Firebase para API REST

## 📋 Resumo das Alterações

Este documento descreve a migração do sistema de autenticação do app mobile, que anteriormente utilizava Firebase, para uma solução baseada em API REST, alinhada com o serviço web.

## 🔄 O que foi alterado

### 1. **Serviço de Autenticação** (`shared/services/authService.ts`)

Criado serviço centralizado de autenticação que utiliza:
- **Axios** para chamadas HTTP à API
- **AsyncStorage** para persistência local (equivalente ao sessionStorage do web)
- **Interceptor** para adicionar token JWT automaticamente nas requisições

#### Métodos disponíveis:
- `login(credentials)` - Realiza login e salva token/usuário
- `register(data)` - Cadastra novo usuário
- `verifyToken(token)` - Valida token JWT
- `updateUser(userId, userData)` - Atualiza dados do usuário
- `updateUserProfileImage(userId, file)` - Atualiza foto de perfil
- `logout()` - Limpa sessão e token
- `getStoredUser()` - Obtém usuário do AsyncStorage
- `getStoredToken()` - Obtém token do AsyncStorage

### 2. **Contexto de Autenticação** (`shared/contexts/AuthContext.tsx`)

Substituído o contexto baseado em Firebase por um novo contexto que:
- Usa `authService` para todas as operações
- Gerencia estados de autenticação (user, isLoading, isAuthenticated)
- Valida token automaticamente na inicialização
- Sincroniza dados entre API e AsyncStorage

### 3. **Atualizações nos Componentes**

Todos os componentes foram atualizados para importar de `@/shared/contexts` ao invés de `@/modules/Users`:

- ✅ `app/(auth)/account-access.tsx`
- ✅ `app/_layout.tsx`
- ✅ `app/(protected)/_layout.tsx`
- ✅ `app/(protected)/profile.tsx`
- ✅ `shared/components/Header/ProtectedHeader.tsx`
- ✅ `shared/components/Header/AppHeader.tsx`
- ✅ `shared/ui/FileUploadButton.tsx`

## 🆕 Dependências Adicionadas

```bash
npm install axios
```

## 🔧 Configuração Necessária

Adicione a URL da API no arquivo `.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

## 📦 Estrutura de Dados

### Interface User
```typescript
interface User {
    _id: string;
    name: string;
    email: string;
    image?: string;
    document?: string;
    createdAt?: string;
    updatedAt?: string;
}
```

### Interface AuthResponse
```typescript
interface AuthResponse {
    user: User;
    accessToken: string;
}
```

## 🚀 Como Usar

### Import do hook de autenticação:
```typescript
import { useAuth } from '@/shared/contexts';

const MyComponent = () => {
    const { user, login, logout, isAuthenticated, isLoading } = useAuth();
    
    // Usar métodos de autenticação
};
```

### Import direto do serviço:
```typescript
import { authService } from '@/shared/services/authService';

// Fazer login
const response = await authService.login({ email, password });

// Atualizar usuário
const updatedUser = await authService.updateUser(userId, { name: 'Novo Nome' });
```

## ✅ Benefícios da Migração

1. **Consistência**: Mesma API usada no web e mobile
2. **Sem dependência do Firebase**: Reduz custos e complexidade
3. **Controle total**: Backend próprio com controle completo sobre autenticação
4. **Manutenção facilitada**: Código centralizado e reutilizável
5. **Performance**: Validação de token otimizada

## 🔒 Segurança

- Token JWT armazenado de forma segura no AsyncStorage
- Token enviado automaticamente no header `Authorization` de todas as requisições
- Validação automática do token na inicialização do app
- Logout limpa completamente os dados locais

## 📝 Notas

- Os arquivos antigos do módulo `modules/Users` com Firebase podem ser removidos
- O arquivo `firebaseConfig.ts` não é mais necessário
- Certifique-se de que a API está rodando antes de testar o app
