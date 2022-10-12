import { IComponentDeclare } from 'whimsical-shared';

const declare: IComponentDeclare = {
  name: 'Image',
  cname: '图像',
  icon: 'Image',
  isContainer: false,
  inlineType: true,
  type: 'Common',
  props: {
    alt: {
      type: 'string',
    },
    src: {
      type: 'string',
    },
  },
};

export default declare;
