import api from "@/lib/axios";

const authService = {
  signUp: async (
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string
  ) => {
    try {        
        const res = await api.post(
          "/auth/signup",
          { username, password, email, firstName, lastName },
          { withCredentials: true }
        );
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
  },

  signIn: async (
    username: string,
    password: string
  ) => {
    try {        
        const res = await api.post(
          "/auth/signin",
          { username, password },
          { withCredentials: true }
        );
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
  },

  signOut: async () => {
    try {        
        const res = await api.post(
          "/auth/signout",
          {},
          { withCredentials: true }
        );
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
  },
};

export default authService;