
export const Button = ({ text, children, color, backgroundColor, padding, onClick, ...rest }: any) => {
  return (
    <button
      {...rest}
      style={{
        color: color || '#fff',
        backgroundColor: backgroundColor || '#1890ff',
        padding: padding || '8px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        ...rest.style
      }}
      onClick={onClick}
    >
      {children || text || 'Button'}
    </button>
  );
};