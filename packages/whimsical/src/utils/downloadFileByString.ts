const downloadFileByString = (blob: Blob, filename: string, fileType: string): void => {
  const e = document.createEvent('MouseEvents');
  const a = document.createElement('a');
  a.download = filename;
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
  e.initMouseEvent(
    'click',
    true,
    false,
    window,
    0,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null
  );
  a.dispatchEvent(e);
};

export default downloadFileByString;
