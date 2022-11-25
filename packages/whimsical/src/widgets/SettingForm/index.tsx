import { createForm, onFieldChange, onFormInit, onFormMount } from '@formily/core';
import { observer } from 'mobx-react-lite';
import { Form } from '@formily/antd';
import cls from 'classnames';
import { SchemaField } from './SchemaField';
import { settingsSchema } from './defaultSettingsSchema';
import { useEffect, useMemo, useState } from 'react';
import { useCurrentNode, useLibInfo, usePrefix } from 'src/hooks';
import { ISettingFormProps } from './types';
import { SettingsFormContext } from './context';
import './index.less';

export const SettingsForm: React.FC<ISettingFormProps> = observer((props) => {
  const node = useCurrentNode();
  const LibInfo = useLibInfo();
  const [, focusUpdate] = useState({});
  const prefix = usePrefix('settings-form');

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

  useEffect(() => {
    if (node?.name) {
      settingsSchema.properties.properties.properties =
        LibInfo.componentsSettingsFormConfig[node.name] || {};
      console.log('settingsSchema.properties.properties', settingsSchema.properties.properties);
      focusUpdate({});
    }
  }, [node, LibInfo.componentsSettingsFormConfig]);

  return (
    <>
      {!node ? null : (
        <div className={cls(prefix + '-wrapper')}>
          <div className={prefix + '-content'}>
            <SettingsFormContext.Provider value={props}>
              <Form
                className="p-4"
                form={form}
                labelAlign="left"
                wrapperAlign="right"
                feedbackLayout="none"
                tooltipLayout="text"
                colon={false}
                labelWidth={120}
              >
                <SchemaField schema={settingsSchema} />
              </Form>
            </SettingsFormContext.Provider>
          </div>
        </div>
      )}
    </>
  );
});