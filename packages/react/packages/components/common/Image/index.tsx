import { ImgHTMLAttributes } from 'react';

export const Image = (props: ImgHTMLAttributes<unknown>) => {
  return <img {...props} />;
};

Image.displayName = 'Image';

export default Image;
