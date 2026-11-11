import { useState, type ReactNode } from 'react';
import type { EntityItem } from '../data';
import { aerialTileUrl, entityCoord, offsetCoord } from '../data';
import type { ScreenPoint } from './MapView';

interface EntityHoverCardProps {
  entity: EntityItem;
  anchor: ScreenPoint;
  rightInset: number;
  onClose: () => void;
  onView: () => void;
}

const CARD_W = 280;
const CARD_H = 186;

export function EntityThumb({ entity, w, h, radius }: { entity: EntityItem; w: number | string; h: number; radius: number }) {
  const [lat, lng] = offsetCoord(entity.dy, entity.dx);
  return (
    <div
      style={{
        width: w,
        height: h,
        flex: typeof w === 'number' ? `0 0 ${w}px` : undefined,
        borderRadius: radius,
        overflow: 'hidden',
        background: 'repeating-linear-gradient(135deg,#3a3d42 0 6px,#33363b 6px 12px)',
      }}
    >
      <img
        src={aerialTileUrl(lat, lng)}
        alt=""
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.15)', display: 'block' }}
      />
    </div>
  );
}

function summaryText(e: EntityItem) {
  return `${e.name} (${e.kind})\nמיקום: ${e.location} · ${entityCoord(e)}\nסוג מקור: ${e.source} · מרחב: ${e.area}\nעודכן: ${e.updated}`;
}

export default function EntityHoverCard({ entity, anchor, rightInset, onClose, onView }: EntityHoverCardProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const height = collapsed ? 70 : CARD_H;
  const left = Math.max(Math.min(anchor.x - 40, vw - rightInset - CARD_W - 8), 8);
  const below = anchor.y + 24;
  const top = below + height > vh - 12 ? Math.max(anchor.y - 24 - height, 52) : below;

  function copy() {
    navigator.clipboard?.writeText(summaryText(entity));
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div
      dir="rtl"
      onClick={(ev) => ev.stopPropagation()}
      style={{
        position: 'absolute',
        left,
        top,
        width: CARD_W,
        zIndex: 640,
        padding: 12,
        borderRadius: 12,
        background: 'rgba(26,28,32,.9)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(255,255,255,.1)',
        boxShadow: '0 16px 48px rgba(0,0,0,.55)',
        fontFamily: 'Assistant,sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <EntityThumb entity={entity} w={collapsed ? 40 : 58} h={collapsed ? 40 : 58} radius={6} />
        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
          <div style={{ font: '700 13.5px/1.3 Assistant,sans-serif', color: '#f1f5fa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{entity.name}</div>
          <div style={{ font: '400 10.5px Assistant,sans-serif', color: '#9aa3b2', direction: 'ltr', textAlign: 'right', marginTop: 2 }}>{entity.updated}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: '0 0 auto' }}>
          <HeadBtn title="פתיחת כרטיס מלא" onClick={onView}>
            <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />
          </HeadBtn>
          <HeadBtn title={collapsed ? 'הרחבה' : 'מזעור'} onClick={() => setCollapsed((v) => !v)}>
            <path d="M6 12h12" />
          </HeadBtn>
          <HeadBtn title="סגירה" onClick={onClose}>
            <path d="M18 6 6 18M6 6l12 12" />
          </HeadBtn>
        </div>
      </div>

      {!collapsed && (
        <>
          <div style={{ height: 1, background: 'rgba(255,255,255,.1)', margin: '10px 0' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 7, columnGap: 10 }}>
            <Field label="סוג" value={entity.kind} />
            <Field label="מיקום" value={entity.location} />
            <Field label="סוג מקור" value={entity.source} />
            <Field label="מרחב" value={entity.area} />
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,.1)', margin: '10px 0' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
            <span onClick={copy} className="bar-pill" style={btnStyle('rgba(255,255,255,.12)', '#e7edf7')}>
              {copied ? 'הועתק ✓' : 'העתקה'}
            </span>
            <span onClick={onView} className="bar-pill" style={btnStyle('#1f6feb', '#fff')}>
              צפייה
            </span>
          </div>
        </>
      )}
    </div>
  );
}

function btnStyle(bg: string, color: string) {
  return {
    height: 28,
    display: 'flex',
    alignItems: 'center',
    padding: '0 14px',
    borderRadius: 7,
    background: bg,
    color,
    font: '600 11.5px Assistant,sans-serif',
    cursor: 'pointer',
  } as const;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ font: '400 11px/1.35 Assistant,sans-serif', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      <span style={{ color: '#8f97a6' }}>{label}: </span>
      <span style={{ color: '#e7edf7' }}>{value}</span>
    </div>
  );
}

function HeadBtn({ title, onClick, children }: { title: string; onClick: () => void; children: ReactNode }) {
  return (
    <span
      title={title}
      onClick={onClick}
      className="tool-icon-btn"
      style={{ width: 22, height: 22, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9d1dc', cursor: 'pointer' }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </span>
  );
}
