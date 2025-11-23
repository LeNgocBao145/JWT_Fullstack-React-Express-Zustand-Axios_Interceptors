import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeState } from "@/types/Store";

const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            isDark: false,
            toggleTheme: () => {
                const newValue = !get().isDark;
                get().setTheme(newValue);
                if(newValue) {
                    document.documentElement.classList.add('dark');
                }else{
                    document.documentElement.classList.remove('dark');
                }
            },
            setTheme: (dark: boolean) => {
                set({isDark: dark});
                if(dark) {
                    document.documentElement.classList.add('dark');
                }else{
                    document.documentElement.classList.remove('dark');
                }
            }
        }),
        {
            name: "theme-storage"
        }
    )
);

export default useThemeStore;