import { create } from "zustand";

const useAlertStore = create((set) => ({
  message: false,
  showAlert: () => set({ message: true }),
  hideAlert: () => set({ message: false }),
}));

export default useAlertStore;