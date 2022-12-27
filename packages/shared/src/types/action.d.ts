import { IPropsGeneratorOptions, IWActionExpression } from '.';

export enum ACTION_RESPONSE_STATUS {
  SUCCESS = 'success',
  FAIL = 'fail',
  FINALLY = 'finally',
}

export interface IActionResponse {
  type: 'Action';
  name: string;
  status: ACTION_RESPONSE_STATUS;
  target: IWActionExpression;
  options: IPropsGeneratorOptions;
  value: unknown;
}
