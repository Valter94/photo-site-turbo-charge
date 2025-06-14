
// Safe localStorage access
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Silently fail in iframe/preview mode
    }
  }
};

// Safe sessionStorage access
export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // Silently fail in iframe/preview mode
    }
  }
};

export const getOrCreateSessionId = () => {
  let sessionId = safeSessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    safeSessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

export const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  let deviceType = 'desktop';
  
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    deviceType = 'tablet';
  } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
    deviceType = 'mobile';
  }
  
  return { type: deviceType };
};

export const getStoredPageViews = () => {
  try {
    return JSON.parse(safeLocalStorage.getItem('page_views') || '[]');
  } catch {
    return [];
  }
};

export const getStoredErrors = () => {
  try {
    return JSON.parse(safeLocalStorage.getItem('site_errors') || '[]');
  } catch {
    return [];
  }
};
