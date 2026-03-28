"use client";

import { create } from "zustand";

import { clearToken, getToken, setToken } from "@/lib/auth";

const useAuthStore = create((set) => ({
  token: null,
  hydrated: false,
  initialize: () => set({ token: getToken(), hydrated: true }),
  login: (token) => {
    setToken(token);
    set({ token, hydrated: true });
  },
  logout: () => {
    clearToken();
    set({ token: null, hydrated: true });
  }
}));

export default useAuthStore;
