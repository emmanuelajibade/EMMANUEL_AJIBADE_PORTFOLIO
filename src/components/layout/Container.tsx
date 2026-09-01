import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  wide?: boolean;
}

export default function Container({ children, wide = false }: ContainerProps) {
  return (
    <div
      className={`mx-auto px-4 sm:px-6 lg:px-8 ${
        wide ? 'max-w-screen-2xl' : 'max-w-7xl'
      }`}
    >
      {children}
    </div>
  );
}