import type { ReactNode } from 'react';
import { LAYERS, SHOTS, hexA } from '../data';

interface FilterBarProps {
  mapRight: string;
  docOpen: boolean;
  toggleDoc: () => void;
  layers: Record<string, boolean>;
  toggleLayer: (key: string) => void;
}

const ROW1_KEYS = ['sabotage', 'detect', 'targets', 'reports'];
const ROW2_KEYS = ['history', 'capture', 'infra', 'tahak', 'events', 'aman'];

export default function FilterBar({ mapRight, docOpen, toggleDoc, layers, toggleLayer }: FilterBarProps) {
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flex: '0 0 auto',
          whiteSpace: 'nowrap',
          pointerEvents: 'auto',
          maxWidth: '100%',
          overflow: 'hidden',
          height: 32,
          padding: '0 12px',
          background: '#051125',
          border: '1px solid #154ba7',
          borderRadius: 8,
          boxShadow: '0 16px 64px rgba(1,6,45,.45)',
        }}
      >
        <span style={{ flex: '0 0 auto', whiteSpace: 'nowrap', font: '700 12px Assistant,sans-serif', color: '#e7edf7' }}>סינונים</span>
        <div style={{ width: 1, height: 15, background: 'rgba(255,255,255,.13)' }} />
        <span style={{ flex: '0 0 auto', whiteSpace: 'nowrap', font: '400 11px Assistant,sans-serif', color: '#9aa3b2' }}>סינון נוכחי</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: '0 0 auto', height: 20, padding: '0 7px', background: '#081c3d', border: '1px solid rgba(255,255,255,.13)', borderRadius: 4, cursor: 'pointer' }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9aa3b2" strokeWidth={2} strokeLinecap="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
          <span style={{ whiteSpace: 'nowrap', font: '400 11px Assistant,sans-serif', color: '#7d8492' }}>בחירה</span>
        </div>
        <span style={{ font: '400 15px Assistant,sans-serif', color: '#9aa3b2', cursor: 'pointer' }}>+</span>
        <span style={{ font: '400 12px Assistant,sans-serif', color: '#9aa3b2', cursor: 'pointer' }}>✕</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-end', gap: 10, maxWidth: '100%' }}>
        {docOpen && (
          <div style={{ pointerEvents: 'auto', width: 268, flex: '0 0 auto', background: '#051125', border: '1px solid #154ba7', borderRadius: 12, boxShadow: '0 16px 64px rgba(1,6,45,.45)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderBottom: '1px solid rgba(255,255,255,.13)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 14 }}>📷</span>
                <span style={{ font: '700 12px Assistant,sans-serif', color: '#e7edf7' }}>תיעוד מבצעי</span>
              </div>
              <span onClick={toggleDoc} style={{ font: '400 13px Assistant,sans-serif', color: '#9aa3b2', cursor: 'pointer' }}>
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
        )}

        <div
          style={{
            pointerEvents: 'auto',
            width: 'max-content',
            maxWidth: 'min(96%,940px)',
            padding: '14px 16px',
            background: 'rgba(20,22,28,.72)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: '1px solid rgba(255,255,255,.1)',
            borderRadius: 20,
            boxShadow: '0 20px 70px rgba(0,0,0,.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Pill>
                <TableIcon />
                טבלת ישויות
              </Pill>
              <Pill solid>
                <FilterIcon />
                סינונים רוחביים
              </Pill>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ToolIconBtn onClick={toggleDoc} active={docOpen} title="תיעוד מבצעי">
                <PencilIcon />
              </ToolIconBtn>
              <ToolIconBtn title="רענון">
                <RefreshIcon />
              </ToolIconBtn>
              <ToolIconBtn title="סגור">
                <XIcon />
              </ToolIconBtn>
            </div>
          </div>

          <div style={{ direction: 'ltr', display: 'flex', alignItems: 'stretch', gap: 10 }}>
            <DocTile on={docOpen} onClick={toggleDoc} />
            <HeatTile on={!!layers.heat} onClick={() => toggleLayer('heat')} />
            <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(255,255,255,.1)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: '1 1 auto' }}>
              <div style={{ display: 'flex', gap: 10 }}>
                {ROW1_KEYS.map((key) => {
                  const def = LAYERS.find((l) => l.key === key);
                  if (!def) return null;
                  return <StatTile key={key} def={def} on={!!layers[key]} onClick={() => toggleLayer(key)} />;
                })}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {ROW2_KEYS.map((key) => {
                  const def = LAYERS.find((l) => l.key === key);
                  if (!def) return null;
                  return <StatTile key={key} def={def} on={!!layers[key]} onClick={() => toggleLayer(key)} icon={key === 'aman' ? <AmanIcon color={def.color} /> : undefined} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolIconBtn({ onClick, active, title, children }: { onClick?: () => void; active?: boolean; title: string; children: ReactNode }) {
  return (
    <div
      onClick={onClick}
      title={title}
      className="tool-icon-btn"
      style={{
        width: 38,
        height: 38,
        borderRadius: 11,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        background: active ? 'rgba(24,110,255,.22)' : 'rgba(255,255,255,.06)',
        border: `1px solid ${active ? '#2f6fd6' : 'rgba(255,255,255,.09)'}`,
      }}
    >
      {children}
    </div>
  );
}

function Pill({ solid, children }: { solid?: boolean; children: ReactNode }) {
  return (
    <div
      className={solid ? 'pill-btn' : 'pill-btn'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        height: 34,
        padding: '0 14px',
        borderRadius: 12,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        font: '600 12px Assistant,sans-serif',
        background: solid ? '#1863e0' : 'rgba(255,255,255,.06)',
        color: solid ? '#ffffff' : '#c8d0dd',
        border: solid ? '1px solid #1863e0' : '1px solid rgba(255,255,255,.09)',
      }}
    >
      {children}
    </div>
  );
}

function StatTile({ def, on, onClick, icon }: { def: (typeof LAYERS)[number]; on: boolean; onClick: () => void; icon?: ReactNode }) {
  return (
    <div
      onClick={onClick}
      style={{
        flex: '1 1 0',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '14px 8px',
        borderRadius: 16,
        cursor: 'pointer',
        textAlign: 'center',
        background: on ? hexA(def.color, 0.14) : 'rgba(255,255,255,.04)',
        border: `1px solid ${on ? def.color : 'rgba(255,255,255,.08)'}`,
        transition: 'background 140ms cubic-bezier(.2,0,0,1)',
      }}
    >
      {icon}
      <span style={{ font: '500 12px/1.3 Assistant,sans-serif', color: '#c9cedb' }}>
        {def.label1}
        {def.label2 && (
          <>
            <br />
            {def.label2}
          </>
        )}
      </span>
      <span style={{ font: '700 22px Assistant,sans-serif', color: def.color }}>{def.value || '—'}</span>
    </div>
  );
}

function HeatTile({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        flex: '0 0 170px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        borderRadius: 18,
        cursor: 'pointer',
        background: on ? 'rgba(91,155,255,.14)' : 'rgba(255,255,255,.04)',
        border: `1px solid ${on ? '#5b9bff' : 'rgba(255,255,255,.08)'}`,
      }}
    >
      <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <MapIcon />
      </div>
      <span style={{ font: '600 13px/1.4 Assistant,sans-serif', color: '#e7edf7', textAlign: 'center' }}>
        מפת חום
        <br />
        כוחותינו
      </span>
    </div>
  );
}

