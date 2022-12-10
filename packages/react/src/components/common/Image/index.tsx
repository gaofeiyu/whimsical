import { ImgHTMLAttributes } from 'react';

const Image = (props: ImgHTMLAttributes<unknown>) => {
  return <img {...props} />;
};

Image.displayName = 'Image';

export default Image;
