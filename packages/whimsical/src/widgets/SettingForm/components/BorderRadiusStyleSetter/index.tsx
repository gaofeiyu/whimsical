import React from 'react';
import {
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
} from '@ant-design/icons';
import { BoxStyleSetter } from '../BoxStyleSetter';
export interface IBorderRadiusStyleSetterProps {
  value?: string;
  onChange?: (value: string) => void;
}

export const BorderRadiusStyleSetter: React.FC<IBorderRadiusStyleSetterProps> = (props) => {
  return (
    <BoxStyleSetter
      {...props}
      labels={[
        <RadiusUpleftOutlined key="1" />,
        <RadiusUprightOutlined key="2" />,
        <RadiusBottomleftOutlined key="3" />,
        <RadiusBottomrightOutlined key="4" />,
      ]}
    />
  );
};
