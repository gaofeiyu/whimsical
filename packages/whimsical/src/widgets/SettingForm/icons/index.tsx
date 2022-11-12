import React from 'react';
import * as icons from './collectIcons';

const iconNames = Object.keys(icons);
const EditorIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {};
iconNames.forEach((name) => {
  if (icons[name]) {
    EditorIcons[name] = () => {
      return (
        <svg viewBox="0 0 1024 1024" style={{ width: '1em', height: '1em' }} fill="currentColor">
          {icons[name]}
        </svg>
      );
    };
  }
});

export default EditorIcons;
