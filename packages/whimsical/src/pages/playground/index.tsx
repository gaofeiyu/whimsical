import { autorun } from 'mobx';
import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { components, libConfig } from 'whimsical-react';
import CanvasPanel from '../../components/CanvasPanel';
import Content from '../../components/Content';
import Header from '../../components/Header';
import Layout from '../../components/Layout';
import SettingPanel from '../../components/SettingPanel';
import Sidebar from '../../components/Sidebar';
import { editorStore } from '../../store/editorActions';
import { EditorContext } from './EditorContext';

const { componentsDeclare } = libConfig;

const editorContextValue = {
  componentsDeclare,
};

const Playground = () => {
  useEffect(() => {
    const ar = autorun(function () {
      console.log(
        'Completed %s of %s items',
        editorStore.dataSource.storage.editor,
        editorStore.pageDSL.key
      );
    });
    console.log(components);
    return () => {
      ar();
    };
  }, []);
  return (
    <EditorContext.Provider value={editorContextValue}>
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
    </EditorContext.Provider>
  );
};

Playground.displayName = 'Playground';

export default Playground;
