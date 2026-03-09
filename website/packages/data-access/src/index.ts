export * from './domain/entities/auth.entity';
export * from './domain/entities/user.entity';
export * from './domain/entities/symptom.entity';
export * from './domain/entities/task.entity';
export * from './domain/entities/address.entity';

export * from './domain/interfaces/auth.repository.interface';
export * from './domain/interfaces/user.repository.interface';
export * from './domain/interfaces/symptom.repository.interface';
export * from './domain/interfaces/task.repository.interface';
export * from './domain/interfaces/address.repository.interface';

export * from './domain/use-cases/auth/login.use-case';
export * from './domain/use-cases/auth/register.use-case';
export * from './domain/use-cases/user/update-user.use-case';
export * from './domain/use-cases/symptom/get-all-symptoms.use-case';
export * from './domain/use-cases/symptom/get-symptom-by-id.use-case';
export * from './domain/use-cases/symptom/get-symptoms-by-category.use-case';
export * from './domain/use-cases/symptom/get-symptom-categories.use-case';
export * from './domain/use-cases/symptom/save-user-symptoms.use-case';
export * from './domain/use-cases/symptom/get-latest-user-symptoms.use-case';
export * from './domain/use-cases/task/get-all-tasks.use-case';
export * from './domain/use-cases/task/get-task-by-id.use-case';
export * from './domain/use-cases/task/create-task.use-case';
export * from './domain/use-cases/task/update-task.use-case';
export * from './domain/use-cases/task/delete-task.use-case';
export * from './domain/use-cases/address/get-user-address.use-case';
export * from './domain/use-cases/address/update-user-address.use-case';

export * from './infrastructure/repositories/auth.repository';
export * from './infrastructure/repositories/user.repository';
export * from './infrastructure/repositories/symptom.repository';
export * from './infrastructure/repositories/task.repository';
export * from './infrastructure/repositories/address.repository';

export * from './infrastructure/factories/auth.factory';
export * from './infrastructure/factories/user.factory';
export * from './infrastructure/factories/symptom.factory';
export * from './infrastructure/factories/task.factory';
export * from './infrastructure/factories/address.factory';

export * from './infrastructure/http/api-client';

export * from './presentation/hooks/use-auth.hook';
export * from './presentation/hooks/use-symptom.hook';
export * from './presentation/hooks/use-task.hook';
export * from './presentation/hooks/use-address.hook';

export * from './domain/helpers/task.helpers';

export * from './contexts/cognitive-settings/cognitive-settings.context';
export * from './contexts/user.context';

export * from './classes/mocks/states';
export * from './helpers/api';
export * from './helpers/is-token-expired';
export * from './hooks/use-fetch';
export * from './hooks/use-session';

// Temporary exports for backward compatibility (will be refactored to clean architecture)
export { updateUser, updateUserProfileImage } from './api/userService';
