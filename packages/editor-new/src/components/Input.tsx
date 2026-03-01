
export const Input = ({ placeholder, width, padding, border }: any) => {
  return (
    <input
      placeholder={placeholder || 'Enter text...'}
      style={{
        width: width || '100%',
        padding: padding || '8px',
        border: border || '1px solid #d9d9d9',
        borderRadius: '4px',
      }}
    />
  );
};