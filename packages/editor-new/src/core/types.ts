export interface JSONNode {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: JSONNode[];
  text?: string;
}

export const createInitialState = (): JSONNode => ({
  id: 'root',
  type: 'div',
  props: {
    style: {
      backgroundColor: '#ffffff',
      padding: '24px',
      margin: '0',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }
  },
  children: [
    {
      id: crypto.randomUUID(),
      type: 'h1',
      props: {},
      text: 'Welcome to the AI-Native Vue + Element Plus Editor!'
    },
    {
      id: crypto.randomUUID(),
      type: 'p',
      props: {
        style: { color: '#666' }
      },
      text: 'Try typing a prompt in the chat, or edit the Vue template directly.'
    },
    {
       id: crypto.randomUUID(),
       type: 'el-button',
       props: {
         type: 'primary',
       },
       text: 'Primary Button'
    }
  ]
});
