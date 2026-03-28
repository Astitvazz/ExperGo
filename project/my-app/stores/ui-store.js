"use client";

import { create } from "zustand";

const useUIStore = create((set) => ({
  isSidebarOpen: false,
  isProfileMenuOpen: false,
  alert: null,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openProfileMenu: () => set({ isProfileMenuOpen: true }),
  closeProfileMenu: () => set({ isProfileMenuOpen: false }),
  toggleProfileMenu: () =>
    set((state) => ({ isProfileMenuOpen: !state.isProfileMenuOpen })),
  showAlert: (alert) => set({ alert }),
  hideAlert: () => set({ alert: null })
}));

export default useUIStore;
