import { IComponentDeclare } from 'whimsical-shared';

const declare: IComponentDeclare = {
  name: 'Text',
  cname: '文字',
  icon: 'Text',
  isContainer: false,
  inlineType: true,
  type: 'Common',
  props: {
    content: {
      type: 'string',
    },
  },
};

export default declare;
