import { useHistory } from '../../utils/HistoryRecorder';
import { EDITOR_HISTORY } from '../../editor-flow';
import { Button } from 'antd';
import { useCallback } from 'react';

const EditorHistory = () => {
  const [history] = useHistory(EDITOR_HISTORY);
  console.log('EditorHistory history', history);

  const handleGoto = useCallback((index) => {
    EDITOR_HISTORY.goto(index);
  }, []);

  return (
    <div className="flex flex-col">
      {history.map((item, index) => {
        return (
          <Button
            key={item.id}
            type={item.executed ? 'text' : 'default'}
            onClick={() => {
              handleGoto(index);
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
