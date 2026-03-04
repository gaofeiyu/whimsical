export interface JSONNode {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: JSONNode[];
}

export const createInitialState = (): JSONNode => ({
  id: 'root',
  type: 'Page',
  props: {
    backgroundColor: '#ffffff',
    padding: '24px',
    margin: '0',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  children: [
    {
      id: crypto.randomUUID(),
      type: 'Text',
      props: {
        content: 'Welcome to the AI-Native Low Code Editor!',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333'
      }
    },
    {
      id: crypto.randomUUID(),
      type: 'Text',
      props: {
        content: 'Try typing a prompt in the chat, or edit the code directly.',
        fontSize: '14px',
        color: '#666'
      }
    }
  ]
});
