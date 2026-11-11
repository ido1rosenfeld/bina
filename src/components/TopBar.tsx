import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ROLES, type RoleId } from '../data';

function formatClock(d: Date) {
  const p = (n: number) => String(n).padStart(2, '0');
  return { time: `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`, date: `${p(d.getDate())}/${p(d.getMonth() + 1)}` };
}

const PILL = {
  display: 'flex',
  alignItems: 'center',
  background: 'rgba(255,255,255,.05)',
  border: '1px solid rgba(255,255,255,.12)',
  borderRadius: 8,
} as const;

function Icon({ size = 17, children }: { size?: number; children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#C9D4DE" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

function Chevron({ up }: { up?: boolean }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8B95A1" strokeWidth={2.4} strokeLinecap="round" style={{ transform: up ? 'rotate(180deg)' : undefined }}>
      <path d="m6 9.5 6 6 6-6" />
    </svg>
  );
}

function TwoLine({ top, bottom }: { top: string; bottom: string }) {
  return (
    <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'nowrap' }}>
      <span style={{ font: '700 13px/15px Assistant,sans-serif', color: '#E9F2FA' }}>{top}</span>
      <span style={{ font: '500 11px/13px Assistant,sans-serif', color: '#9AA6B2' }}>{bottom}</span>
    </div>
  );
}

