import { create } from 'zustand';

interface LoaderStore {
  isLoading: boolean;
  loadingCount: number;
  showLoader: () => void;
  hideLoader: () => void;
}

export const useLoaderStore = create<LoaderStore>((set) => ({
  isLoading: false,
  loadingCount: 0,
  
  showLoader: () =>
    set((state) => {
      const newCount = state.loadingCount + 1;
      return {
        loadingCount: newCount,
        isLoading: newCount > 0,
      };
    }),
    
  hideLoader: () =>
    set((state) => {
      const newCount = Math.max(0, state.loadingCount - 1);
      return {
        loadingCount: newCount,
        isLoading: newCount > 0,
      };
    }),
}));
