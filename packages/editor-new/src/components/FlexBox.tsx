import type { ReactNode } from 'react';

export const FlexBox = ({ children, direction, padding, margin, justifyContent, alignItems, border }: { children?: ReactNode, direction?: any, padding?: any, margin?: any, justifyContent?: any, alignItems?: any, border?: any }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction || 'row',
        padding: padding || '10px',
        margin: margin || '0',
        justifyContent: justifyContent || 'flex-start',
        alignItems: alignItems || 'stretch',
        border: border || '1px dashed #ccc',
        minHeight: '50px',
        minWidth: '100px',
      }}
    >
      {children}
    </div>
  );
};