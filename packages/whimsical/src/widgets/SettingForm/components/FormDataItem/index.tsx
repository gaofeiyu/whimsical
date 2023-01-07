import React, { useLayoutEffect, useRef, useState, useContext, useCallback, useMemo } from 'react';
import cls from 'classnames';
import { isVoidField, ObjectField } from '@formily/core';
import { connect, mapProps, useField } from '@formily/react';
import { useGridSpan, useFormLayout, FormLayoutShallowContext } from '@formily/antd';
import { Tooltip, Popover, ConfigProvider, Button } from 'antd';
import {
  QuestionCircleOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ApiOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useCurrentNode, useWorkbench } from 'src/hooks';
import { isObject } from 'whimsical-shared';

export interface IFormDataItemProps {
  children?: React.ReactNode;
  valueType?: string;
  className?: string;
  style?: React.CSSProperties;
  prefixCls?: string;
  label?: React.ReactNode;
  colon?: boolean;
  tooltip?: React.ReactNode;
  tooltipIcon?: React.ReactNode;
  layout?: 'vertical' | 'horizontal' | 'inline';
  tooltipLayout?: 'icon' | 'text';
  labelStyle?: React.CSSProperties;
  labelAlign?: 'left' | 'right';
  labelWrap?: boolean;
  labelWidth?: number | string;
  wrapperWidth?: number | string;
  labelCol?: number;
  wrapperCol?: number;
  wrapperAlign?: 'left' | 'right';
  wrapperWrap?: boolean;
  wrapperStyle?: React.CSSProperties;
  fullness?: boolean;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  size?: 'small' | 'default' | 'large';
  inset?: boolean;
  extra?: React.ReactNode;
  feedbackText?: React.ReactNode;
  feedbackLayout?: 'loose' | 'terse' | 'popover' | 'none' | (string & Record<string, string>);
  feedbackStatus?: 'error' | 'warning' | 'success' | 'pending' | (string & Record<string, string>);
  feedbackIcon?: React.ReactNode;
  asterisk?: boolean;
  gridSpan?: number;
  bordered?: boolean;
  nodeWithErrorData?: boolean; //节点数据是否错误
}

const usePrefixCls = (
  tag?: string,
  props?: {
    prefixCls?: string;
  }
) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  return getPrefixCls(tag, props?.prefixCls);
};

const pickDataProps = (props: any = {}) => {
  return Object.keys(props).reduce((buf, key) => {
    if (key.includes('data-')) {
      buf[key] = props[key];
    }
    return buf;
  }, {});
};

type ComposeFormItem = React.FC<IFormDataItemProps> & {
  BaseItem?: React.FC<IFormDataItemProps>;
};

const useFormItemLayout = (props: IFormDataItemProps) => {
  const layout = useFormLayout();
  return {
    ...props,
    layout: props.layout ?? layout.layout ?? 'horizontal',
    colon: props.colon ?? layout.colon,
    labelAlign:
      layout.layout === 'vertical'
        ? props.labelAlign ?? layout.labelAlign ?? 'left'
        : props.labelAlign ?? layout.labelAlign ?? 'right',
    labelWrap: props.labelWrap ?? layout.labelWrap,
    labelWidth: props.labelWidth ?? layout.labelWidth,
    wrapperWidth: props.wrapperWidth ?? layout.wrapperWidth,
    labelCol: props.labelCol ?? layout.labelCol,
    wrapperCol: props.wrapperCol ?? layout.wrapperCol,
    wrapperAlign: props.wrapperAlign ?? layout.wrapperAlign,
    wrapperWrap: props.wrapperWrap ?? layout.wrapperWrap,
    fullness: props.fullness ?? layout.fullness,
    size: props.size ?? layout.size,
    inset: props.inset ?? layout.inset,
    asterisk: props.asterisk,
    bordered: props.bordered ?? layout.bordered,
    feedbackIcon: props.feedbackIcon,
    feedbackLayout: props.feedbackLayout ?? layout.feedbackLayout ?? 'loose',
    tooltipLayout: props.tooltipLayout ?? layout.tooltipLayout ?? 'icon',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    tooltipIcon: props.tooltipIcon ?? layout.tooltipIcon ?? <QuestionCircleOutlined />,
  };
};

