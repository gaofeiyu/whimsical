import {
  createForm,
  onFieldChange,
  onFormInit,
  onFormMount,
  Form as FormilyForm,
} from '@formily/core';
import { Form } from '@formily/antd';
import { SchemaField } from './SchemaField';
import './index.less';
import { mockSchema } from './mock';
import { useMemo } from 'react';
import { useCurrentNode } from 'src/hooks';
import { observer } from 'mobx-react-lite';

const normalSchema = mockSchema;

export interface ISettingFormProps {
  className?: string;
  style?: React.CSSProperties;
  components?: Record<string, React.FC<unknown>>;
  effects?: (form: FormilyForm) => void;
  scope?: unknown;
}

export const SettingsForm: React.FC<ISettingFormProps> = observer((props) => {
  const node = useCurrentNode();
  console.log('SettingsForm', node);

  const form = useMemo(() => {
    let formReady = false;

    return createForm({
      values: node?.props,
      effects(form) {
        let cache = '';

        onFormInit(() => {
          formReady = false;
          cache = JSON.stringify(node?.props);
        });

        onFieldChange('*', () => {
          if (formReady) {
            if (cache !== JSON.stringify(node.props)) {
              cache = JSON.stringify(node.props);
            }
          }
        });

        onFormMount(() => {
          formReady = true;
        });

        props.effects?.(form);
      },
    });
  }, [node, node?.props]);

  console.log(form);

  return (
    <>
      {!node ? null : (
        <Form form={form} layout="vertical" size="large">
          <SchemaField schema={normalSchema} />
        </Form>
      )}
    </>
  );
});
