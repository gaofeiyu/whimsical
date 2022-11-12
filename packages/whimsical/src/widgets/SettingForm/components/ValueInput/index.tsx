import { createPolyInput } from '../PolyInput';
import { Input, InputNumber, Select } from 'antd';

const STARTTAG_REX =
  /<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;

const EXPRESSION_REX = /^\{\{([\s\S]*)\}\}$/;

const isNumber = (value: any) => typeof value === 'number';

const isBoolean = (value: any) => typeof value === 'boolean';

const isExpression = (value: any) => {
  return typeof value === 'string' && EXPRESSION_REX.test(value);
};

const isRichText = (value: any) => {
  return typeof value === 'string' && STARTTAG_REX.test(value);
};

const isNormalText = (value: any) => {
  return typeof value === 'string' && !isExpression(value) && !isRichText(value);
};

const takeNumber = (value: any) => {
  const num = String(value).replace(/[^\d\.]+/, '');
  if (num === '') return;
  return Number(num);
};

export const ValueInput = createPolyInput([
  {
    type: 'TEXT',
    icon: 'Text',
    component: Input,
    checker: isNormalText,
  },
  {
    type: 'BOOLEAN',
    icon: 'Boolean',
    component: (props: any) => (
      <Select
        {...props}
        options={[
          { label: 'True', value: true },
          { label: 'False', value: false },
        ]}
      />
    ),
    checker: isBoolean,
    toInputValue: (value) => {
      return !!value;
    },
    toChangeValue: (value) => {
      return !!value;
    },
  },
  {
    type: 'NUMBER',
    icon: 'Number',
    component: InputNumber,
    checker: isNumber,
    toInputValue: takeNumber,
    toChangeValue: takeNumber,
  },
]);
