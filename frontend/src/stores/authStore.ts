import authService from "@/services/authService";
import { toast } from "sonner";
import { create } from "zustand";
import type { AuthState } from "@/types/Store";
import { persist } from "zustand/middleware";
import useChatStore from "./chatStore";

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,

      clearState: () => {
        set({ accessToken: null, user: null, loading: false });
        localStorage.clear();
        useChatStore.getState().reset();
      },

      setAccessToken: (newAccessToken: string) => {
        set({ accessToken: newAccessToken });
      },

      signUp: async (
        firstName: string,
        lastName: string,
        username: string,
        email: string,
        password: string
      ) => {
        try {
          set({ loading: true });
          await authService.signUp(
            firstName,
            lastName,
            username,
            email,
            password
          );
          toast.success(
            "Sign up successfully! You will be redirected to sign in page."
          );
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

          localStorage.clear();
          useChatStore.getState().reset();

          const { accessToken } = await authService.signIn(username, password);
          set({ accessToken: accessToken });

          await get().fetchMe();
          useChatStore.getState().fetchConversations();
          
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
          set({ accessToken: null, user: null, loading: false });
          toast.success("Signed out successfully");
        } catch (error) {
          console.error(error);
          toast.error("Error signing out");
        }
      },

      fetchMe: async () => {
        try {
          set({ loading: true });
          const user = await authService.fetchMe();
          set({ user });
        } catch (error) {
          console.error(error);
          toast.error("Error fetching data from database!");
        } finally {
          set({ loading: false });
        }
      },

      refresh: async () => {
        try {
          set({ loading: true });
          const { user, fetchMe } = get();
          const { accessToken } = await authService.refresh();
          set({ accessToken });

          if (!user) {
            await fetchMe();
          }
        } catch (error) {
          console.error(error);
          toast.error("Login session is expired, please sign in again!!");
          get().clearState();
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      // partialize indicates that you just allow neccessary state you choose to store in local storage
      partialize: (state) => ({user: state.user}),
    }
  )
);

export default useAuthStore;