function useOverflow<Container extends HTMLElement, Content extends HTMLElement>() {
  const [overflow, setOverflow] = useState(false);
  const containerRef = useRef<Container>();
  const contentRef = useRef<Content>();

  useLayoutEffect(() => {
    if (containerRef.current && contentRef.current) {
      const contentWidth = contentRef.current.getBoundingClientRect().width;
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      if (contentWidth && containerWidth && containerWidth < contentWidth) {
        if (!overflow) setOverflow(true);
      } else {
        if (overflow) setOverflow(false);
      }
    }
  }, []);

  return {
    overflow,
    containerRef,
    contentRef,
  };
}

const ICON_MAP = {
  error: <CloseCircleOutlined />,
  success: <CheckCircleOutlined />,
  warning: <ExclamationCircleOutlined />,
};

const ALL_DATA_TYPE = ['string', 'number', 'object', 'array', 'boolean'];

// TODO: 因为不用像原FormItem兼容所有组件，因此该组件可以简化
export const FormBaseDataItem: React.FC<IFormDataItemProps> = (props) => {
  // console.log(props, 'FormBaseDataItem');
  const { valueType, children, nodeWithErrorData, ...others } = props;
  const workbench = useWorkbench();
  const [active, setActive] = useState(false);
  const formLayout = useFormItemLayout(others);
  const gridSpan = useGridSpan(props.gridSpan);
  const currentNode = useCurrentNode();
  const [stateTreeVisible, setStateTreeVisible] = useState<boolean>(false);
  const field = useField<ObjectField>();
  // 是否是空类型，该组件不允许空类型元素
  const isVoidType = isVoidField(field);
  // 当前值是否是表达式
  const valueIsDSLExpression = useMemo(() => {
    if (isVoidType) return false;
    // 当前判断条件较弱，如果遇到冲突情况可以用枚举来确定是否是表达式
    return isObject(field.value) && (field.value as any).type;
  }, [isVoidType, field.value]);
  const stateTreeDisabledType = useMemo(() => {
    const disabledType = [];
    ALL_DATA_TYPE.forEach((type) => {
      // 当遍历的type不是valueType的时候放到disabled中，如果valueType是string，可以兼容number类型
      if (type !== valueType && !(type === 'number' && valueType === 'string')) {
        disabledType.push(type);
      }
    });
    return disabledType;
  }, [valueType]);
  const { containerRef, contentRef, overflow } = useOverflow<HTMLDivElement, HTMLLabelElement>();
  const {
    label,
    style,
    layout,
    colon = true,
    addonBefore,
    addonAfter,
    asterisk,
    feedbackStatus,
    extra,
    feedbackText,
    fullness,
    feedbackLayout,
    feedbackIcon,
    inset,
    bordered = true,
    labelWidth,
    wrapperWidth,
    labelCol,
    wrapperCol,
    labelAlign,
    wrapperAlign = 'left',
    size,
    labelWrap,
    wrapperWrap,
    tooltipLayout,
    tooltip,
    tooltipIcon,
  } = formLayout;
  const labelStyle = { ...formLayout.labelStyle };
  const wrapperStyle = { ...formLayout.wrapperStyle };
  // 固定宽度
  let enableCol = false;
  if (labelWidth || wrapperWidth) {
    if (labelWidth) {
      labelStyle.width = labelWidth === 'auto' ? undefined : labelWidth;
      labelStyle.maxWidth = labelWidth === 'auto' ? undefined : labelWidth;
    }
    if (wrapperWidth) {
      wrapperStyle.width = wrapperWidth === 'auto' ? undefined : wrapperWidth;
      wrapperStyle.maxWidth = wrapperWidth === 'auto' ? undefined : wrapperWidth;
    }
    // 栅格模式
  }
  if (labelCol || wrapperCol) {
    if (!labelStyle.width && !wrapperStyle.width) {
      enableCol = true;
    }
  }

  const prefixCls = usePrefixCls('formily-item', props);
  const formatChildren =
    feedbackLayout === 'popover' ? (
      <Popover
        autoAdjustOverflow
        placement="top"
        content={
          <div
            className={cls({
              [`${prefixCls}-${feedbackStatus}-help`]: !!feedbackStatus,
              [`${prefixCls}-help`]: true,
            })}
          >
            {ICON_MAP[feedbackStatus]} {feedbackText}
          </div>
        }
        visible={!!feedbackText}
      >
        {children}
      </Popover>
    ) : (
      children
    );

  const gridStyles: React.CSSProperties = {};

  if (gridSpan) {
    gridStyles.gridColumnStart = `span ${gridSpan}`;
  }

  const getOverflowTooltip = () => {
    if (overflow) {
      return (
        <div>
          <div>{label}</div>
          <div>{tooltip}</div>
        </div>
      );
    }
    return tooltip;
  };

  const callStateTreeEditor = useCallback(() => {
    setStateTreeVisible(true);
  }, []);

  // 数据引用变更事件,如果当前数据类型为void则不会触发该事件
  function handleStateChange(value) {
    if (isVoidType) return;
    field.setValue((value as any) || '');
    setStateTreeVisible(false);
  }

  const renderLabelText = () => {
    const labelChildren = (
      <div
        className={cls(
          `${prefixCls}-label-content ${prefixCls}-label-content--data ${
            nodeWithErrorData && prefixCls + '__errorText'
          } `
        )}
        ref={containerRef}
      >
        {asterisk && <span className={cls(`${prefixCls}-asterisk`)}>{'*'}</span>}
        <label ref={contentRef}>
          <Button
            className={cls(`${prefixCls}__label-data-icon`)}
            type={valueIsDSLExpression ? 'primary' : 'default'}
            icon={<ApiOutlined />}
            onClick={callStateTreeEditor}
            style={nodeWithErrorData && { backgroundColor: 'red', border: 'red' }}
          />
          {label}
        </label>

        {/* {isVoidType ? (
          <></>
        ) : (
          <StateTreeDrawer
            visible={stateTreeVisible}
            nodeInfo={currentNode}
            value={field.value}
            stateDSL={workbench.state}
            disabledType={stateTreeDisabledType}
            onConfirm={handleStateChange}
            onClose={() => setStateTreeVisible(false)}
          />
        )} */}
      </div>
    );

    if ((tooltipLayout === 'text' && tooltip) || overflow) {
      return (
        <Tooltip placement="top" align={{ offset: [0, 10] }} title={getOverflowTooltip()}>
          {labelChildren}
        </Tooltip>
      );
    }
    return labelChildren;
  };

  const renderTooltipIcon = () => {
    if (tooltip && tooltipLayout === 'icon' && !overflow) {
      return (
        <span className={cls(`${prefixCls}-label-tooltip-icon`)}>
          <Tooltip placement="top" align={{ offset: [0, 2] }} title={tooltip}>
            {tooltipIcon}
          </Tooltip>
        </span>
      );
    }
  };

  const renderLabel = () => {
    if (!label) return null;
    return (
      <div
        className={cls({
          [`${prefixCls}-label`]: true,
          [`${prefixCls}-label-tooltip`]: (tooltip && tooltipLayout === 'text') || overflow,
          [`${prefixCls}-item-col-${labelCol}`]: enableCol && !!labelCol,
        })}
        style={labelStyle}
      >
        {renderLabelText()}
        {renderTooltipIcon()}
        {label !== ' ' && <span className={cls(`${prefixCls}-colon`)}>{colon ? ':' : ''}</span>}
      </div>
    );
  };

  return (
    <div
      {...pickDataProps(props)}
      style={{
        ...style,
        ...gridStyles,
      }}
      className={cls({
        [`${prefixCls}`]: true,
        [`${prefixCls}-layout-${layout}`]: true,
        [`${prefixCls}-${feedbackStatus}`]: !!feedbackStatus,
        [`${prefixCls}-feedback-has-text`]: !!feedbackText,
        [`${prefixCls}-size-${size}`]: !!size,
        [`${prefixCls}-feedback-layout-${feedbackLayout}`]: !!feedbackLayout,
        [`${prefixCls}-fullness`]: !!fullness || !!inset || !!feedbackIcon,
        [`${prefixCls}-inset`]: !!inset,
        [`${prefixCls}-active`]: active,
        [`${prefixCls}-inset-active`]: !!inset && active,
        [`${prefixCls}-label-align-${labelAlign}`]: true,
        [`${prefixCls}-control-align-${wrapperAlign}`]: true,
        [`${prefixCls}-label-wrap`]: !!labelWrap,
        [`${prefixCls}-control-wrap`]: !!wrapperWrap,
        [`${prefixCls}-bordered-none`]: bordered === false || !!inset || !!feedbackIcon,
        [props.className]: !!props.className,
      })}
      onFocus={() => {
        if (feedbackIcon || inset) {
          setActive(true);
        }
      }}
      onBlur={() => {
        if (feedbackIcon || inset) {
          setActive(false);
        }
      }}
    >
      {renderLabel()}
      <div
        className={cls({
          [`${prefixCls}-control`]: true,
          [`${prefixCls}-item-col-${wrapperCol}`]: enableCol && !!wrapperCol && label,
        })}
      >
        <div className={cls(`${prefixCls}-control-content`)}>
          {addonBefore && <div className={cls(`${prefixCls}-addon-before`)}>{addonBefore}</div>}
          <div
            style={wrapperStyle}
            className={cls({
              [`${prefixCls}-control-content-component`]: true,
              [`${prefixCls}-control-content-component-has-feedback-icon`]: !!feedbackIcon,
            })}
          >
            {valueIsDSLExpression ? (
              <div className={cls(`${prefixCls}-expression-control`)}>
                <Button
                  className={cls(`${prefixCls}-expression-control__btn-edit`)}
                  onClick={() => callStateTreeEditor()}
                  style={nodeWithErrorData && { color: 'red', border: '1px solid red' }}
                >
                  {field.value.type}表达式
                </Button>
                <Button
                  className={cls(`${prefixCls}-expression-control__btn-remove`)}
                  type="primary"
                  danger
                  onClick={() => handleStateChange('')}
                >
                  <DeleteOutlined />
                </Button>
              </div>
            ) : (
              <FormLayoutShallowContext.Provider value={undefined}>
                {formatChildren}
              </FormLayoutShallowContext.Provider>
            )}
            {feedbackIcon && (
              <div className={cls(`${prefixCls}-feedback-icon`)}>{feedbackIcon}</div>
            )}
          </div>
          {addonAfter && <div className={cls(`${prefixCls}-addon-after`)}>{addonAfter}</div>}
        </div>
        {!!feedbackText && feedbackLayout !== 'popover' && feedbackLayout !== 'none' && (
          <div
            className={cls({
              [`${prefixCls}-${feedbackStatus}-help`]: !!feedbackStatus,
              [`${prefixCls}-help`]: true,
              [`${prefixCls}-help-enter`]: true,
              [`${prefixCls}-help-enter-active`]: true,
            })}
          >
            {feedbackText}
          </div>
        )}
        {extra && <div className={cls(`${prefixCls}-extra`)}>{extra}</div>}
      </div>
    </div>
  );
};

