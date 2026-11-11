import { useState, type ReactNode } from 'react';
import { LAYERS, SHOTS, hexA } from '../data';

interface FilterBarProps {
  mapRight: string;
  docOpen: boolean;
  toggleDoc: () => void;
  layers: Record<string, boolean>;
  toggleLayer: (key: string) => void;
}

const STAT_KEYS = ['reports', 'targets', 'detect', 'sabotage', 'events', 'tahak', 'infra', 'capture'];

const TIME_MODES = ['אי פעם', 'ימים לאחור', 'טווח זמנים'];

const GLASS = {
  background: 'rgba(46,48,53,.8)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,.1)',
  boxShadow: '0 18px 60px rgba(0,0,0,.45)',
} as const;

export default function FilterBar({ mapRight, docOpen, toggleDoc, layers, toggleLayer }: FilterBarProps) {
  const [timeBarOpen, setTimeBarOpen] = useState(true);
  const [timeMode, setTimeMode] = useState(TIME_MODES[0]);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        bottom: 16,
        right: mapRight,
        zIndex: 600,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '0 12px',
        boxSizing: 'border-box',
        pointerEvents: 'none',
      }}
    >
      {timeBarOpen && (
        <div style={{ ...GLASS, pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 10, height: 38, padding: '0 14px 0 8px', borderRadius: 14 }}>
          <span style={{ font: '600 12px Assistant,sans-serif', color: '#e7edf7', whiteSpace: 'nowrap' }}>סינון זמנים</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: 2, borderRadius: 8, background: 'rgba(0,0,0,.25)' }}>
            {TIME_MODES.map((m) => {
              const on = m === timeMode;
              return (
                <span
                  key={m}
                  onClick={() => setTimeMode(m)}
                  className="seg-opt"
                  style={{
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    font: `${on ? 600 : 500} 11px Assistant,sans-serif`,
                    background: on ? '#1f6feb' : 'transparent',
                    color: on ? '#fff' : '#9aa3b2',
                  }}
                >
                  {m}
                </span>
              );
            })}
          </div>
          <IconBtn title="סגירת סינון זמנים" onClick={() => setTimeBarOpen(false)}>
            <XIcon />
          </IconBtn>
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-end', gap: 10, maxWidth: '100%' }}>
        {docOpen && <DocPanel onClose={toggleDoc} />}

        <div style={{ ...GLASS, pointerEvents: 'auto', flex: '0 0 auto', padding: 12, borderRadius: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Pill active={timeBarOpen} onClick={() => setTimeBarOpen((v) => !v)} icon={<FilterIcon />}>
                סינונים רוחבים
              </Pill>
              <Pill icon={<TableIcon />}>טבלת ישויות</Pill>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconBtn title="רענון">
                <RefreshIcon />
              </IconBtn>
              <IconBtn title="תיעוד מבצעי" onClick={toggleDoc} active={docOpen}>
                <PencilIcon />
              </IconBtn>
              <IconBtn title="סגור">
                <XIcon />
              </IconBtn>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'stretch', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 66px)', gap: 7 }}>
              {STAT_KEYS.map((key) => {
                const def = LAYERS.find((l) => l.key === key);
                if (!def) return null;
                return <StatTile key={key} def={def} on={!!layers[key]} onClick={() => toggleLayer(key)} />;
              })}
            </div>

            <div style={{ width: 1, background: 'rgba(255,255,255,.1)' }} />

            <div style={{ width: 146, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {CAPABILITIES.map((c) => {
                const on = c.key === 'doc' ? docOpen : !!layers[c.key];
                return (
                  <div
                    key={c.key}
                    onClick={c.key === 'doc' ? toggleDoc : () => toggleLayer(c.key)}
                    className="bar-row"
                    style={{
                      flex: '1 1 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '0 10px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      background: on ? hexA(c.color, 0.18) : 'rgba(255,255,255,.07)',
                      border: `1px solid ${on ? hexA(c.color, 0.7) : 'transparent'}`,
                      color: on ? c.color : '#d6dce6',
                    }}
                  >
                    <span style={{ display: 'flex', flex: '0 0 auto' }}>{c.icon}</span>
                    <span style={{ font: '600 11.5px Assistant,sans-serif', color: '#e7edf7', whiteSpace: 'nowrap' }}>{c.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CAPABILITIES: { key: string; label: string; color: string; icon: ReactNode }[] = [
  { key: 'heat', label: 'מפת חום כוחותינו', color: '#5b9bff', icon: <MapIcon /> },
  { key: 'history', label: 'היסטוריית מבנים', color: '#e7edf7', icon: <HouseIcon /> },
  { key: 'doc', label: 'תיעוד מבצעי', color: '#9ec3ff', icon: <ClipboardIcon /> },
  { key: 'aman', label: 'מגן אמ״ן', color: '#a78bfa', icon: <ShieldIcon /> },
];

function StatTile({ def, on, onClick }: { def: (typeof LAYERS)[number]; on: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bar-tile"
      style={{
        height: 62,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        borderRadius: 12,
        cursor: 'pointer',
        textAlign: 'center',
        background: on ? hexA(def.color, 0.16) : 'rgba(255,255,255,.08)',
        border: `1px solid ${on ? hexA(def.color, 0.75) : 'transparent'}`,
      }}
    >
      <span style={{ font: '600 10.5px/1.15 Assistant,sans-serif', color: '#e7edf7' }}>
        {def.label1}
        {def.label2 && (
          <>
            <br />
            {def.label2}
          </>
        )}
      </span>
      <span style={{ font: '700 16px/1 Assistant,sans-serif', color: def.color }}>{def.value || '—'}</span>
    </div>
  );
}

function Pill({ active, onClick, icon, children }: { active?: boolean; onClick?: () => void; icon: ReactNode; children: ReactNode }) {
  return (
    <div
      onClick={onClick}
      className="bar-pill"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        height: 26,
        padding: '0 12px',
        borderRadius: 999,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        font: '500 11.5px Assistant,sans-serif',
        color: '#e7edf7',
        background: active ? 'rgba(31,111,235,.28)' : 'rgba(255,255,255,.1)',
        border: `1px solid ${active ? 'rgba(77,141,255,.75)' : 'rgba(255,255,255,.12)'}`,
      }}
    >
      {icon}
      {children}
    </div>
  );
}

function IconBtn({ title, onClick, active, children }: { title: string; onClick?: () => void; active?: boolean; children: ReactNode }) {
  return (
    <div
      onClick={onClick}
      title={title}
      className="tool-icon-btn"
      style={{
        width: 26,
        height: 26,
        borderRadius: 7,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: active ? '#8fb8ff' : '#c9d1dc',
        background: active ? 'rgba(31,111,235,.22)' : 'transparent',
      }}
    >
      {children}
    </div>
  );
}

function DocPanel({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ pointerEvents: 'auto', width: 268, flex: '0 0 auto', background: '#051125', border: '1px solid #154ba7', borderRadius: 12, boxShadow: '0 16px 64px rgba(1,6,45,.45)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderBottom: '1px solid rgba(255,255,255,.13)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 14 }}>📷</span>
          <span style={{ font: '700 12px Assistant,sans-serif', color: '#e7edf7' }}>תיעוד מבצעי</span>
        </div>
        <span onClick={onClose} style={{ font: '400 13px Assistant,sans-serif', color: '#9aa3b2', cursor: 'pointer' }}>
          ✕
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '10px 12px' }}>
        {SHOTS.map((s) => (
          <div key={s.name} style={{ display: 'flex', flexDirection: 'column', gap: 4, cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', height: 64, padding: 5, background: '#081c3d', border: '1px solid rgba(255,255,255,.13)', borderRadius: 6 }}>
              <span style={{ font: '500 9px Assistant,sans-serif', color: '#c8d0dd', background: 'rgba(0,0,0,.5)', padding: '1px 4px', borderRadius: 3 }}>{s.time}</span>
            </div>
            <span style={{ font: '400 10px Assistant,sans-serif', color: '#9aa3b2' }}>{s.name}</span>
          </div>
        ))}
      </div>
      <div
        className="doc-add-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          margin: '0 12px 12px',
          height: 28,
          background: 'rgba(14,51,114,.35)',
          border: '1px solid #154ba7',
          borderRadius: 6,
          font: '500 11px Assistant,sans-serif',
          color: '#9ec3ff',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: 12 }}>📷</span>
        הוספת תיעוד
      </div>
    </div>
  );
}

function Svg({ size = 15, children }: { size?: number; children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

function PencilIcon() {
  return (
    <Svg size={14}>
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </Svg>
  );
}

function RefreshIcon() {
  return (
    <Svg size={14}>
      <path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5" />
    </Svg>
  );
}

function XIcon() {
  return (
    <Svg size={14}>
      <path d="M18 6 6 18M6 6l12 12" />
    </Svg>
  );
}

function FilterIcon() {
  return (
    <Svg size={13}>
      <path d="M3 4h18l-7 8v6l-4 2v-8z" />
    </Svg>
  );
}

function TableIcon() {
  return (
    <Svg size={13}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M3 15h18M9 4v16M15 4v16" />
    </Svg>
  );
}

function MapIcon() {
  return (
    <Svg size={15}>
      <path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2Z" />
      <path d="M9 3v16M15 5v16" />
    </Svg>
  );
}

function HouseIcon() {
  return (
    <Svg size={15}>
      <path d="M3 11 12 4l9 7" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M10 20v-5h4v5" />
    </Svg>
  );
}

function ClipboardIcon() {
  return (
    <Svg size={15}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3" />
    </Svg>
  );
}

function ShieldIcon() {
  return (
    <Svg size={15}>
      <path d="M12 3 4.5 6v6c0 4.4 3 7.5 7.5 9 4.5-1.5 7.5-4.6 7.5-9V6L12 3Z" />
    </Svg>
  );
}