function DocTile({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        flex: '0 0 150px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        borderRadius: 18,
        cursor: 'pointer',
        background: on ? 'rgba(158,195,255,.14)' : 'rgba(255,255,255,.04)',
        border: `1px solid ${on ? '#9ec3ff' : 'rgba(255,255,255,.08)'}`,
      }}
    >
      <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CameraIcon />
      </div>
      <span style={{ font: '600 13px/1.4 Assistant,sans-serif', color: '#e7edf7', textAlign: 'center' }}>
        תיעוד
        <br />
        מבצעי
      </span>
    </div>
  );
}

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e7edf7" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e7edf7" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e7edf7" strokeWidth={1.9} strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function TableIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <rect x="13" y="3" width="8" height="8" rx="1" />
      <rect x="3" y="13" width="8" height="8" rx="1" />
      <rect x="13" y="13" width="8" height="8" rx="1" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M3 4h18l-7 8v6l-4 2v-8z" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e7edf7" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2Z" />
      <path d="M9 3v16M15 5v16" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e7edf7" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h3l1.6-2.4A2 2 0 0 1 10.3 4.5h3.4a2 2 0 0 1 1.7 1.1L17 8h3a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 20 20H4a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 4 8Z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </svg>
  );
}

function AmanIcon({ color }: { color: string }) {
  return (
    <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c1 2 1.6 3.4 1.6 4.8A2.6 2.6 0 0 1 12 9a2.6 2.6 0 0 1-1.6-4.2C11 3.4 11.6 2 12 2Z" />
        <path d="M12 9v3" />
        <path d="M12 6.4C9.8 7.6 8.4 8.6 7.6 9.8A2.6 2.6 0 0 0 9 13.4a2.6 2.6 0 0 0 2.6-3.1c-.2-1.4-.7-2.4 0.4-3.9Z" />
        <path d="M12 6.4c2.2 1.2 3.6 2.2 4.4 3.4A2.6 2.6 0 0 1 15 13.4a2.6 2.6 0 0 1-2.6-3.1c.2-1.4.7-2.4-.4-3.9Z" />
        <path d="M12 12v3" />
        <path d="M8 21v-2.5A4 4 0 0 1 12 14.5v0A4 4 0 0 1 16 18.5V21" />
        <path d="M6 21h12" />
      </svg>
    </div>
  );
}
