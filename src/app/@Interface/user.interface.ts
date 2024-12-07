export interface User {
  username: string;
  password: string;
}

export interface tokenPayload {
  username: string;
  role: string;
}

export interface LoginResponseInterface {
  message: string;
  token: string;
  tokenExpiresIn: number;
  userData: tokenPayload;
}
