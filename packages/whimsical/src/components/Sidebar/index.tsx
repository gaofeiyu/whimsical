import { Menu, MenuProps } from 'antd';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import Panel from '../Panel';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}
const items: MenuItem[] = [
  getItem('Option 1', '1', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />),
  getItem('Option 3', '3', <ContainerOutlined />),
  getItem('Navigation One', '4', <MailOutlined />),
  getItem('Navigation Two', '5', <AppstoreOutlined />),
];

const Sidebar = () => {
  return (
    <div className="flex">
      <Menu
        className="h-full"
        defaultSelectedKeys={['1']}
        mode="inline"
        items={items}
        inlineCollapsed={true}
      />
      <Panel title="标题示例">test</Panel>
    </div>
  );
};

Sidebar.displayName = 'Sidebar';

export default Sidebar;
