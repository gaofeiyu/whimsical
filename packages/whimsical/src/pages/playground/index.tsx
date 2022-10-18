import { useEffect, useMemo, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CanvasPanel from '../../components/CanvasPanel';
import Content from '../../components/Content';
import Header from '../../components/Header';
import Layout from '../../components/Layout';
import SettingPanel from '../../components/SettingPanel';
import Sidebar from '../../components/Sidebar';
import { WorkbenchContext } from './context';
import WTreeNode from '../../core/WNode';
import { wNodeMock, componentInfoMock } from '../../mock/wNode';
import { EditorHistory } from '../../editor-flow';
import Workbench, { IWorkbenchProps } from '../../core/Workbench';
import LibManager from '../../core/LibManager';
import { loadStatic } from 'whimsical-shared';

const Playground = () => {
  const workbenchProps = useRef<IWorkbenchProps>();
  const [, forceUpdate] = useState({});
  const workbench = useMemo(() => {
    if (workbenchProps.current) {
      return new Workbench(workbenchProps.current);
    }
    return null;
  }, []);
  useEffect(() => {
    const libInfo: LibManager = new LibManager({
      ...componentInfoMock,
    });

    loadStatic({
      resource: libInfo.resource,
      ignoreResource: ['dep', 'component', 'other'],
    }).then(() => {
      console.log(libInfo.resource, window[`${libInfo.name}Editor`]);
      libInfo.componentsDeclare =
        window[`${libInfo.name}Editor`]?.libConfig?.componentsDeclare || {};
    });
    const wTreeNode = new WTreeNode(wNodeMock);
    EditorHistory.registerStore<WTreeNode>(wTreeNode);
    console.log('workbench', wTreeNode, wNodeMock, EditorHistory, libInfo);
    workbenchProps.current = {
      treeNode: wTreeNode,
      wNode: wNodeMock,
      History: EditorHistory,
      libInfo,
    };
    forceUpdate({});
  }, []);
  console.log('workbench', workbench);
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
