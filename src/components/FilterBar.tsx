import { GROUPS, LAYERS, SHOTS, hexA } from '../data';

interface FilterBarProps {
  mapRight: string;
  docOpen: boolean;
  toggleDoc: () => void;
  layers: Record<string, boolean>;
  toggleLayer: (key: string) => void;
  onOpenAi: () => void;
}

export default function FilterBar({ mapRight, docOpen, toggleDoc, layers, toggleLayer, onOpenAi }: FilterBarProps) {
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

        <div style={{ pointerEvents: 'auto', width: 'max-content', maxWidth: 'min(100%,470px)', padding: '7px 10px 9px', background: '#1a1c21', border: '1px solid rgba(255,255,255,.13)', borderRadius: 12, boxShadow: '0 16px 64px rgba(1,6,45,.45)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 14px', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, height: 19, padding: '0 6px', background: 'rgba(14,51,114,.35)', border: '1px solid #154ba7', borderRadius: 5, font: '500 10px Assistant,sans-serif', color: '#9ec3ff', cursor: 'pointer' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <path d="M3 4h18l-7 8v6l-4 2v-8z" />
                </svg>
                סינונים רוחביים
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, height: 19, padding: '0 6px', background: '#081c3d', border: '1px solid rgba(255,255,255,.13)', borderRadius: 5, font: '500 10px Assistant,sans-serif', color: '#c8d0dd', cursor: 'pointer' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9aa3b2" strokeWidth={2}>
                  <rect x="3" y="3" width="8" height="8" rx="1" />
                  <rect x="13" y="3" width="8" height="8" rx="1" />
                  <rect x="3" y="13" width="8" height="8" rx="1" />
                  <rect x="13" y="13" width="8" height="8" rx="1" />
                </svg>
                טבלת ישויות
              </div>
              <div onClick={onOpenAi} style={{ display: 'flex', alignItems: 'center', gap: 5, height: 19, padding: '0 6px', background: '#081c3d', border: '1px solid rgba(255,255,255,.13)', borderRadius: 5, font: '500 10px Assistant,sans-serif', color: '#c8d0dd', cursor: 'pointer' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#30a46c" strokeWidth={2} strokeLinecap="round">
                  <path d="M3 17V7l6 3 6-3 6 3v10l-6-3-6 3z" />
                </svg>
                תובנות וגרפים
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#9aa3b2' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" style={{ cursor: 'pointer' }}>
                <path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5" />
              </svg>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" style={{ cursor: 'pointer' }}>
                <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
              </svg>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" style={{ cursor: 'pointer' }}>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '5px 6px' }}>
            {GROUPS.map((group) => (
              <FragmentGroup key={group.name} name={group.name} color={group.color} keys={group.keys} layers={layers} toggleLayer={toggleLayer} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FragmentGroup({ name, color, keys, layers, toggleLayer }: { name: string; color: string; keys: string[]; layers: Record<string, boolean>; toggleLayer: (key: string) => void }) {
  return (
    <>
      <span style={{ font: '700 9px/1 Assistant,sans-serif', color, letterSpacing: '.02em', whiteSpace: 'nowrap' }}>{name}</span>
      {keys.map((key) => {
        const def = LAYERS.find((l) => l.key === key);
        if (!def) return null;
        const on = !!layers[key];
        const bg = on ? hexA(def.color, 0.16) : '#2b2e34';
        const border = on ? def.color : 'rgba(255,255,255,.09)';
        const labelColor = on ? '#ffffff' : '#c8d0dd';
        return (
          <div
            key={key}
            onClick={() => toggleLayer(key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              height: 24,
              padding: '0 8px',
              background: bg,
              border: `1px solid ${border}`,
              borderRadius: 6,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background 140ms cubic-bezier(.2,0,0,1)',
            }}
          >
            <span style={{ flex: '0 0 6px', width: 6, height: 6, borderRadius: '50%', background: def.color }} />
            <span style={{ font: '500 10px/1 Assistant,sans-serif', color: labelColor }}>
              {def.label1}
              {def.label2 ? ` ${def.label2}` : ''}
            </span>
            {def.value && <span style={{ font: '700 10px/1 Assistant,sans-serif', color: def.color }}>{def.value}</span>}
          </div>
        );
      })}
    </>
  );
}
