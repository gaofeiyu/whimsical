import { useEffect, useMemo, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CanvasPanel from 'src/components/CanvasPanel';
import Content from 'src/components/Content';
import Header from 'src/components/Header';
import Layout from 'src/components/Layout';
import SettingPanel from 'src/components/SettingPanel';
import Sidebar from 'src/components/Sidebar';
import { WorkbenchContext } from './context';
import WTreeNode from 'src/core/WNode';
import { wNodeMock, componentInfoMock } from 'src/mock/wNode';
import { EditorHistory } from 'src/editor-flow';
import Workbench, { IWorkbenchProps } from 'src/core/Workbench';
import LibManager from 'src/core/LibManager';
import { IComponentDeclare, IComponentDeclareProp, loadStatic } from 'whimsical-shared';
import { ISchema } from '@formily/react';

// 根据组件的属性描述，获取属性操作菜单配置
const getComponentPropsFormItem = (
  props: Record<string, IComponentDeclareProp>
): Record<string, ISchema> => {
  const componentPropKeys = Object.keys(props);
  return componentPropKeys.reduce((formProperties, key) => {
    const { component = 'Input', type, ...propConfig } = props[key];
    formProperties[`props.${key}`] = {
      type,
      'x-component': component,
      ...propConfig,
    };
    return formProperties;
  }, {});
};

const generatorComponentsSettingsFormConfig = (componentsDeclare: IComponentDeclare) => {
  const componentNames = Object.keys(componentsDeclare);

  return componentNames.reduce((config, name) => {
    const componentDeclare = componentsDeclare[name];
    config[name] = getComponentPropsFormItem(componentDeclare.props);
    return config;
  }, {});
};

const Playground = () => {
  const workbenchProps = useRef<IWorkbenchProps>();
  const [ready, setReady] = useState(false);
  const workbench = useMemo(() => {
    if (workbenchProps.current && ready) {
      return new Workbench(workbenchProps.current);
    }
    return null;
  }, [ready]);
  useEffect(() => {
    const LibInfo: LibManager = new LibManager({
      ...componentInfoMock,
    });
    const wTreeNode = new WTreeNode(wNodeMock);
    EditorHistory.registerStore<WTreeNode>(wTreeNode);
    workbenchProps.current = {
      treeNode: wTreeNode,
      wNode: wNodeMock,
      History: EditorHistory,
      LibInfo,
    };
    setReady(true);

    loadStatic({
      resource: LibInfo.resource,
      ignoreResource: ['component', 'other'],
    }).then(() => {
      const lib = window[`${LibInfo.name}`].default || window[`${LibInfo.name}`];
      if (!lib) return;
      LibInfo.componentsDeclare = lib?.editor?.libConfig?.componentsDeclare || {};
      LibInfo.componentsSettingsFormConfig = generatorComponentsSettingsFormConfig(
        LibInfo.componentsDeclare
      );
      LibInfo.engine = lib?.editor;
    });
  }, []);
  return (
    <>
      {workbench ? (
        <WorkbenchContext.Provider value={workbench}>
          <Layout>
            <Header></Header>

            <DndProvider backend={HTML5Backend}>
              <Content>
                <Sidebar></Sidebar>
                <CanvasPanel></CanvasPanel>
                <SettingPanel></SettingPanel>
              </Content>
            </DndProvider>
          </Layout>
        </WorkbenchContext.Provider>
      ) : null}
    </>
  );
};

Playground.displayName = 'Playground';

export default Playground;
