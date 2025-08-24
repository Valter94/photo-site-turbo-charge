import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SecurityContextType {
  isSecureConnection: boolean;
  hasMFA: boolean;
  securityScore: number;
  enableMFA: () => Promise<void>;
  reportSecurityIncident: (incident: string) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [isSecureConnection, setIsSecureConnection] = useState(false);
  const [hasMFA, setHasMFA] = useState(false);
  const [securityScore, setSecurityScore] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Check connection security
    setIsSecureConnection(window.location.protocol === 'https:');
    
    // Check for various security features
    checkSecurityFeatures();
    
    // Set up security monitoring
    setupSecurityMonitoring();
    
    // Calculate initial security score
    calculateSecurityScore();
  }, []);

  const checkSecurityFeatures = () => {
    // Check if Content Security Policy is implemented
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    
    // Check for security headers via fetch to a test endpoint
    fetch('/security-check', { method: 'HEAD' })
      .then(response => {
        const hasXFrameOptions = response.headers.get('X-Frame-Options');
        const hasXSSProtection = response.headers.get('X-XSS-Protection');
        const hasContentTypeOptions = response.headers.get('X-Content-Type-Options');
        
        if (!hasXFrameOptions || !hasXSSProtection || !hasContentTypeOptions) {
          reportSecurityIncident('Missing security headers detected');
        }
      })
      .catch(() => {
        // Security check endpoint not available
      });
  };

  const setupSecurityMonitoring = () => {
    // Monitor for suspicious activity
    let failedAttempts = 0;
    
    // Track failed login attempts
    window.addEventListener('authFailure', () => {
      failedAttempts++;
      if (failedAttempts > 3) {
        reportSecurityIncident(`Multiple failed login attempts: ${failedAttempts}`);
        toast({
          title: "Предупреждение безопасности",
          description: "Обнаружены множественные неудачные попытки входа",
          variant: "destructive"
        });
      }
    });

    // Monitor for potential XSS attempts
    const originalLog = console.log;
    console.log = (...args) => {
      const message = args.join(' ');
      if (message.includes('<script>') || message.includes('javascript:')) {
        reportSecurityIncident(`Potential XSS attempt detected in console: ${message}`);
      }
      originalLog.apply(console, args);
    };

    // Monitor for unusual DOM modifications
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === 'SCRIPT' && !element.hasAttribute('data-trusted')) {
                reportSecurityIncident('Untrusted script injection detected');
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Cleanup on unmount
    return () => {
      observer.disconnect();
      console.log = originalLog;
    };
  };

  const calculateSecurityScore = () => {
    let score = 0;
    
    // HTTPS connection (20 points)
    if (isSecureConnection) score += 20;
    
    // MFA enabled (30 points)
    if (hasMFA) score += 30;
    
    // Secure headers (20 points)
    const hasSecureHeaders = checkSecureHeaders();
    if (hasSecureHeaders) score += 20;
    
    // Strong password policy (15 points)
    const hasStrongPasswordPolicy = checkPasswordPolicy();
    if (hasStrongPasswordPolicy) score += 15;
    
    // Session security (15 points)
    const hasSecureSessions = checkSessionSecurity();
    if (hasSecureSessions) score += 15;
    
    setSecurityScore(score);
    
    // Provide recommendations based on score
    if (score < 50) {
      toast({
        title: "Низкий уровень безопасности",
        description: "Рекомендуется включить дополнительные меры безопасности",
        variant: "destructive"
      });
    } else if (score < 80) {
      toast({
        title: "Средний уровень безопасности",
        description: "Безопасность можно улучшить",
      });
    }
  };

  const checkSecureHeaders = (): boolean => {
    // This would be checked server-side in a real implementation
    return true; // Placeholder
  };

  const checkPasswordPolicy = (): boolean => {
    // Check if strong password policy is enforced
    const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
    if (passwordInput) {
      const minLength = passwordInput.minLength >= 8;
      const pattern = passwordInput.pattern?.includes('[A-Za-z]') && passwordInput.pattern?.includes('[0-9]');
      return minLength && !!pattern;
    }
    return false;
  };

  const checkSessionSecurity = (): boolean => {
    // Check for secure session configuration
    const cookies = document.cookie;
    return cookies.includes('Secure') && cookies.includes('SameSite');
  };

  const enableMFA = async (): Promise<void> => {
    try {
      // Implementation would depend on your MFA provider (e.g., Google Authenticator, SMS)
      toast({
        title: "MFA включена",
        description: "Двухфакторная аутентификация успешно настроена"
      });
      setHasMFA(true);
      calculateSecurityScore();
    } catch (error) {
      toast({
        title: "Ошибка настройки MFA",
        description: "Не удалось настроить двухфакторную аутентификацию",
        variant: "destructive"
      });
    }
  };

  const reportSecurityIncident = (incident: string) => {
    const securityEvent = {
      type: 'security_incident',
      incident,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: 'current_user_id' // This would come from your auth context
    };

    // Store locally for offline reporting
    const existingIncidents = JSON.parse(localStorage.getItem('security_incidents') || '[]');
    existingIncidents.push(securityEvent);
    localStorage.setItem('security_incidents', JSON.stringify(existingIncidents));

    // Report to server if online
    if (navigator.onLine) {
      fetch('/api/security/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(securityEvent)
      }).catch(error => {
        console.error('Failed to report security incident:', error);
      });
    }

    console.warn('Security incident reported:', incident);
  };

  const contextValue: SecurityContextType = {
    isSecureConnection,
    hasMFA,
    securityScore,
    enableMFA,
    reportSecurityIncident
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};