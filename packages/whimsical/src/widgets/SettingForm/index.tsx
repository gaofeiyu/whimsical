import { createForm, onFieldChange, onFormInit, onFormMount } from '@formily/core';
import { Form } from '@formily/antd';
import { SchemaField } from './SchemaField';
import { settingsSchema } from './defaultSettingsSchema';
import { useMemo } from 'react';
import { useCurrentNode } from 'src/hooks';
import { observer } from 'mobx-react-lite';
import { ISettingFormProps } from './types';
import { SettingsFormContext } from './context';
import './index.less';

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
        <SettingsFormContext.Provider value={props}>
          <Form form={form} layout="vertical" size="large">
            <SchemaField schema={settingsSchema} />
          </Form>
        </SettingsFormContext.Provider>
      )}
    </>
  );
});
