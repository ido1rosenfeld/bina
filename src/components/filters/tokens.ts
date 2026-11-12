import type { CSSProperties } from 'react';

// Design tokens taken from the Figma "סינונים" frame (Radix-based library).
export const T = {
  panelBg: '#3c3d3e',
  divider: 'rgba(255,255,255,.15)',
  sectionBg: 'rgba(255,255,255,.07)',
  title: '#eeeeee',
  text: '#ffffff',
  muted: '#b5bac6',
  fieldBg: 'rgba(211,237,248,.11)',
  fieldBorder: '#585f6f',
  chipBg: 'rgba(255,255,255,.04)',
  chipBorder: 'rgba(217,237,255,.25)',
  infoBg: 'rgba(17,132,252,.2)',
  infoBorder: '#1f6692',
  infoText: '#e6f5ff',
  cardBg: 'rgba(243,245,244,.07)',
  cardBorder: 'rgba(217,237,254,.15)',
  accent: '#186eff',
  neutralBtn: '#3d424f',
  font: 'Assistant,sans-serif',
} as const;

export const PANEL: CSSProperties = {
  background: T.panelBg,
  borderRadius: 12,
  boxShadow: '0 4px 16px rgba(0,0,0,.35), 0 18px 48px rgba(0,0,0,.35)',
  border: '1px solid rgba(255,255,255,.06)',
  color: T.text,
  fontFamily: T.font,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

