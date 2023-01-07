import { MouseEventHandler, MutableRefObject, useEffect, useRef } from 'react';
import { EDITOR_EVENTS$ } from 'src/editor-flow';

export interface EWDragProps {
  id: string | number;
  needSave?: boolean;
  // 默认宽度
  defaultWidth?: number;
  // 方向 e: 向右展开 w: 向左展开
  direction?: 'e' | 'w';
}

export const useEWDrag = <T>(props: EWDragProps): [MutableRefObject<T>, MouseEventHandler] => {
  const { needSave = false, id, defaultWidth = 300, direction = 'e' } = props;
  const contentRef = useRef(null);
  const resizeRaf = useRef(null);
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const ewMouseDown = (e) => {
    startX.current = e.pageX;
    let clientWidth = 0;
    if (needSave) {
      clientWidth = Number(localStorage.getItem('useEWDragClientWidth_' + id) || defaultWidth);
    }
    startWidth.current = clientWidth || contentRef.current.clientWidth;
    isMouseDown.current = true;
  };

  const ewMouseMove = (e) => {
    if (!isMouseDown.current) return;
    const offset = direction === 'e' ? e.pageX - startX.current : startX.current - e.pageX;
    contentRef.current.style &&
      (contentRef.current.style.width = `${startWidth.current + offset}px`);

    resizeRaf.current = requestAnimationFrame(() => {
      cancelAnimationFrame(resizeRaf.current);
      EDITOR_EVENTS$.emit('canvas:resize');
    });
  };
  const ewMouseUp = () => {
    if (!isMouseDown.current) return;
    isMouseDown.current = false;
    localStorage.setItem('useEWDragClientWidth_' + id, contentRef.current.clientWidth);
  };

  useEffect(() => {
    if (needSave && contentRef.current) {
      contentRef.current.style.width =
        Number(localStorage.getItem('useEWDragClientWidth_' + id) || defaultWidth) + 'px';
    }
    window.addEventListener('mousemove', ewMouseMove);
    window.addEventListener('mouseup', ewMouseUp);
    return () => {
      window.removeEventListener('mousemove', ewMouseMove);
      window.removeEventListener('mouseup', ewMouseUp);
    };
  }, []);
  return [contentRef, !!contentRef ? ewMouseDown : () => null];
};
