import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { T } from './tokens';
import { hexA } from '../../data';
import { lighten } from '../../filters';

export function PanelHeader({ title, onClose, extra }: { title: string; onClose?: () => void; extra?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px 6px 10px', borderBottom: `1px solid ${T.divider}`, flex: '0 0 auto' }}>
      <span style={{ flex: '1 1 auto', font: `700 18px/26px ${T.font}`, color: T.title, letterSpacing: -0.04 }}>{title}</span>
      {extra}
      {onClose && (
        <span onClick={onClose} title="סגירה" className="tool-icon-btn" style={{ width: 26, height: 26, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#c9d1dc' }}>
          <Icon d="M18 6 6 18M6 6l12 12" size={14} />
        </span>
      )}
    </div>
  );
}

export function PanelFooter({ onReset, onSave }: { onReset: () => void; onSave: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 9, padding: '10px 14px 12px', borderTop: `1px solid ${T.divider}`, flex: '0 0 auto' }}>
      <Btn bg={T.neutralBtn} onClick={onReset}>
        איפוס סינון
        <Icon size={12} d="m7 21-4.3-4.3a1 1 0 0 1 0-1.4l9.6-9.6a1 1 0 0 1 1.4 0l5.6 5.6a1 1 0 0 1 0 1.4L11 21M22 21H7M5 11l9 9" />
      </Btn>
      <Btn bg={T.accent} onClick={onSave}>
        שמירה
      </Btn>
    </div>
  );
}

function Btn({ bg, onClick, children }: { bg: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flt-btn"
      style={{ display: 'flex', alignItems: 'center', gap: 4, height: 24, padding: '0 8px', borderRadius: 6, border: 'none', background: bg, color: T.text, font: `600 12px/16px ${T.font}`, cursor: 'pointer' }}
    >
      {children}
    </button>
  );
}

export function Section({ title, color, children, collapsible, footer }: { title: ReactNode; color?: string; children: ReactNode; collapsible?: boolean; footer?: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ background: T.sectionBg, borderRadius: 8, padding: '10px 12px 12px' }}>
      <div
        onClick={collapsible ? () => setOpen((v) => !v) : undefined}
        style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: collapsible ? 'pointer' : 'default', marginBottom: open ? 10 : 0 }}
      >
        <span style={{ flex: '1 1 auto', font: `700 16px/24px ${T.font}`, color: color ?? T.title }}>{title}</span>
        {collapsible && <Chevron up={open} size={18} color="#c9d1dc" />}
      </div>
      {open && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
          {footer}
        </>
      )}
    </div>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <span style={{ font: `400 14px/20px ${T.font}`, color: T.text }}>{children}</span>;
}

