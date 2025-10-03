import { useEffect } from 'react';
import { useLoaderStore } from '@/stores/useLoaderStore';

/**
 * Hook to show/hide the global loader for a page or component
 * @param isLoading - Boolean to control the loader state
 */
export const usePageLoader = (isLoading: boolean) => {
  const { showLoader, hideLoader } = useLoaderStore();

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }

    // Cleanup on unmount
    return () => {
      hideLoader();
    };
  }, [isLoading, showLoader, hideLoader]);
};
