export interface AuthEntity {
  user: {
    _id: string;
    name: string;
    email: string;
    document?: string;
    image?: string;
  };
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  document?: string;
}
