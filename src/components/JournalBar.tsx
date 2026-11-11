import { useState } from 'react';
import type { RecItem } from '../data';

interface JournalBarProps {
  mapRight: string;
  activeRec: RecItem | null;
  onSubmit: (text: string, tab: string) => void;
  onFinishRec: (verdict: 'שווא' | 'חשוד') => void;
}

const TABS = ['כללי', 'מודיעין', 'אישורים'];

export default function JournalBar({ mapRight, activeRec, onSubmit, onFinishRec }: JournalBarProps) {
  const [tab, setTab] = useState(TABS[0]);
  const [text, setText] = useState('');
  const [verdict, setVerdict] = useState<'שווא' | 'חשוד'>('חשוד');

  function send() {
    const t = text.trim();
    if (!t) return;
    onSubmit(t, tab);
    setText('');
  }

  return (
    <div
      dir="rtl"
      style={{ position: 'absolute', bottom: 16, right: `calc(${mapRight} + 70px)`, zIndex: 600, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, width: 440, maxWidth: 'calc(100vw - 200px)', fontFamily: 'Assistant,sans-serif' }}
    >
      <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,.12)' }}>
        {TABS.map((t) => (
          <span
            key={t}
            onClick={() => setTab(t)}
            className="seg-opt"
            style={{ padding: '6px 18px', cursor: 'pointer', font: `${t === tab ? 700 : 500} 12px Assistant,sans-serif`, background: t === tab ? '#0e1013' : 'rgba(60,66,78,.92)', color: t === tab ? '#fff' : '#c8d0dd' }}
          >
            {t}
          </span>
        ))}
      </div>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 12px', borderRadius: 9, background: '#0e1013', border: '1px solid rgba(255,255,255,.12)', boxShadow: '0 12px 40px rgba(0,0,0,.45)' }}>
        <span onClick={send} title="שליחה" style={{ color: text.trim() ? '#9ec3ff' : '#6b7380', cursor: 'pointer', display: 'flex' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
            <path d="M12 19V5M6 11l6-6 6 6" />
          </svg>
        </span>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') send();
          }}
          placeholder={activeRec ? 'הוספת תיאור להמלצה' : 'הוספת דיווח ליומן'}
          style={{ flex: '1 1 auto', minWidth: 0, height: 30, border: 0, outline: 'none', background: 'transparent', color: '#e7edf7', font: '500 12.5px Assistant,sans-serif', textAlign: 'right' }}
        />
        <span title="מיקום" style={{ color: '#9aa3b2', display: 'flex' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9}>
            <circle cx="12" cy="10" r="3" />
            <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" />
          </svg>
        </span>
        <span title="הקלטה" style={{ color: '#9aa3b2', display: 'flex' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round">
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
          </svg>
        </span>
      </div>
      {activeRec && (
        <div style={{ width: '100%', display: 'flex', alignItems: 'stretch', gap: 8, padding: 8, borderRadius: 10, background: 'rgba(20,32,52,.94)', border: '1px solid rgba(77,141,255,.35)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {(['חשוד', 'שווא'] as const).map((v) => (
              <span
                key={v}
                onClick={() => setVerdict(v)}
                style={{ padding: '3px 12px', borderRadius: 6, cursor: 'pointer', font: '700 12px Assistant,sans-serif', color: verdict === v ? '#fff' : '#9aa3b2', background: verdict === v ? (v === 'חשוד' ? 'rgba(245,165,36,.3)' : 'rgba(255,92,92,.25)') : 'transparent' }}
              >
                {v === 'חשוד' ? '◎ ' : '✕ '}
                {v}
              </span>
            ))}
          </div>
          <span
            onClick={() => onFinishRec(verdict)}
            className="bar-pill"
            style={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 8, background: '#1f6feb', color: '#fff', font: '700 13px Assistant,sans-serif', cursor: 'pointer' }}
          >
            סיום טיפול בהמלצה {activeRec.id}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round">
              <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7Z" />
            </svg>
          </span>
        </div>
      )}
    </div>
  );
}
