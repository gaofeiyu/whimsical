import { useHistory } from '../../utils/HistoryManagement';
import { EDITOR_HISTORY } from '../../editor-flow';
import { Button } from 'antd';
import { useCallback } from 'react';

const EditorHistory = () => {
  const [history] = useHistory(EDITOR_HISTORY);
  console.log('EditorHistory history', history);

  const onBack = useCallback((index) => {
    EDITOR_HISTORY.backTo(index);
  }, []);

  return (
    <div className="flex flex-col">
      {history.map((item, index) => {
        return (
          <Button
            key={item.id}
            disabled={!item.executed}
            onClick={() => {
              onBack(index);
            }}
          >
            {item.eventName}
          </Button>
        );
      })}
    </div>
  );
};

EditorHistory.displayName = 'EditorHistory';

export default EditorHistory;
