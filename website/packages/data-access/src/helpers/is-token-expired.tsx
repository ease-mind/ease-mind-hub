import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  const decoded = jwtDecode<{ exp: number }>(token);
  const currentTime = Date.now() / 1000;

  return decoded.exp < currentTime;
};