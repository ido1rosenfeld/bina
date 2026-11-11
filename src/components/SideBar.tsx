import type { ReactNode } from 'react';
import { SIDEBAR_W, type RoleId } from '../data';

interface SideBarProps {
  role: RoleId;
  roleShort: string;
  activeKey: string | null;
  onItem: (id: string) => void;
  aiOpen: boolean;
  onToggleAi: () => void;
}

type Item = { id: string; label: string; icon: ReactNode };

const MISSION: Item = { id: 'mission', label: 'דפית משימה', icon: <path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h4" /> };

const AGAM: Item[] = [
  MISSION,
  { id: 'orders', label: 'פקודות והערכת מצב', icon: <path d="M4 5h6v6H4zM14 6h6M14 10h6M4 15h6M4 19h6M14 15h6v4h-6z" /> },
  { id: 'files', label: 'תיקים ותכניות', icon: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" /> },
  { id: 'sync', label: 'סנכרון וניהול הלחימה', icon: <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" /> },
  { id: 'orbat', label: 'סד"כ וציוות', icon: <path d="M4 4h8v8H4zM12 8h8M16 8v12M12 16h8M4 16h4" /> },
  { id: 'c2', label: 'שליטה ובקרה בכוחות', icon: <path d="M3 5h18v12H3zM8 21h8M12 17v4" /> },
  { id: 'plan', label: 'תכנון ומרחב', icon: <path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2ZM9 3v16M15 5v16" /> },
  { id: 'rokak', label: 'רוק"ק', icon: <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M5 5l5 5M19 5l-5 5M5 19l5-5M19 19l-5-5" /> },
];

const EXPOSURE: Item[] = [
  { id: 'shift', label: 'ניהול משמרת', icon: <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20c.8-3 3-4.5 6-4.5s5.2 1.5 6 4.5M14 15.6c.6-.1 1.3-.1 2-.1 3 0 5.2 1.5 6 4.5" /> },
  { id: 'area', label: 'ארגון שטח', icon: <path d="M6 4 18 6l2 12-14 2zM6 4a1.5 1.5 0 1 0 0 .1M18 6a1.5 1.5 0 1 0 0 .1M20 18a1.5 1.5 0 1 0 0 .1M6 20a1.5 1.5 0 1 0 0 .1" /> },
  { id: 'recs', label: 'תור המלצות', icon: <path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2ZM9 3v16M15 5v16" /> },
  { id: 'hits', label: 'הבוקים', icon: <path d="M12 3 21 12 12 21 3 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" /> },
  { id: 'targets', label: 'סינון מטרות', icon: <path d="M3 4h18l-7 8v6l-4 2v-8z" /> },
  { id: 'mapstates', label: 'מצבי מפה', icon: <path d="M6 3h12v18l-6-4-6 4z" /> },
  { id: 'log', label: 'יומן', icon: <path d="M5 4h11l3 3v13H5zM9 9h6M9 13h6M9 17h3" /> },
];

const FIRE: Item[] = [
  { id: 'firemissions', label: 'משימות אש', icon: <path d="M12 3c3 4 6 6 6 11a6 6 0 0 1-12 0c0-3 2-5 3-7 1 2 3 3 3-4Z" /> },
  { id: 'targets', label: 'מטרות', icon: <path d="M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0" /> },
  { id: 'air', label: 'סיוע אווירי', icon: <path d="M2 14l9-2 3-8 2 1-1 7 7 2v2l-7-1-2 5h-2l1-5-8 1z" /> },
  { id: 'coord', label: 'תיאום אש', icon: <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" /> },
  { id: 'log', label: 'יומן', icon: <path d="M5 4h11l3 3v13H5zM9 9h6M9 13h6M9 17h3" /> },
];

const INTEL: Item[] = [
  { id: 'collect', label: 'משימות איסוף', icon: <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" /> },
  { id: 'products', label: 'תוצרי מודיעין', icon: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" /> },
  { id: 'targets', label: 'בנק מטרות', icon: <path d="M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0" /> },
  { id: 'log', label: 'יומן', icon: <path d="M5 4h11l3 3v13H5zM9 9h6M9 13h6M9 17h3" /> },
];

const ITEMS: Record<RoleId, Item[]> = { agam: AGAM, fire: FIRE, exposure: EXPOSURE, intel: INTEL };

export default function SideBar({ role, roleShort, activeKey, onItem, aiOpen, onToggleAi }: SideBarProps) {
  return (
    <div
      dir="rtl"
      style={{
        position: 'absolute',
        top: 44,
        right: 0,
        bottom: 0,
        width: SIDEBAR_W,
        zIndex: 710,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px 0 10px',
        background: 'linear-gradient(#1c1e21,#17181b)',
        borderLeft: '1px solid rgba(255,255,255,.08)',
        fontFamily: 'Assistant,sans-serif',
      }}
    >
      <div style={{ font: '600 9.5px/1.2 Assistant,sans-serif', color: '#9AA6B2', textAlign: 'center', marginBottom: 10 }}>
        יכולות
        <br />
        {roleShort}
      </div>

      <div style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: '100%' }}>
        {ITEMS[role].map((it) => (
          <SideItem key={it.id} label={it.label} active={activeKey === it.id} onClick={() => onItem(it.id)}>
            {it.icon}
          </SideItem>
        ))}
        <div title="עוד" className="side-btn" style={{ width: 26, height: 14, borderRadius: 4, border: '1px solid rgba(255,255,255,.14)', color: '#9AA6B2', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 10px/1 Assistant,sans-serif', cursor: 'pointer' }}>
          ···
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, paddingTop: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, cursor: 'pointer' }} title="תכנון המסלול">
          <span style={{ width: 26, height: 26, borderRadius: 6, background: '#1f9d68', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </span>
          <span style={{ font: '600 9px/1.15 Assistant,sans-serif', color: '#C9D4DE', textAlign: 'center' }}>
            תכנון
            <br />
            המסלול
          </span>
        </div>

        <div
          onClick={onToggleAi}
          title="סוכן בינה מבצעית"
          className="side-btn"
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: aiOpen ? 'linear-gradient(135deg,#2c5bd8,#6a3fd1)' : '#22324f',
            border: `1px solid ${aiOpen ? 'rgba(160,190,255,.8)' : 'rgba(110,150,255,.35)'}`,
            boxShadow: aiOpen ? '0 0 14px rgba(90,120,255,.5)' : 'none',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#eaf0ff">
            <path d="M12 2c.9 3.4 1.9 4.9 4.6 5.6-2.7.7-3.7 2.2-4.6 5.6-.9-3.4-1.9-4.9-4.6-5.6C10.1 6.9 11.1 5.4 12 2Z" />
            <path d="M19 13c.5 1.8 1 2.5 2.4 2.9-1.4.4-1.9 1.1-2.4 2.9-.5-1.8-1-2.5-2.4-2.9 1.4-.4 1.9-1.1 2.4-2.9Z" />
            <path d="M6 15c.4 1.4.8 1.9 1.9 2.2-1.1.3-1.5.8-1.9 2.2-.4-1.4-.8-1.9-1.9-2.2 1.1-.3 1.5-.8 1.9-2.2Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function SideItem({ label, active, onClick, children }: { label: string; active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: '100%', padding: '0 3px', cursor: 'pointer' }}>
      <span
        className="side-btn"
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: active ? 'rgba(91,155,255,.2)' : 'rgba(255,255,255,.05)',
          border: `1px solid ${active ? 'rgba(91,155,255,.7)' : 'rgba(255,255,255,.14)'}`,
          color: active ? '#a9c6ff' : '#C9D4DE',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
          {children}
        </svg>
      </span>
      <span style={{ font: '600 9px/1.15 Assistant,sans-serif', color: active ? '#cfe0ff' : '#C9D4DE', textAlign: 'center' }}>{label}</span>
    </div>
  );
}
