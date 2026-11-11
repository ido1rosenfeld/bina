import { useEffect, useState, type ReactNode } from 'react';
import ConfirmDialog from './ConfirmDialog';
import MapView from './MapView';
import FilterBar from './FilterBar';

interface MissionSheetProps {
  onClose: () => void;
  onToast: (msg: string) => void;
  layers: Record<string, boolean>;
  toggleLayer: (key: string) => void;
}

const noop = () => {};

const STATUSES = ['ממתין', 'בביצוע', 'הושלם'];

const FIELD = {
  width: '100%',
  boxSizing: 'border-box',
  border: '1px solid rgba(255,255,255,.14)',
  borderRadius: 7,
  background: 'rgba(0,0,0,.2)',
  color: '#e7edf7',
  font: '400 12px/1.5 Assistant,sans-serif',
  outline: 'none',
  padding: '6px 10px',
  textAlign: 'right',
} as const;

export default function MissionSheet({ onClose, onToast, layers, toggleLayer }: MissionSheetProps) {
  const [title, setTitle] = useState('The Goat');
  const [phases, setPhases] = useState([
    { name: 'היערכות', status: 'ממתין' },
    { name: 'תנועה', status: 'ממתין' },
    { name: 'ביצוע', status: 'ממתין' },
    { name: 'חזרה', status: 'ממתין' },
  ]);
  const [askHistory, setAskHistory] = useState(true);
  const [full, setFull] = useState(false);
  const [bina, setBina] = useState<'off' | 'loading' | 'on'>('off');
  const [docOpen, setDocOpen] = useState(false);

  useEffect(() => {
    if (bina !== 'loading') return;
    const t = window.setTimeout(() => setBina('on'), 750);
    return () => window.clearTimeout(t);
  }, [bina]);

  return (
    <div
      onClick={onClose}
      style={{ position: 'absolute', inset: 0, zIndex: 900, background: 'rgba(5,7,10,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: full ? 0 : '56px 24px 24px' }}
    >
      <div
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: full ? '100%' : 'min(1180px, 100%)',
          height: full ? '100%' : 'min(720px, 100%)',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: full ? 0 : 14,
          overflow: 'hidden',
          background: '#24272d',
          border: '1px solid rgba(255,255,255,.1)',
          boxShadow: '0 30px 90px rgba(0,0,0,.6)',
          fontFamily: 'Assistant,sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 52, padding: '0 16px', background: '#1d2025', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <svg width="24" height="30" viewBox="0 0 35 45" fill="none">
            <path d="M33.3 0c.9 0 1.6.7 1.7 1.7v22.6l-.1 1.5C33 35.3 27.5 42.6 18.4 47.8c-.5.3-1 .3-1.6.1C8 42.7 2.2 35.6.3 26.5L0 24.4V1.7C0 .9.5.3 1.3.1L1.7 0h31.6Z" fill="#8a6a3b" />
            <path d="M4 4.5A1 1 0 0 1 5 3.5h25a1 1 0 0 1 1 1v27.7c-1.7 5.3-5.3 9.5-10.8 12.6-.4.2-.9.2-1.3 0C13.2 41.6 9.5 37.3 8 32.2V4.5Z" fill="#2A2D30" />
            <path d="M17.5 10v20M11 16l6.5 6 6.5-6" stroke="#d9b779" strokeWidth={2.2} strokeLinecap="round" />
          </svg>
          <span style={{ font: '700 17px Assistant,sans-serif', color: '#f1f5fa' }}>דפית משימה</span>
          <span style={{ direction: 'rtl', padding: '3px 10px', borderRadius: 6, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', font: '500 11.5px Assistant,sans-serif', color: '#c8d0dd' }}>
            תכנון: 26.04 | 10:25 עד 12:25
          </span>
          <div style={{ flex: '1 1 auto' }} />
          <HeadBtn title="אפשרויות">
            <path d="M12 5h.01M12 12h.01M12 19h.01" strokeWidth={3} />
          </HeadBtn>
          <HeadBtn title="תצוגה בהירה">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </HeadBtn>
          <HeadBtn title={full ? 'יציאה ממסך מלא' : 'מסך מלא'} onClick={() => setFull((v) => !v)}>
            <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />
          </HeadBtn>
          <HeadBtn title="סגירה" onClick={onClose}>
            <path d="M18 6 6 18M6 6l12 12" />
          </HeadBtn>
        </div>

        <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex' }}>
          <div style={{ width: 430, flex: '0 0 430px', overflowY: 'auto', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 14, borderLeft: '1px solid rgba(255,255,255,.08)' }}>
            <Row label="כותרת" required>
              <div style={{ ...FIELD, display: 'flex', alignItems: 'center', gap: 6, borderColor: '#2f6fd6', padding: '0 10px' }}>
                <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ flex: '1 1 auto', height: 30, border: 0, outline: 'none', background: 'transparent', color: '#e7edf7', font: '600 12.5px Assistant,sans-serif', textAlign: 'right' }} />
                {title && (
                  <span onClick={() => setTitle('')} style={{ color: '#9aa3b2', cursor: 'pointer', fontSize: 13 }}>
                    ✕
                  </span>
                )}
              </div>
            </Row>
            <Row label="מסגרת">
              <input placeholder='מחלקה, צק"פ, צק"ח' style={{ ...FIELD, height: 32 }} />
            </Row>
            <Row label="שלבים">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {phases.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 4px 4px 10px', borderRadius: 7, background: 'rgba(255,255,255,.05)' }}>
                    <input
                      value={p.name}
                      onChange={(e) => setPhases((s) => s.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                      style={{ flex: '1 1 auto', minWidth: 0, height: 28, border: 0, outline: 'none', background: 'transparent', color: '#e7edf7', font: '600 12px Assistant,sans-serif', textAlign: 'right' }}
                    />
                    <span style={{ font: '400 11px Assistant,sans-serif', color: '#8f97a6' }}>סטטוס</span>
                    <select
                      value={p.status}
                      onChange={(e) => setPhases((s) => s.map((x, j) => (j === i ? { ...x, status: e.target.value } : x)))}
                      style={{ height: 26, borderRadius: 6, border: '1px solid rgba(255,255,255,.16)', background: '#1b1e23', color: statusColor(p.status), font: '600 11px Assistant,sans-serif', padding: '0 6px' }}
                    >
                      {STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                ))}
                <span
                  onClick={() => setPhases((s) => [...s, { name: `שלב ${s.length + 1}`, status: 'ממתין' }])}
                  className="bar-pill"
                  style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 5, height: 28, padding: '0 10px', borderRadius: 7, border: '1px dashed rgba(255,255,255,.22)', color: '#9ec3ff', font: '600 11.5px Assistant,sans-serif', cursor: 'pointer' }}
                >
                  + הוספת שלב
                </span>
              </div>
            </Row>
            <Row label="כוחות ומשימות">
              <textarea rows={3} defaultValue={'- כוח מוביל\n- כוח סיוע\n- עתודה כבדה'} style={{ ...FIELD, resize: 'vertical' }} />
            </Row>
            <Row label="רפואה ופינוי">
              <textarea rows={2} placeholder="נקודות איסוף ופינוי" style={{ ...FIELD, resize: 'vertical' }} />
            </Row>
            <Row label="דרישות">
              <textarea rows={2} placeholder="אמצעים וסיוע נדרשים" style={{ ...FIELD, resize: 'vertical' }} />
            </Row>
            <Row label="תנאים לביצוע">
              <textarea rows={2} placeholder="תנאי סף לתחילת הביצוע" style={{ ...FIELD, resize: 'vertical' }} />
            </Row>
            <Row label="זמני ביצוע">
              <input defaultValue="26.04 10:25 – 12:25" style={{ ...FIELD, height: 32, direction: 'ltr', textAlign: 'right' }} />
            </Row>
            <Row label={'נ"צ / מיקום'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input defaultValue="662323/501096" style={{ ...FIELD, height: 32, direction: 'ltr', textAlign: 'right' }} />
                <span
                  title="היסטוריה גזרתית סביב הנ״צ"
                  onClick={() => bina === 'off' && setAskHistory(true)}
                  className="bar-pill"
                  style={{ width: 32, height: 32, flex: '0 0 32px', borderRadius: 7, background: 'rgba(31,111,235,.2)', border: '1px solid rgba(77,141,255,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#9ec3ff' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="10" r="3" />
                    <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" />
                  </svg>
                </span>
              </div>
            </Row>
          </div>

          <div style={{ flex: '1 1 auto', position: 'relative', overflow: 'hidden', background: '#14151a' }}>
            <MapView layers={layers} mapRight="0px" selectedEntityId={null} onSelectEntity={noop} onEntityAnchor={noop} />
            <div style={{ position: 'absolute', left: '50%', top: '50%', zIndex: 500, pointerEvents: 'none', transform: 'translate(-50%,-100%)', color: '#ff5c5c', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.6))' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" stroke="#fff" strokeWidth={1.2}>
                <path d="M12 22s-7-6.4-7-12a7 7 0 0 1 14 0c0 5.6-7 12-7 12Z" />
                <circle cx="12" cy="10" r="2.6" fill="#fff" />
              </svg>
            </div>
            {bina === 'loading' && (
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 24, zIndex: 700, display: 'flex', justifyContent: 'center' }}>
                <div className="bina-in" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 12, background: 'rgba(26,28,33,.94)', border: '1px solid rgba(255,255,255,.12)', color: '#e7edf7', font: '600 12.5px Assistant,sans-serif', boxShadow: '0 16px 44px rgba(0,0,0,.5)' }}>
                  <span className="bina-spin" style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(158,195,255,.25)', borderTopColor: '#9ec3ff' }} />
                  הורוס בינה טוען היסטוריה גזרתית סביב הנ״צ…
                </div>
              </div>
            )}
            {bina === 'on' && (
              <div className="bina-in" style={{ position: 'absolute', inset: 0, zIndex: 600, pointerEvents: 'none' }}>
                <FilterBar mapRight="0px" docOpen={docOpen} toggleDoc={() => setDocOpen((v) => !v)} layers={layers} toggleLayer={toggleLayer} onClose={() => setBina('off')} />
              </div>
            )}
            {askHistory && (
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 20, zIndex: 700, display: 'flex', justifyContent: 'center' }}>
                <ConfirmDialog
                  title={'האם ברצונך לקבל היסטוריה גזרתית סביב הנ"צ?'}
                  body="הורוס בינה יסכם את ההתרחשויות, התשתיות והמגמות בגזרה סביב המיקום שנבחר."
                  confirmLabel="כן, פתח בהורוס בינה"
                  onConfirm={() => {
                    setAskHistory(false);
                    setBina('loading');
                  }}
                  onCancel={() => setAskHistory(false)}
                />
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#1d2025', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <span onClick={() => onToast('הדפית נשמרה כטיוטה')} className="bar-pill" style={{ height: 32, display: 'flex', alignItems: 'center', padding: '0 16px', borderRadius: 8, background: '#1f6feb', color: '#fff', font: '600 12.5px Assistant,sans-serif', cursor: 'pointer' }}>
            שמירה כטיוטה
          </span>
          <span onClick={onClose} className="bar-pill" style={{ height: 32, display: 'flex', alignItems: 'center', padding: '0 16px', borderRadius: 8, background: 'rgba(255,255,255,.08)', color: '#e7edf7', font: '600 12.5px Assistant,sans-serif', cursor: 'pointer' }}>
            ביטול
          </span>
        </div>
      </div>
    </div>
  );
}

function statusColor(s: string) {
  return s === 'הושלם' ? '#7fdcab' : s === 'בביצוע' ? '#f5c518' : '#c8d0dd';
}

function Row({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{ width: 92, flex: '0 0 92px', paddingTop: 7, font: '600 12px Assistant,sans-serif', color: '#c8d0dd' }}>
        {label}
        {required && <span style={{ color: '#ff5c5c' }}> *</span>}
      </div>
      <div style={{ flex: '1 1 auto', minWidth: 0 }}>{children}</div>
    </div>
  );
}

function HeadBtn({ title, onClick, children }: { title: string; onClick?: () => void; children: ReactNode }) {
  return (
    <span title={title} onClick={onClick} className="tool-icon-btn" style={{ width: 30, height: 30, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9d1dc', cursor: 'pointer' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </span>
  );
}
