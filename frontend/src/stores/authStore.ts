import authService from "@/services/authService";
import { toast } from "sonner";
import { create } from "zustand";
import type { AuthState } from "@/types/Store";

const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  clearState: () => {
    set({accessToken: null, user: null, loading: false});
  },

  signUp: async (
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    password: string
  ) => {
    try {        
        set({ loading: true });
        await authService.signUp(
          firstname,
          lastname,
          username,
          email,
          password
        );
        toast.success("Sign up successfully! You will be redirected to sign in page.");
    } catch (error) {
        console.error(error);
        toast.error("Error signing up");
    } finally {
        set({ loading: false });
    }
  },

  signIn: async (username: string, password: string) => {
    try {
        set({ loading: true });   
        const {accessToken} = await authService.signIn(username, password);
        set({accessToken: accessToken});
        toast.success("Welcome to Moji!");
    } catch (error) {
        console.error(error);
        toast.error("Error signing in");
    } finally {
        set({ loading: false });
    }
  },

  signOut: async () => {
    try {
        await authService.signOut();
        set({accessToken: null, user: null, loading: false});
        toast.success("Signed out successfully");
    } catch (error) {
        console.error(error);
        toast.error("Error signing out");
    }
  }
}));

export default useAuthStore;