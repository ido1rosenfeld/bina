import { useState, type ReactNode } from 'react';
import type { RecItem } from '../data';
import { RECS_W, SIDEBAR_W } from '../data';

interface RecsPanelProps {
  queue: RecItem[];
  mine: RecItem[];
  activeId: string | null;
  onTake: (id: string) => void;
  onReject: (id: string) => void;
  onOpenRec: (rec: RecItem) => void;
  onActivate: (id: string) => void;
  onClose: () => void;
}

export default function RecsPanel({ queue, mine, activeId, onTake, onReject, onOpenRec, onActivate, onClose }: RecsPanelProps) {
  const [drill, setDrill] = useState(true);

  return (
    <div
      dir="rtl"
      style={{
        position: 'absolute',
        top: 44,
        right: SIDEBAR_W,
        bottom: 0,
        width: RECS_W,
        zIndex: 700,
        display: 'flex',
        flexDirection: 'column',
        background: '#1a1d22',
        borderLeft: '1px solid rgba(255,255,255,.1)',
        boxShadow: '-20px 0 50px rgba(0,0,0,.45)',
        fontFamily: 'Assistant,sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
        <span style={{ font: '700 16px Assistant,sans-serif', color: '#f1f5fa' }}>תור ההמלצות</span>
        <span
          onClick={() => setDrill((v) => !v)}
          title="מצב תרגיל"
          style={{ padding: '2px 10px', borderRadius: 6, border: `1px solid ${drill ? '#4d8dff' : 'rgba(255,255,255,.16)'}`, color: drill ? '#9ec3ff' : '#8f97a6', font: '600 11.5px Assistant,sans-serif', cursor: 'pointer' }}
        >
          תמרון
        </span>
        <div style={{ flex: '1 1 auto' }} />
        <IconBtn title="סינון">
          <path d="M3 4h18l-7 8v6l-4 2v-8z" />
        </IconBtn>
        <IconBtn title="הגדרות">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" />
        </IconBtn>
        <IconBtn title="סגירה" onClick={onClose}>
          <path d="M18 6 6 18M6 6l12 12" />
        </IconBtn>
      </div>

      <div style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {queue.length === 0 && <div style={{ font: '400 12px Assistant,sans-serif', color: '#8f97a6', textAlign: 'center', padding: 16 }}>אין המלצות ממתינות בתור</div>}
        {queue.map((r) => (
          <RecCard key={r.id} rec={r} onOpen={() => onOpenRec(r)} onReject={() => onReject(r.id)}>
            <span onClick={() => onTake(r.id)} className="bar-pill" style={actionBtn('#1f5fc7', '#fff')}>
              לקחת אחריות
            </span>
          </RecCard>
        ))}

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '6px 2px 0', font: '600 12px Assistant,sans-serif', color: '#c8d0dd' }}>
          <span style={{ minWidth: 18, height: 18, borderRadius: 9, background: 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 10.5px Assistant,sans-serif' }}>{mine.length}</span>
          המלצות באחריותי
        </div>
        <div style={{ height: 1, background: 'rgba(77,141,255,.35)' }} />

        {mine.map((r) => (
          <RecCard key={r.id} rec={r} mine active={r.id === activeId} onOpen={() => onOpenRec(r)} onSelect={() => onActivate(r.id)} expandedDefault>
            <span className="bar-pill" style={actionBtn('rgba(31,111,235,.25)', '#9ec3ff')}>
              ✓ באחריותי
            </span>
          </RecCard>
        ))}
      </div>
    </div>
  );
}

function RecCard({
  rec,
  mine,
  active,
  expandedDefault,
  onOpen,
  onReject,
  onSelect,
  children,
}: {
  rec: RecItem;
  mine?: boolean;
  active?: boolean;
  expandedDefault?: boolean;
  onOpen: () => void;
  onReject?: () => void;
  onSelect?: () => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(!!expandedDefault);
  return (
    <div
      onClick={onSelect}
      style={{
        borderRadius: 10,
        overflow: 'hidden',
        background: mine ? '#1e3555' : '#232a35',
        border: `1px solid ${active ? '#4d8dff' : mine ? 'rgba(77,141,255,.35)' : 'rgba(255,255,255,.08)'}`,
        boxShadow: active ? '0 0 0 2px rgba(77,141,255,.25)' : 'none',
      }}
    >
      <div onClick={onOpen} title="פתיחת היסטוריה גזרתית" style={{ padding: '10px 12px', cursor: 'pointer', background: mine ? 'rgba(77,141,255,.18)' : 'rgba(255,255,255,.03)' }} className="entity-acc-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '1px 7px', borderRadius: 6, background: '#f5c518', color: '#3a2c00', font: '700 11px Assistant,sans-serif' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6}>
              <path d="M12 3 21 12 12 21 3 12Z" />
            </svg>
            {rec.score}
          </span>
          <span style={{ padding: '1px 7px', borderRadius: 5, background: 'rgba(0,0,0,.3)', font: '700 11px Assistant,sans-serif', color: '#e7edf7' }}>{rec.id}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, font: '500 11px Assistant,sans-serif', color: '#c8d0dd' }}>
            {rec.age}
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7ec8ff' }} />
          </span>
          <div style={{ flex: '1 1 auto' }} />
          {onReject && (
            <span
              title="דחיית ההמלצה"
              onClick={(e) => {
                e.stopPropagation();
                onReject();
              }}
              className="bar-pill"
              style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(255,92,92,.15)', color: '#ff7a7a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', font: '700 12px Assistant,sans-serif' }}
            >
              ✕
            </span>
          )}
        </div>
        <div style={{ font: '700 13px Assistant,sans-serif', color: '#f1f5fa', marginTop: 7 }}>{rec.title}</div>
      </div>

      {open && (
        <div style={{ padding: '10px 12px 0', display: 'flex', flexDirection: 'column', gap: 6, font: '400 11.5px/1.5 Assistant,sans-serif', color: '#c8d0dd' }}>
          <div>
            <b style={{ color: '#9aa3b2', fontWeight: 500 }}>סיווג מבצעי:</b> {rec.cls} <span style={{ color: '#5d6573' }}>|</span> <b style={{ color: '#9aa3b2', fontWeight: 500 }}>רמת הפללה:</b> {rec.level}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <b style={{ color: '#9aa3b2', fontWeight: 500 }}>נ.צ:</b>
            <span style={{ direction: 'ltr' }}>{rec.grid}</span>
            <span title="העתקה" onClick={() => navigator.clipboard?.writeText(rec.grid)} style={{ cursor: 'pointer', color: '#9aa3b2', display: 'flex' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="9" y="9" width="12" height="12" rx="2" />
                <path d="M5 15V5a2 2 0 0 1 2-2h10" />
              </svg>
            </span>
            <span style={{ color: '#5d6573' }}>|</span>
            <b style={{ color: '#9aa3b2', fontWeight: 500 }}>תיאור:</b> {rec.desc}
          </div>
          <div>
            <b style={{ color: '#9aa3b2', fontWeight: 500 }}>גורם יוצר:</b> {rec.creator}
          </div>
          <div>
            <b style={{ color: '#9aa3b2', fontWeight: 500 }}>בעלות:</b> {rec.owner}
          </div>
          <div>
            <b style={{ color: '#9aa3b2', fontWeight: 500 }}>זמן יצירה:</b> <span style={{ direction: 'ltr', display: 'inline-block' }}>{rec.created}</span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 12px' }}>
        {children}
        <span title="צפייה במפה" onClick={onOpen} className="bar-pill" style={{ ...actionBtn('rgba(255,255,255,.07)', '#9ec3ff'), padding: '0 9px' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round">
            <circle cx="6.5" cy="15.5" r="3.5" />
            <circle cx="17.5" cy="15.5" r="3.5" />
            <path d="M10 15h4M5 12l2-7h3l1 5M19 12l-2-7h-3l-1 5" />
          </svg>
        </span>
        <div style={{ flex: '1 1 auto' }} />
        <span
          title={open ? 'צמצום' : 'פרטים'}
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
          }}
          style={{ cursor: 'pointer', color: '#9aa3b2', display: 'flex' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" style={{ transform: open ? 'rotate(180deg)' : 'none' }}>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function actionBtn(bg: string, color: string) {
  return {
    height: 30,
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '0 14px',
    borderRadius: 7,
    background: bg,
    color,
    font: '700 12px Assistant,sans-serif',
    cursor: 'pointer',
  } as const;
}

function IconBtn({ title, onClick, children }: { title: string; onClick?: () => void; children: ReactNode }) {
  return (
    <span title={title} onClick={onClick} className="tool-icon-btn" style={{ width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ec3ff', cursor: 'pointer' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </span>
  );
}
