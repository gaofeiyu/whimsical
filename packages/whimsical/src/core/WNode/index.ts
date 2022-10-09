import { IWNode } from './type';

class WNode implements IWNode {
  id: string;
  name: string;
  constructor(value: IWNode) {
    return value;
  }
}

export default WNode;
