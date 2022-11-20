import { memo, useCallback } from 'react';
import { Button, Modal } from 'antd';
import { useWorkbenchDSL } from 'src/hooks';
import downloadFileByString from 'src/utils/downloadFileByString';

const ExportDSL = () => {
  const DSL = useWorkbenchDSL();
  const handleExportDSL = useCallback(() => {
    Modal.confirm({
      content: '是否确认导出DSL，导出的DSL将以JSON格式呈现',
      onOk: function () {
        const type = 'text/json';
        const json = JSON.stringify(DSL, null, 2);
        const blob = new Blob([json], { type });
        downloadFileByString(blob, 'dsl.json', type);
      },
    });
  }, []);

  return (
    <Button className="mx-2" onClick={handleExportDSL}>
      导出
    </Button>
  );
};

ExportDSL.displayName = 'ExportDSL';

export default memo(ExportDSL);
