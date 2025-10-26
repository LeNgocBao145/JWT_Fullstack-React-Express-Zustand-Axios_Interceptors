import type { User } from "./User"; 

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  clearState: () => void;

  signUp: (
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    password: string
  ) => Promise<void>;

  signIn: (
    userName: string,
    password: string
  ) => Promise<void>;

  signOut: () => Promise<void>;
};
