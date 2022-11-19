import { Menu, MenuProps } from 'antd';
import { HistoryOutlined, BuildOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { EDITOR_EVENTS$ } from 'src/editor-flow';
import EditorHistory from '../EditorHistory';
import ComponentList from 'src/widgets/ComponentList';
import SidebarContent from './SidebarContent';
import { MenuItemType } from 'antd/lib/menu/hooks/useItems';

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
];

const Sidebar = () => {
  const [selectKey, setSelectKey] = useState('0');
  const [showPanel, setShowPanel] = useState(true);

  useEffect(() => {
    const triggerButton = EDITOR_EVENTS$.on('triggerButton1', () => {
      console.log('Sidebar trigger editorObservable');
    });

    return () => {
      triggerButton();
    };
  }, []);

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

  const sidebarContentChildren = useMemo(() => {
    return [<ComponentList />, <EditorHistory />];
  }, []);

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
          {sidebarContentChildren}
        </SidebarContent>
      </div>
    </div>
  );
};

Sidebar.displayName = 'Sidebar';

export default Sidebar;
