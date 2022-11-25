import { useEffect, useMemo, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ComponentLibInfoType, IWBody, loadStatic } from 'whimsical-shared';
import CanvasPanel from 'src/components/CanvasPanel';
import Content from 'src/components/Content';
import Header from 'src/components/Header';
import Layout from 'src/components/Layout';
import SettingPanel from 'src/components/SettingPanel';
import Sidebar from 'src/components/Sidebar';
import WTreeNode from 'src/core/WNode';
import { EditorHistory } from 'src/editor-flow';
import Workbench, { IWorkbenchProps } from 'src/core/Workbench';
import LibManager from 'src/core/LibManager';
import { generatorComponentsSettingsFormConfig } from 'src/utils/generatorSettingsFormConfig';
import { WorkbenchContext } from './context';
import ImportDSL from './components/ImportDSL';
import ExportDSL from './components/ExportDSL';

type PlaygroundProps = {
  bodySchema: IWBody;
  componentInfo: ComponentLibInfoType;
};

const Playground = (props: PlaygroundProps) => {
  const {
    bodySchema = {
      node: null,
      state: {
        store: {},
        api: {},
      },
    },
    componentInfo,
  } = props;
  const { node, state } = bodySchema;
  const workbenchProps = useRef<IWorkbenchProps>();
  const [ready, setReady] = useState(false);
  const workbench = useMemo(() => {
    if (workbenchProps.current && ready) {
      return new Workbench(workbenchProps.current);
    }
    return null;
  }, [ready]);
  useEffect(() => {
    if (!componentInfo || !componentInfo.name) return;
    const LibInfo: LibManager = new LibManager({
      ...componentInfo,
    });
    const wTreeNode = new WTreeNode(node);
    EditorHistory.registerStore<WTreeNode>(wTreeNode);
    workbenchProps.current = {
      treeNode: wTreeNode,
      node: node,
      state,
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
            <Header>
              <div className="tools-bar">
                <ImportDSL />
                <ExportDSL />
              </div>
            </Header>
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
