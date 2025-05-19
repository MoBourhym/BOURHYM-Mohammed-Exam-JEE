export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  roles: string[];
  accessToken: string;
  tokenType: string;
  refreshToken?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  roles?: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export enum Role {
  CLIENT = 'ROLE_CLIENT',
  EMPLOYEE = 'ROLE_EMPLOYE',
  ADMIN = 'ROLE_ADMIN'
}

export interface JwtPayload {
  sub: string; // subject (username)
  roles: string[];
  iat: number; // issued at
  exp: number; // expiration time
}
