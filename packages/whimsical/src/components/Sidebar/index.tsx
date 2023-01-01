import { Menu } from 'antd';
import { MenuItemType } from 'antd/lib/menu/hooks/useItems';
import { HistoryOutlined, BuildOutlined, CodeOutlined } from '@ant-design/icons';
import { useCallback, useMemo, useState } from 'react';
import EditorHistory from '../EditorHistory';
import ComponentList from 'src/widgets/ComponentList';
import SidebarContent from './SidebarContent';
import DSLEditor from '../DSLEditor';

function getItem(title?: string, key?: React.Key, icon?: React.ReactNode): MenuItemType {
  return {
    key,
    icon,
    title,
  };
}
const items: MenuItemType[] = [
  getItem('组件列表', '0', <BuildOutlined />),
  getItem('历史', '1', <HistoryOutlined />),
  getItem('编辑', '2', <CodeOutlined />),
];

const Sidebar = () => {
  const [selectKey, setSelectKey] = useState('0');
  const [showPanel, setShowPanel] = useState(true);

  const selectIndex = useMemo(() => {
    let result = 0;
    items.find((item, index) => {
      if (item.key === selectKey) {
        result = index;
        return true;
      }
    });
    return result;
  }, [selectKey]);

  const onChangeMenu = useCallback(
    ({ key }) => {
      if (key === selectKey) {
        setShowPanel(!showPanel);
      } else {
        setShowPanel(true);
      }
      setSelectKey(key);
    },
    [selectKey, showPanel]
  );

  return (
    <div className="flex relative">
      <Menu
        className="h-full"
        defaultSelectedKeys={[selectKey]}
        mode="inline"
        items={items}
        inlineCollapsed={true}
        onClick={onChangeMenu}
      />
      <div className={showPanel ? 'block' : 'hidden'}>
        <SidebarContent
          index={selectIndex}
          title={items[selectIndex].title}
          onClose={() => setShowPanel(false)}
        >
          <ComponentList />
          <EditorHistory />
          <DSLEditor value="" />
        </SidebarContent>
      </div>
    </div>
  );
};

Sidebar.displayName = 'Sidebar';

export default Sidebar;
