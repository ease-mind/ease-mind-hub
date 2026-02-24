# Configuração Centralizada da API

## 📋 Estrutura

A configuração da API foi centralizada no arquivo `shared/config/api.ts` para facilitar a criação de novos serviços e manter consistência em toda a aplicação.

## 🔧 Configuração

### Arquivo: `shared/config/api.ts`

```typescript
export const API_CONFIG = {
    BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
    TIMEOUT: 10000,
};
```

### Variável de Ambiente

Adicione no arquivo `.env`:
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

**Importante para testes:**
- **iOS Simulator**: Use `http://localhost:3000/api`
- **Android Emulator**: Use `http://10.0.2.2:3000/api`
- **Dispositivo Físico**: Use o IP da sua máquina, ex: `http://192.168.1.X:3000/api`

## 🚀 Como Criar Novos Serviços

### 1. Importe a instância do axios

```typescript
import { api } from '../config/api';
```

### 2. Defina as interfaces

```typescript
export interface MyEntity {
    _id: string;
    name: string;
    // ... outros campos
}
```

### 3. Crie o serviço

```typescript
export const myEntityService = {
    async getAll(): Promise<MyEntity[]> {
        try {
            const response = await api.get<MyEntity[]>('/my-entities');
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data?.message || 'Erro ao buscar');
            } else if (error.request) {
                throw new Error('Não foi possível conectar ao servidor.');
            } else {
                throw new Error(error.message || 'Erro ao buscar');
            }
        }
    },
    
    // ... outros métodos
};
```

### 4. Exporte no `shared/index.ts`

```typescript
export { myEntityService } from './services/myEntityService';
export type { MyEntity } from './services/myEntityService';
```

## 📦 Recursos Disponíveis

### Instância do Axios
```typescript
import { api } from '@/shared';

// A instância já está configurada com:
// - baseURL
// - timeout
// - interceptors de log (em modo DEV)
// - headers padrão
```

### Gerenciamento de Token
```typescript
import { setAuthToken } from '@/shared';

// Configurar token
setAuthToken('seu-token-jwt');

// Remover token
setAuthToken(null);
```

### Obter URL Base
```typescript
import { getBaseURL } from '@/shared';

const apiUrl = getBaseURL(); // 'http://localhost:3000/api'
```

## 🔍 Debug

Em modo de desenvolvimento (`__DEV__`), a instância do axios já possui interceptors que exibem logs detalhados:

- 📤 **Request**: Mostra método, URL e dados enviados
- 📥 **Response**: Mostra status e URL
- ❌ **Error**: Mostra detalhes do erro (status, mensagem, etc)

Exemplo de log:
```
📤 [API Request] POST http://localhost:3000/api/auth/login
📥 [API Response] 200 /auth/login
```

## ✅ Benefícios

1. **Configuração única**: Altere a URL da API em um único lugar
2. **Consistência**: Todos os serviços usam a mesma configuração
3. **Reutilização**: Importe apenas `api` de `config/api`
4. **Debug facilitado**: Logs automáticos em desenvolvimento
5. **Gerenciamento de token**: Função centralizada para configurar autenticação
6. **Tratamento de erros**: Padrão consistente em todos os serviços

## 📝 Exemplo Completo

Veja o arquivo `shared/services/symptomService.example.ts` para um exemplo completo de como criar um novo serviço seguindo as melhores práticas.

## 🔒 Segurança

- O token JWT é automaticamente incluído em todas as requisições após o login
- Use `setAuthToken(null)` no logout para remover o token
- A configuração do token é sincronizada com o AsyncStorage via `authService`

## 🧪 Testando a Conexão

Para testar se a API está acessível:

```typescript
import { api } from '@/shared';

// Testar conexão
api.get('/health')
    .then(() => console.log('✅ API conectada'))
    .catch(err => console.error('❌ Erro na API:', err.message));
```