/** Radix-style Select (trigger + popover list). The list is portalled so scrolling panels never clip it. */
export function Select({
  label,
  value,
  options,
  onChange,
  placeholder = 'בחר',
  clearable = true,
  display,
}: {
  label?: string;
  value: string | null;
  options: { id: string; label: string; disabled?: boolean }[];
  onChange: (id: string | null) => void;
  placeholder?: string;
  clearable?: boolean;
  display?: string;
}) {
  const [open, setOpen] = useState(false);
  const trigRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ left: number; width: number; top?: number; bottom?: number; maxH: number } | null>(null);

  useLayoutEffect(() => {
    if (!open || !trigRef.current) return;
    const r = trigRef.current.getBoundingClientRect();
    const below = window.innerHeight - r.bottom - 8;
    const above = r.top - 52;
    if (below >= 260 || below >= above) setPos({ left: r.left, width: r.width, top: r.bottom + 4, maxH: Math.min(260, below) });
    else setPos({ left: r.left, width: r.width, bottom: window.innerHeight - r.top + 4, maxH: Math.min(260, above) });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      const t = e.target as Node;
      if (trigRef.current?.contains(t) || listRef.current?.contains(t)) return;
      setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('mousedown', close);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('mousedown', close);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
      window.removeEventListener('keydown', esc);
    };
  }, [open]);

  const current = options.find((o) => o.id === value);
  const text = display ?? current?.label;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div
        ref={trigRef}
        role="combobox"
        aria-expanded={open}
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        className="flt-field"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          height: 32,
          padding: '0 16px 0 4px',
          borderRadius: 4,
          background: T.fieldBg,
          border: `1px solid ${open ? '#8fb8ff' : T.fieldBorder}`,
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <span style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', font: `400 14px/20px ${T.font}`, color: text ? T.text : T.muted }}>
          {text ?? placeholder}
        </span>
        {clearable && value !== null && (
          <span
            title="ניקוי"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            style={{ display: 'flex', color: T.muted, cursor: 'pointer' }}
          >
            <Icon d="M18 6 6 18M6 6l12 12" size={13} />
          </span>
        )}
        <span style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
          <Chevron up={open} size={16} color={T.text} />
        </span>
      </div>
      {open &&
        pos &&
        createPortal(
          <div
            ref={listRef}
            dir="rtl"
            role="listbox"
            style={{
              position: 'fixed',
              left: pos.left,
              width: pos.width,
              top: pos.top,
              bottom: pos.bottom,
              maxHeight: pos.maxH,
              overflowY: 'auto',
              zIndex: 2000,
              padding: 4,
              background: '#2c2f35',
              border: `1px solid ${T.fieldBorder}`,
              borderRadius: 6,
              boxShadow: '0 12px 32px rgba(0,0,0,.5)',
              fontFamily: T.font,
            }}
          >
            {options.map((o) => {
              const sel = o.id === value;
              return (
                <div
                  key={o.id}
                  role="option"
                  aria-selected={sel}
                  aria-disabled={o.disabled}
                  className={o.disabled ? undefined : 'flt-opt'}
                  onClick={() => {
                    if (o.disabled) return;
                    onChange(o.id);
                    setOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    height: 30,
                    padding: '0 10px',
                    borderRadius: 4,
                    cursor: o.disabled ? 'default' : 'pointer',
                    font: `${sel ? 600 : 400} 14px/20px ${T.font}`,
                    color: o.disabled ? '#6b7280' : sel ? T.infoText : T.text,
                    background: sel ? T.infoBg : 'transparent',
                  }}
                >
                  <span style={{ flex: '1 1 auto' }}>{o.label}</span>
                  {sel && <Icon d="M20 6 9 17l-5-5" size={14} />}
                </div>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}

/** Single-selection chip ("Single and multi selection" in Figma). */
export function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <div
      onClick={onClick}
      role="radio"
      aria-checked={selected}
      className="flt-chip"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        height: 32,
        padding: '0 12px',
        borderRadius: 8,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        font: `500 14px/20px ${T.font}`,
        background: selected ? T.infoBg : T.chipBg,
        border: `1px solid ${selected ? T.infoBorder : T.chipBorder}`,
        color: selected ? T.infoText : T.text,
      }}
    >
      {children}
      {selected && <Icon d="M20 6 9 17l-5-5" size={16} />}
    </div>
  );
}

/** Checkbox card with a count badge (Figma "_checkbox-cards-item" + "Badge"). */
export function CheckCard({ label, count, color, checked, onClick }: { label: string; count: number; color: string; checked: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      role="checkbox"
      aria-checked={checked}
      className="flt-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        minHeight: 40,
        borderRadius: 8,
        cursor: 'pointer',
        background: checked ? T.infoBg : T.cardBg,
        border: `1px solid ${checked ? T.infoBorder : T.cardBorder}`,
      }}
    >
      {checked && (
        <span style={{ display: 'flex', color: T.infoText }}>
          <Icon d="M20 6 9 17l-5-5" size={15} />
        </span>
      )}
      <span style={{ flex: '1 1 auto', font: `700 14px/20px ${T.font}`, color: checked ? T.infoText : T.text }}>{label}</span>
      <Badge color={color}>{count.toLocaleString('en-US')}</Badge>
    </div>
  );
}

export function Badge({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 27,
        minWidth: 34,
        padding: '0 6px',
        borderRadius: 3,
        background: hexA(color, 0.34),
        border: `1px solid ${hexA(color, 0.69)}`,
        color: lighten(color, 0.35),
        font: `700 16px/24px ${T.font}`,
      }}
    >
      {children}
    </span>
  );
}

export function TextLinks({ items }: { items: { label: string; onClick: () => void }[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, paddingRight: 2 }}>
      {items.map((it, i) => (
        <span key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {i > 0 && <span style={{ width: 1, height: 15, background: T.divider }} />}
          <span onClick={it.onClick} className="flt-link" style={{ font: `400 14px/20px ${T.font}`, color: T.text, cursor: 'pointer' }}>
            {it.label}
          </span>
        </span>
      ))}
    </div>
  );
}

export function Icon({ d, size = 16 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
      <path d={d} />
    </svg>
  );
}

export function Chevron({ up, size = 16, color }: { up?: boolean; size?: number; color?: string }) {
  return (
    <span style={{ display: 'flex', color, transform: up ? 'rotate(180deg)' : undefined, transition: 'transform 150ms' }}>
      <Icon d="m6 9 6 6 6-6" size={size} />
    </span>
  );
}
