import { create } from "zustand";

const useAuthStore = create((set) => {
    const userInfo = localStorage.getItem("user-info");
    const user = userInfo ? JSON.parse(userInfo) : null;

    return {
        user: user,
        login: (user) => set({ user }),
        logout: () => set({ user: null }),
        setUser: (user) => set({ user }),
    };
});

export default useAuthStore;