export default function TopBar({ role, onRole }: { role: RoleId; onRole: (r: RoleId) => void }) {
  const [now, setNow] = useState(() => formatClock(new Date()));
  const [menu, setMenu] = useState<{ top: number; right: number; width: number } | null>(null);
  const roleBtn = useRef<HTMLDivElement | null>(null);
  const current = ROLES.find((r) => r.id === role) ?? ROLES[0];

  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [menu]);

  function toggleMenu(e: MouseEvent) {
    e.stopPropagation();
    if (menu) return setMenu(null);
    const r = roleBtn.current?.getBoundingClientRect();
    if (r) setMenu({ top: r.bottom + 6, right: window.innerWidth - r.right, width: r.width });
  }

  useEffect(() => {
    const id = setInterval(() => setNow(formatClock(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      dir="ltr"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 44,
        zIndex: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 10px 0 12px',
        background: 'linear-gradient(#1F2124,#191A1C)',
        borderBottom: '1px solid rgba(255,255,255,.09)',
        boxShadow: '0 2px 8px rgba(0,0,0,.35)',
        overflow: 'hidden',
      }}
    >
      <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'baseline', gap: 8, whiteSpace: 'nowrap' }}>
        <span style={{ font: '700 13px Assistant,sans-serif', color: '#E9F2FA' }}>{now.date}</span>
        <span style={{ font: '500 13px Assistant,sans-serif', color: '#C9D4DE', fontVariantNumeric: 'tabular-nums' }}>{now.time}</span>
      </div>

      <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 2 }}>
        <div className="icon-btn" title="קליטה">
          <Icon>
            <path d="M5 12.5a10 10 0 0 1 14 0M2.5 9a15 15 0 0 1 19 0M8.5 16a6 6 0 0 1 7 0" />
            <path d="M12 19.5h.01" strokeWidth={2.2} />
          </Icon>
        </div>
        <div className="icon-btn" title="סימניות">
          <Icon>
            <path d="M6.5 3.5h11v17l-5.5-4-5.5 4z" />
          </Icon>
        </div>
        <div className="icon-btn" title="הגדרות">
          <Icon>
            <circle cx="12" cy="12" r="3.1" />
            <path d="M19.1 14.6a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.2a2 2 0 1 1-4 0a1.6 1.6 0 0 0-2.7-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3.4 14H3.2a2 2 0 1 1 0-4a1.6 1.6 0 0 0 1.1-2.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10 3.4V3.2a2 2 0 1 1 4 0a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7h.2a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.5 1.1Z" />
          </Icon>
        </div>
        <div className="icon-btn" title="עזרה">
          <Icon>
            <circle cx="12" cy="12" r="9.2" />
            <path d="M9.7 9.6a2.4 2.4 0 0 1 4.7.1c0 1.8-2.3 1.9-2.3 3.6" />
            <path d="M12 16.8h.01" strokeWidth={2.2} />
          </Icon>
        </div>
        <div className="icon-btn" title="התראות">
          <Icon>
            <path d="M18 8.5a6 6 0 0 0-12 0c0 6.5-2.5 8.5-2.5 8.5h17S18 15 18 8.5M13.6 20.5a1.9 1.9 0 0 1-3.2 0" />
          </Icon>
        </div>
      </div>

      <div className="search-box" style={{ ...PILL, flex: '0 1 190px', minWidth: 0, gap: 7, height: 28, padding: '0 10px', borderRadius: 14 }}>
        <Icon size={14}>
          <path d="M4 7h16M6.5 12h11M9.5 17h5" />
        </Icon>
        <input dir="rtl" placeholder="חיפוש" style={{ flex: '1 1 auto', minWidth: 0, height: 26, border: 0, outline: 'none', background: 'transparent', color: '#E9F2FA', font: '400 12px Assistant,sans-serif', textAlign: 'right' }} />
        <Icon size={14}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.6-3.6" />
        </Icon>
      </div>

      <div style={{ flex: '1 1 auto', minWidth: 8 }} />

      <div className="pill-btn" style={{ ...PILL, flex: '0 0 auto', gap: 14, height: 34, padding: '0 14px 0 6px' }}>
        <span style={{ width: 22, height: 22, borderRadius: 5, background: 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Chevron up />
        </span>
        <TwoLine top="חרבות ברזל" bottom="מבצע סופה במדבר" />
        <svg width="20" height="25" viewBox="0 0 35 45" fill="none" style={{ flex: '0 0 20px' }}>
          <path d="M33.3 0c.9 0 1.6.7 1.7 1.7v22.6l-.1 1.5C33 35.3 27.5 42.6 18.4 47.8c-.5.3-1 .3-1.6.1C8 42.7 2.2 35.6.3 26.5L0 24.4V1.7C0 .9.5.3 1.3.1L1.7 0h31.6Z" fill="#8a6a3b" />
          <path d="M4 4.5A1 1 0 0 1 5 3.5h25a1 1 0 0 1 1 1v27.7c-1.7 5.3-5.3 9.5-10.8 12.6-.4.2-.9.2-1.3 0C13.2 41.6 9.5 37.3 8 32.2V4.5Z" fill="#2A2D30" />
          <path d="M17.5 10v20M11 16l6.5 6 6.5-6" stroke="#d9b779" strokeWidth={2.2} strokeLinecap="round" />
        </svg>
        <TwoLine top="מציאות מבצעית" bottom={current.name} />
      </div>

      <div style={{ flex: '1 1 auto', minWidth: 8 }} />

      <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div className="icon-btn" title="פריסת מסך">
          <Icon>
            <rect x="3" y="4" width="18" height="16" rx="2.4" />
            <path d="M9.6 4v16M3 12h6.6" />
          </Icon>
        </div>
        <div ref={roleBtn} onClick={toggleMenu} className="pill-btn" style={{ ...PILL, gap: 10, height: 32, padding: '0 8px', minWidth: 170, justifyContent: 'space-between', cursor: 'pointer', borderColor: menu ? 'rgba(91,155,255,.6)' : 'rgba(255,255,255,.12)' }}>
          <Chevron />
          <div dir="rtl" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', whiteSpace: 'nowrap' }}>
              <span style={{ font: '500 10px/12px Assistant,sans-serif', color: '#9AA6B2' }}>{current.unit}</span>
              <span style={{ font: '700 12.5px/14px Assistant,sans-serif', color: '#E9F2FA' }}>{current.name}</span>
            </div>
            <span style={{ width: 22, height: 22, borderRadius: 5, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={12}>
                <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
              </Icon>
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <div className="icon-btn" title="תפריט" style={{ background: 'rgba(91,155,255,.18)', border: '1px solid rgba(91,155,255,.45)' }}>
            <Icon>
              <path d="M5 7h14M5 12h14M5 17h14" />
            </Icon>
          </div>
          <Icon size={13}>
            <path d="m9 6 6 6-6 6" />
          </Icon>
        </div>
      </div>
      {menu &&
        createPortal(
        <div
          dir="rtl"
          onClick={(e) => e.stopPropagation()}
          style={{ position: 'fixed', top: menu.top, right: menu.right, width: Math.max(menu.width, 190), zIndex: 1000, padding: 6, borderRadius: 10, background: '#1f2226', border: '1px solid rgba(255,255,255,.12)', boxShadow: '0 16px 44px rgba(0,0,0,.55)' }}
        >
          {ROLES.map((r) => {
            const on = r.id === role;
            return (
              <div
                key={r.id}
                onClick={() => {
                  onRole(r.id);
                  setMenu(null);
                }}
                className="bar-pill"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 34, padding: '0 10px', borderRadius: 7, cursor: 'pointer', background: on ? 'rgba(31,111,235,.22)' : 'transparent', color: on ? '#cfe0ff' : '#e7edf7', font: `${on ? 700 : 500} 13px Assistant,sans-serif` }}
              >
                {r.name}
                {on && <span style={{ color: '#8fb8ff' }}>✓</span>}
              </div>
            );
          })}
        </div>,
          document.body,
        )}
    </div>
  );
}
