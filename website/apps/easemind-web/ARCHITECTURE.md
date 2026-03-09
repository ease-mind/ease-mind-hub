# Clean Architecture - EaseMind Web

## Estrutura do Projeto

Este projeto segue os prin cípios de **Clean Architecture**, organizando o código em camadas bem definidas com responsabilidades claras.

## Camadas

### 1. Domain (Regras de Negócio)
- **entities/**: Entidades de negócio
- **interfaces/**: Contratos e interfaces
- **use-cases/**: Casos de uso da aplicação

### 2. Infrastructure (Implementações Técnicas)
- **guards/**: Guards de roteamento e autenticação
- **routing/**: Configuração de rotas
- **config/**: Configurações da aplicação

### 3. Presentation (Interface do Usuário)
- **pages/**: Páginas da aplicação
- **components/**: Componentes reutilizáveis
- **modals/**: Componentes de modal
- **layouts/**: Layouts da aplicação

## Fluxo de Dependências

```
Presentation → Domain ← Infrastructure
```

- **Presentation** depende apenas do **Domain**
- **Infrastructure** implementa as interfaces do **Domain**
- **Domain** não depende de nenhuma outra camada (independente)

## Packages (Monorepo)

### @repo/data-access
Pacote compartilhado com a lógica de acesso a dados seguindo Clean Architecture:

#### Domain Layer
- `domain/entities/` - Entidades (User, Auth)
- `domain/interfaces/` - Interfaces de repositórios
- `domain/use-cases/` - Casos de uso (Login, Register, Update)

#### Infrastructure Layer
- `infrastructure/http/` - Cliente HTTP (Axios)
- `infrastructure/repositories/` - Implementações de repositórios
- `infrastructure/factories/` - Factories para instanciar use cases

#### Presentation Layer
- `presentation/hooks/` - Hooks customizados (useAuth)

### Outros Packages
- `@repo/ui` - Componentes de UI compartilhados
- `@repo/utils` - Utilitários e helpers
- `@repo/typescript-config` - Configurações TypeScript
- `@repo/eslint-config` - Configurações ESLint

## Benefícios

✅ **Separação de Responsabilidades**: Cada camada tem uma responsabilidade clara
✅ **Testabilidade**: Fácil de testar cada camada isoladamente
✅ **Manutenibilidade**: Código organizado e fácil de manter
✅ **Escalabilidade**: Fácil adicionar novas features
✅ **Independência de Frameworks**: Domain não depende de libs externas
✅ **Reusabilidade**: Código compartilhado via monorepo
