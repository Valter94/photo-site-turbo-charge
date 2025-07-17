
import React, { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  mobileClassName = '',
  desktopClassName = ''
}) => {
  const isMobile = useIsMobile();

  const combinedClassName = `
    ${className}
    ${isMobile ? mobileClassName : desktopClassName}
  `.trim();

  return (
    <div className={combinedClassName}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;
