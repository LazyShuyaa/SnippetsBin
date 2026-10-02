import { useEffect, useState } from 'react';
import { subscribeApiStatus, isDemoMode } from './api';

/** React hook that reports whether the app is running against the local demo store. */
export function useApiMode() {
  const [demo, setDemo] = useState(() => isDemoMode());

  useEffect(() => {
    // Sync in case the fallback happened before this component mounted.
    setDemo(isDemoMode());
    return subscribeApiStatus((isDemo) => setDemo(isDemo));
  }, []);

  return { demo };
}

export default useApiMode;