/**
 * 带数据配置的表单元素
 */
export const FormDataItem: ComposeFormItem = connect(
  FormBaseDataItem,
  mapProps(
    { validateStatus: true, title: 'label', required: true },
    (props, field) => {
      if (isVoidField(field))
        return {
          extra: props.extra || field.description,
          id: field.form.id,
        };
      if (!field) return props;
      const takeMessage = () => {
        const split = (messages: any[]) => {
          return messages.reduce((buf, text, index) => {
            if (!text) return buf;
            return index < messages.length - 1 ? buf.concat([text, ', ']) : buf.concat([text]);
          }, []);
        };
        if (field.validating) return;
        if (props.feedbackText) return props.feedbackText;
        if (field.errors.length) return split(field.errors);
        if (field.warnings.length) return split(field.warnings);
        if (field.successes.length) return split(field.successes);
      };

      return {
        feedbackText: takeMessage(),
        extra: props.extra || field.description,
      };
    },
    (props, field) => {
      if (isVoidField(field)) return props;
      if (!field) return props;
      return {
        feedbackStatus:
          field.validateStatus === 'validating'
            ? 'pending'
            : field.decorator[1]?.feedbackStatus || field.validateStatus,
      };
    },
    (props, field) => {
      if (isVoidField(field)) return props;
      if (!field) return props;
      let asterisk = false;
      if (field.required && field.pattern !== 'readPretty') {
        asterisk = true;
      }
      if ('asterisk' in props) {
        asterisk = props.asterisk;
      }
      return {
        asterisk,
      };
    },
    (props, field) => {
      if (isVoidField(field)) return props;
      if (!field) return props;
      return {
        valueType: props.valueType,
      };
    }
  )
);

FormDataItem.BaseItem = FormBaseDataItem;

export default FormDataItem;
