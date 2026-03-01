
export const Button = ({ text, color, backgroundColor, padding, onClick }: any) => {
  return (
    <button
      style={{
        color: color || '#fff',
        backgroundColor: backgroundColor || '#1890ff',
        padding: padding || '8px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      {text || 'Button'}
    </button>
  );
};