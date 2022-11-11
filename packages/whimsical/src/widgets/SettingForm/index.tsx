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
import { settingsSchema } from './defaultSettingsSchema';
import { useMemo } from 'react';
import { useCurrentNode } from 'src/hooks';
import { observer } from 'mobx-react-lite';

export interface ISettingFormProps {
  className?: string;
  style?: React.CSSProperties;
  components?: Record<string, React.FC<unknown>>;
  effects?: (form: FormilyForm) => void;
  scope?: unknown;
}

export const SettingsForm: React.FC<ISettingFormProps> = observer((props) => {
  const node = useCurrentNode();

  const form = useMemo(() => {
    let formReady = false;

    return createForm({
      values: node?.props,
      effects(form) {
        let cache = '';

        onFormInit(() => {
          formReady = false;
          cache = JSON.stringify(form.values);
        });

        onFieldChange('*', () => {
          if (formReady) {
            if (cache !== JSON.stringify(form.values)) {
              cache = JSON.stringify(form.values);
              console.log('form.values', form.values);
              node.updateProps(form.values);
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

  return (
    <>
      {!node ? null : (
        <Form form={form} layout="vertical" size="large">
          <SchemaField schema={settingsSchema} />
        </Form>
      )}
    </>
  );
});
