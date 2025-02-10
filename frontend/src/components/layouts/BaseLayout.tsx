import React, { ReactNode } from 'react';

interface BaseLayoutProps {
  children: ReactNode;
  className?: string;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children, className }) => {
  return (
    <div className={`${className || 'base-layout'}`}>
        {children}
    </div>
  );
};

export default BaseLayout;
