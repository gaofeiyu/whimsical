import { IComponentDeclare } from 'whimsical-shared';

const declare: IComponentDeclare = {
  name: 'Link',
  cname: '链接',
  icon: 'Container',
  type: 'Common',
  props: {
    href: {
      type: 'string',
    },
  },
};

export default declare;
