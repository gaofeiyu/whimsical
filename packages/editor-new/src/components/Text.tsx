
export const Text = ({ content, color, fontSize, fontWeight, textAlign }: any) => {
  return (
    <span
      style={{
        color: color || '#333',
        fontSize: fontSize || '14px',
        fontWeight: fontWeight || 'normal',
        textAlign: textAlign || 'left',
        display: 'inline-block',
        width: '100%'
      }}
    >
      {content || 'Some text'}
    </span>
  );
};