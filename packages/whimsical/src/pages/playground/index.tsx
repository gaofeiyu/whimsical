import CanvasPanel from '../../components/CanvasPanel';
import Content from '../../components/Content';
import Header from '../../components/Header';
import Layout from '../../components/Layout';
import SettingPanel from '../../components/SettingPanel';
import Sidebar from '../../components/Sidebar';

const Playground = () => {
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
