import type { CSSProperties } from 'react';

interface ConfirmDialogProps {
  title: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  style?: CSSProperties;
}

export default function ConfirmDialog({ title, body, confirmLabel = 'כן', cancelLabel = 'לא', onConfirm, onCancel, style }: ConfirmDialogProps) {
  return (
    <div
      dir="rtl"
      role="dialog"
      onClick={(e) => e.stopPropagation()}
      style={{
        width: 340,
        padding: 16,
        borderRadius: 14,
        background: 'rgba(26,28,33,.94)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(255,255,255,.12)',
        boxShadow: '0 20px 60px rgba(0,0,0,.55)',
        fontFamily: 'Assistant,sans-serif',
        animation: 'dlg-in 160ms cubic-bezier(.2,0,0,1)',
        ...style,
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span
          style={{
            width: 34,
            height: 34,
            flex: '0 0 34px',
            borderRadius: 10,
            background: 'linear-gradient(135deg,#2c5bd8,#6a3fd1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="#eaf0ff">
            <path d="M12 2c.9 3.4 1.9 4.9 4.6 5.6-2.7.7-3.7 2.2-4.6 5.6-.9-3.4-1.9-4.9-4.6-5.6C10.1 6.9 11.1 5.4 12 2Z" />
            <path d="M19 13c.5 1.8 1 2.5 2.4 2.9-1.4.4-1.9 1.1-2.4 2.9-.5-1.8-1-2.5-2.4-2.9 1.4-.4 1.9-1.1 2.4-2.9Z" />
          </svg>
        </span>
        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
          <div style={{ font: '700 14px/1.35 Assistant,sans-serif', color: '#f1f5fa' }}>{title}</div>
          <div style={{ font: '400 12px/1.5 Assistant,sans-serif', color: '#aeb6c2', marginTop: 4 }}>{body}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 14 }}>
        <span onClick={onCancel} className="bar-pill" style={btn('rgba(255,255,255,.1)', '#e7edf7')}>
          {cancelLabel}
        </span>
        <span onClick={onConfirm} className="bar-pill" style={btn('#1f6feb', '#fff')}>
          {confirmLabel}
        </span>
      </div>
    </div>
  );
}

function btn(bg: string, color: string) {
  return {
    height: 30,
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    borderRadius: 8,
    background: bg,
    color,
    font: '600 12px Assistant,sans-serif',
    cursor: 'pointer',
  } as const;
}
