import { Menu, MenuProps } from 'antd';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import Panel from '../Panel';
import { useState } from 'react';

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
  const [selectKey, setSelectKey] = useState('1');
  const [showPanel, setShowPanel] = useState(true);
  return (
    <div className="flex">
      <Menu
        className="h-full"
        defaultSelectedKeys={[selectKey]}
        mode="inline"
        items={items}
        inlineCollapsed={true}
        onClick={({ key }) => {
          if (!showPanel) {
            setShowPanel(true);
          }
          if (key === selectKey && showPanel) {
            setShowPanel(false);
          }
          setSelectKey(key);
        }}
      />
      {showPanel ? <Panel title="标题示例">{selectKey}</Panel> : null}
    </div>
  );
};

Sidebar.displayName = 'Sidebar';

export default Sidebar;
