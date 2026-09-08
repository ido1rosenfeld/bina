import type { EventItem } from '../data';

interface EventListOverlayProps {
  title: string;
  events: EventItem[];
  onClose: () => void;
  onOpenEvent: (ev: EventItem) => void;
}

export default function EventListOverlay({ title, events, onClose, onOpenEvent }: EventListOverlayProps) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 5, display: 'flex', flexDirection: 'column', background: 'rgba(20,21,26,.98)' }}>
      <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 40, padding: '0 14px', borderBottom: '1px solid rgba(255,255,255,.13)', background: '#1B1C1D' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span onClick={onClose} style={{ font: '400 13px Assistant,sans-serif', color: '#8F91A0', cursor: 'pointer' }}>
            → חזור
          </span>
          <span style={{ font: '700 12px Assistant,sans-serif', color: '#E6F5FF' }}>{title}</span>
        </div>
        <span onClick={onClose} style={{ font: '400 14px Assistant,sans-serif', color: '#8F91A0', cursor: 'pointer' }}>
          ✕
        </span>
      </div>
      <div style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', padding: '12px 14px' }}>
        {events.map((ev) => {
          const high = ev.sev >= 3;
          const sevBg = high ? 'rgba(229,72,77,.18)' : 'rgba(245,165,36,.16)';
          const sevBorder = high ? '#7a3b3f' : '#8a6a20';
          const sevColor = high ? '#ff8f92' : '#f5a524';
          return (
            <div
              key={ev.id}
              className="event-row"
              onClick={() => onOpenEvent(ev)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', marginBottom: 6, border: '1px solid rgba(255,255,255,.09)', borderRadius: 8, background: '#2b2e34', cursor: 'pointer' }}
            >
              <span style={{ flex: '0 0 auto', padding: '1px 6px', borderRadius: 4, background: sevBg, border: `1px solid ${sevBorder}`, font: '700 9px Assistant,sans-serif', color: sevColor }}>{`חומרה ${ev.sev}`}</span>
              <span style={{ flex: '1 1 auto', minWidth: 0, font: '400 12px Assistant,sans-serif', color: '#E6F5FF' }}>{ev.text}</span>
              <span style={{ flex: '0 0 auto', font: '400 10px Assistant,sans-serif', color: '#8F91A0', direction: 'ltr' }}>{ev.time}</span>
              <span style={{ flex: '0 0 auto', font: '400 10px Assistant,sans-serif', color: '#8F91A0' }}>{ev.place}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
