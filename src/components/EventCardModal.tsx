import type { EventItem } from '../data';

interface EventCardModalProps {
  event: EventItem;
  onClose: () => void;
  onJumpToMap: () => void;
}

export default function EventCardModal({ event, onClose, onJumpToMap }: EventCardModalProps) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 6, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 60, background: 'rgba(0,0,0,.45)' }}>
      <div style={{ width: 340, border: '1px solid rgba(255,255,255,.13)', borderRadius: 10, background: '#1B1C1D', boxShadow: '0 20px 60px rgba(0,0,0,.6)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderBottom: '1px solid rgba(255,255,255,.13)' }}>
          <span style={{ font: '700 12px Assistant,sans-serif', color: '#E6F5FF' }}>כרטיס אירוע</span>
          <span onClick={onClose} style={{ font: '400 13px Assistant,sans-serif', color: '#8F91A0', cursor: 'pointer' }}>
            ✕
          </span>
        </div>
        <div style={{ padding: 12 }}>
          <div style={{ font: '600 13px/1.5 Assistant,sans-serif', color: '#E6F5FF', marginBottom: 8 }}>{event.text}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '5px 10px', font: '400 11px Assistant,sans-serif', color: '#c8d0dd' }}>
            <span style={{ color: '#8F91A0' }}>זמן</span>
            <span style={{ direction: 'ltr', textAlign: 'right' }}>{event.time}</span>
            <span style={{ color: '#8F91A0' }}>מקום</span>
            <span>{event.place}</span>
            <span style={{ color: '#8F91A0' }}>נ״צ</span>
            <span style={{ direction: 'ltr', textAlign: 'right' }}>{event.coord}</span>
            <span style={{ color: '#8F91A0' }}>חומרה</span>
            <span>{`דרגה ${event.sev}`}</span>
            <span style={{ color: '#8F91A0' }}>גורם מדווח</span>
            <span>{event.source}</span>
          </div>
          <div
            onClick={onJumpToMap}
            style={{
              marginTop: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              height: 30,
              background: 'rgba(24,110,255,.18)',
              border: '1px solid #2f5d8a',
              borderRadius: 7,
              font: '600 11px Assistant,sans-serif',
              color: '#9ec3ff',
              cursor: 'pointer',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round">
              <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
              <circle cx="12" cy="10" r="2.4" />
            </svg>
            קפוץ לנ״צ במפה
          </div>
        </div>
      </div>
    </div>
  );
}
