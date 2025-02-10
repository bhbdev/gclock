import React, { ReactNode } from 'react';

interface MainColProps {
    className?: string
    children: ReactNode;
}

const MainCol: React.FC<MainColProps> = ({ children, className }) => {
    return (
      <main className={`${className || 'main'}`}>
          {children}
      </main>
    );
  };
  
  export default MainCol;
  