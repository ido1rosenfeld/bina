import { useEffect, useState } from 'react';

function formatClock(d: Date) {
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  return { time: `${hh}:${mm}`, date: `${dd}/${mo}` };
}

export default function TopBar() {
  const [now, setNow] = useState(() => formatClock(new Date()));

  useEffect(() => {
    const id = setInterval(() => setNow(formatClock(new Date())), 15000);
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
        gap: 14,
        padding: '0 14px',
        background: 'linear-gradient(#1F2124,#191A1C)',
        borderBottom: '1px solid rgba(255,255,255,.09)',
        boxShadow: '0 2px 8px rgba(0,0,0,.35)',
        overflow: 'hidden',
      }}
    >
      <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', whiteSpace: 'nowrap' }}>
          <span style={{ font: "600 13px/14px Assistant,sans-serif", color: '#E9F2FA', letterSpacing: '.01em' }}>{now.time}</span>
          <span style={{ font: "400 10px/12px Assistant,sans-serif", color: '#7E8894' }}>{now.date}</span>
        </div>
        <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,.1)' }} />
      </div>

      <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 2 }}>
        <div className="icon-btn">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C9D4DE" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5a10 10 0 0 1 14 0M2.5 9a15 15 0 0 1 19 0M8.5 16a6 6 0 0 1 7 0" />
            <path d="M12 19.5h.01" strokeWidth={2.2} />
          </svg>
        </div>
        <div className="icon-btn">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C9D4DE" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8.5a6 6 0 0 0-12 0c0 6.5-2.5 8.5-2.5 8.5h17S18 15 18 8.5M13.6 20.5a1.9 1.9 0 0 1-3.2 0" />
          </svg>
          <div style={{ position: 'absolute', top: 5, right: 5, width: 7, height: 7, borderRadius: '50%', background: '#FF4848', boxShadow: '0 0 0 2px #1D1F21' }} />
        </div>
        <div className="icon-btn">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C9D4DE" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3.1" />
            <path d="M19.1 14.6a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.2a2 2 0 1 1-4 0a1.6 1.6 0 0 0-2.7-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3.4 14H3.2a2 2 0 1 1 0-4a1.6 1.6 0 0 0 1.1-2.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10 3.4V3.2a2 2 0 1 1 4 0a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7h.2a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.5 1.1Z" />
          </svg>
        </div>
        <div className="icon-btn">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C9D4DE" strokeWidth={1.7} strokeLinecap="round">
            <circle cx="12" cy="12" r="9.2" />
            <path d="M9.7 9.6a2.4 2.4 0 0 1 4.7.1c0 1.8-2.3 1.9-2.3 3.6" />
            <path d="M12 16.8h.01" strokeWidth={2.2} />
          </svg>
        </div>
      </div>

      <div
        className="search-box"
        style={{
          flex: '0 1 220px',
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          height: 28,
          padding: '0 4px 0 10px',
          background: 'rgba(255,255,255,.05)',
          border: '1px solid rgba(255,255,255,.12)',
          borderRadius: 7,
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8B95A1" strokeWidth={1.8} strokeLinecap="round" style={{ flex: '0 0 15px' }}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.6-3.6" />
        </svg>
        <input dir="rtl" placeholder="חיפוש בגזרה" style={{ flex: '1 1 auto', minWidth: 0, height: 26, border: 0, outline: 'none', background: 'transparent', color: '#E9F2FA', font: '400 12px Assistant,sans-serif', textAlign: 'right' }} />
        <div className="icon-btn" style={{ width: 22, height: 22, borderRadius: 5 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B95A1" strokeWidth={1.8} strokeLinecap="round">
            <path d="M4 7h16M6.5 12h11M9.5 17h5" />
          </svg>
        </div>
      </div>

      <div style={{ flex: '1 1 auto', minWidth: 8 }} />

      <div
        className="pill-btn"
        style={{
          flex: '0 0 auto',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          height: 32,
          padding: '0 10px',
          background: 'rgba(255,255,255,.05)',
          border: '1px solid rgba(255,255,255,.12)',
          borderRadius: 8,
        }}
      >
        <svg width="17" height="21" viewBox="0 0 35 45" fill="none" style={{ flex: '0 0 17px' }}>
          <path d="M33.3 0c.9 0 1.6.7 1.7 1.7v22.6l-.1 1.5C33 35.3 27.5 42.6 18.4 47.8c-.5.3-1 .3-1.6.1C8 42.7 2.2 35.6.3 26.5L0 24.4V1.7C0 .9.5.3 1.3.1L1.7 0h31.6ZM31.5 3.4H3.5v19.2c1.4 8.2 5.9 14.6 13.5 19.4l.5.3.5-.3c7.3-4.5 11.7-10.5 13.3-18l.2-1.2V3.4Z" fill="#9AA6B2" />
          <path d="M4 4.5A1 1 0 0 1 5 3.5h25a1 1 0 0 1 1 1v27.7c-1.7 5.3-5.3 9.5-10.8 12.6-.4.2-.9.2-1.3 0C13.2 41.6 9.5 37.3 8 32.2V4.5Z" fill="#2A2D30" />
        </svg>
        <div dir="rtl" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ whiteSpace: 'nowrap', font: '600 10px/12px Assistant,sans-serif', color: '#7E8894', letterSpacing: '.04em' }}>מציאות מבצעית</span>
            <span style={{ whiteSpace: 'nowrap', font: '700 13px/15px Assistant,sans-serif', color: '#E9F2FA' }}>חרבות ברזל</span>
          </div>
          <div style={{ flex: '0 0 1px', width: 1, height: 22, background: 'rgba(255,255,255,.12)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ whiteSpace: 'nowrap', font: '600 10px/12px Assistant,sans-serif', color: '#7E8894', letterSpacing: '.04em' }}>תא תקיפה</span>
            <span style={{ whiteSpace: 'nowrap', font: '700 13px/15px Assistant,sans-serif', color: '#E9F2FA' }}>חטיבה 188</span>
          </div>
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8B95A1" strokeWidth={2.2} strokeLinecap="round" style={{ flex: '0 0 12px' }}>
          <path d="m6 9.5 6 6 6-6" />
        </svg>
      </div>

      <div style={{ flex: '1 1 auto', minWidth: 8 }} />

      <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div
          dir="rtl"
          className="pill-btn"
          style={{ display: 'flex', alignItems: 'center', gap: 7, height: 28, padding: '0 10px', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 7 }}
        >
          <span style={{ font: '600 12px Assistant,sans-serif', color: '#E9F2FA', whiteSpace: 'nowrap' }}>אג"מ</span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8B95A1" strokeWidth={2.2} strokeLinecap="round">
            <path d="m6 9.5 6 6 6-6" />
          </svg>
        </div>
        <div
          dir="rtl"
          className="pill-btn"
          style={{ display: 'flex', alignItems: 'center', gap: 7, height: 28, padding: '0 10px', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 7 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9D4DE" strokeWidth={1.7} strokeLinejoin="round">
            <path d="M12 3 3 7.5l9 4.5 9-4.5L12 3Z" />
            <path d="m3 12.5 9 4.5 9-4.5" />
          </svg>
          <span style={{ font: '600 12px Assistant,sans-serif', color: '#E9F2FA', whiteSpace: 'nowrap' }}>שכבות</span>
        </div>
        <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,.1)', margin: '0 2px' }} />
        <div className="icon-btn">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C9D4DE" strokeWidth={1.7}>
            <rect x="3" y="4" width="18" height="16" rx="2.4" />
            <path d="M9.6 4v16M3 12h6.6" />
          </svg>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'linear-gradient(#3D4249,#2C3036)',
            border: '1px solid rgba(255,255,255,.14)',
            font: '700 10px Assistant,sans-serif',
            color: '#E9F2FA',
            cursor: 'pointer',
          }}
        >
          ער
        </div>
      </div>
    </div>
  );
}
