interface AiFabProps {
  onClick: () => void;
}

export default function AiFab({ onClick }: AiFabProps) {
  return (
    <div
      onClick={onClick}
      title="סוכן גזרה מבצעית"
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 650,
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'linear-gradient(135deg,#4f7bff,#8a5cf6,#e05ad0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 8px 28px rgba(90,60,220,.45), 0 0 0 1px rgba(255,255,255,.12)',
      }}
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="url(#ai-fab-gradient)">
        <defs>
          <linearGradient id="ai-fab-gradient" x1="0" y1="0" x2="24" y2="24">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#eaf0ff" />
          </linearGradient>
        </defs>
        <path d="M12 2c.9 3.4 1.9 4.9 4.6 5.6-2.7.7-3.7 2.2-4.6 5.6-.9-3.4-1.9-4.9-4.6-5.6C10.1 6.9 11.1 5.4 12 2Z" />
        <path d="M19 13c.5 1.8 1 2.5 2.4 2.9-1.4.4-1.9 1.1-2.4 2.9-.5-1.8-1-2.5-2.4-2.9 1.4-.4 1.9-1.1 2.4-2.9Z" />
        <path d="M6 15c.4 1.4.8 1.9 1.9 2.2-1.1.3-1.5.8-1.9 2.2-.4-1.4-.8-1.9-1.9-2.2 1.1-.3 1.5-.8 1.9-2.2Z" />
      </svg>
    </div>
  );
}
