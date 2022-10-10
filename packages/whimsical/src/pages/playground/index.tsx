import { autorun } from 'mobx';
import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { components } from 'whimsical-react';
import CanvasPanel from '../../components/CanvasPanel';
import Content from '../../components/Content';
import Header from '../../components/Header';
import Layout from '../../components/Layout';
import SettingPanel from '../../components/SettingPanel';
import Sidebar from '../../components/Sidebar';
import { editorStore } from '../../store/editorActions';

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
    <DndProvider backend={HTML5Backend}>
      <Layout>
        <Header></Header>
        <Content>
          <Sidebar></Sidebar>
          <CanvasPanel></CanvasPanel>
          <SettingPanel></SettingPanel>
        </Content>
      </Layout>
    </DndProvider>
  );
};

Playground.displayName = 'Playground';

export default Playground;
