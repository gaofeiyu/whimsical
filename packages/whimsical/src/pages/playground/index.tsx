import CanvasPanle from '../../components/CanvasPanle';
import Content from '../../components/Content';
import Header from '../../components/Header';
import Layout from '../../components/Layout';
import SettingPanle from '../../components/SettingPanle';
import Sidebar from '../../components/Sidebar';

const Playground = () => {
  return (
    <Layout>
      <Header></Header>
      <Content>
        <Sidebar></Sidebar>
        <CanvasPanle></CanvasPanle>
        <SettingPanle></SettingPanle>
      </Content>
    </Layout>
  );
};

Playground.displayName = 'Playground';

export default Playground;
