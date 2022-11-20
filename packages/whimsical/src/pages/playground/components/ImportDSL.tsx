import { memo, useCallback, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Button, Modal, Upload } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload';
import { IWNode } from 'whimsical-shared';
const { Dragger } = Upload;

type ImportDSLProps = {
  DSL?: IWNode;
  onChangeDSL?: (value: IWNode) => void;
};

const ImportDSL = (props: ImportDSLProps) => {
  const { onChangeDSL = () => null } = props;
  const [isModalVisible, setModalVisible] = useState(false);
  const [importFileName, setImportFileName] = useState<string>('');
  const [importFileDetail, setImportFileDetail] = useState<string>('');

  const uploadProps = {
    name: 'file',

    beforeUpload() {
      return false;
    },

    itemRender() {
      return null;
    },

    onChange(info: UploadChangeParam<UploadFile>) {
      const reader = new FileReader();
      const name = info.file.name;
      reader.onload = (e: ProgressEvent<FileReader>) => {
        setImportFileName(name);
        setImportFileDetail(e.target?.result.toString() || '');
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reader.readAsText(info.file as any);
    },
  };

  const handleImportDSLModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  function handleOk() {
    onChangeDSL(JSON.parse(importFileDetail as string) as IWNode);
    setModalVisible(false);
  }

  function handleCloseModal() {
    setModalVisible(false);
  }

  return (
    <>
      <Button className="mx-2" onClick={handleImportDSLModal}>
        导入
      </Button>
      <Modal title="导入DSL" visible={isModalVisible} onOk={handleOk} onCancel={handleCloseModal}>
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽到此区域进行导入</p>
        </Dragger>
        <h3>{importFileName}</h3>
        <pre>{importFileDetail}</pre>
      </Modal>
    </>
  );
};

ImportDSL.displayName = 'ImportDSL';

export default memo(ImportDSL);
