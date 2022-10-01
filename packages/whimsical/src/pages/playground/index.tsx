import { autorun } from 'mobx';
import { useEffect } from 'react';
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
    return () => {
      ar();
    };
  }, []);
  return (
    <Layout>
      <Header></Header>
      <Content>
        <Sidebar></Sidebar>
        <CanvasPanel></CanvasPanel>
        <SettingPanel></SettingPanel>
      </Content>
    </Layout>
  );
};

Playground.displayName = 'Playground';

export default Playground;
