import type { ReactNode } from 'react';

export const Page = ({ children, backgroundColor, padding, margin }: { children?: ReactNode, backgroundColor?: string, padding?: string, margin?: string }) => {
  return (
    <div
      style={{
        backgroundColor: backgroundColor || '#ffffff',
        padding: padding || '20px',
        margin: margin || '0',
        minHeight: '100%',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {children}
    </div>
  );
};