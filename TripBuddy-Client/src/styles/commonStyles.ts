import {CSSProperties} from 'react';
import commonStyles from '@styles/palette.module.scss';

const glassEffect: CSSProperties = {
  color: commonStyles.fontColor,
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0))',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
};

const glassBorder: CSSProperties = {
  content: "''",
  position: 'absolute',
  inset: 0,
  padding: 2,
  background: 'linear-gradient(165deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
  maskComposite: 'exclude',
  pointerEvents: 'none',
};

export {glassEffect, glassBorder};
