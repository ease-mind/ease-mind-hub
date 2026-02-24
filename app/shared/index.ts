export { api, API_CONFIG, setAuthToken, getBaseURL } from './config/api';
export { authService } from './services/authService';
export type { LoginCredentials, RegisterData, User, AuthResponse } from './services/authService';
export { AuthProvider, useAuth } from './contexts';
