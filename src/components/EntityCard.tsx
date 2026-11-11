import { useState, type ReactNode } from 'react';
import type { EntityItem } from '../data';
import { entityCoord } from '../data';
import { EntityThumb } from './EntityHoverCard';

export type EntityPatch = Pick<EntityItem, 'name' | 'location' | 'description' | 'start' | 'end'>;

interface EntityCardProps {
  entities: EntityItem[];
  activeId: string;
  onActivate: (id: string) => void;
  onClose: (id: string) => void;
  onSave: (id: string, patch: EntityPatch) => void;
  onLocate: (id: string) => void;
}

export default function EntityCard({ entities, activeId, onActivate, onClose, onSave, onLocate }: EntityCardProps) {
  const active = entities.find((e) => e.id === activeId) ?? entities[0];
  const grouped = entities.length > 1;

  return (
    <div
      dir="rtl"
      onClick={(ev) => ev.stopPropagation()}
      style={{
        position: 'absolute',
        top: 56,
        left: 12,
        bottom: 16,
        zIndex: 650,
        display: 'flex',
        alignItems: 'flex-start',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          pointerEvents: 'auto',
          display: 'flex',
          maxHeight: '100%',
          borderRadius: 12,
          overflow: 'hidden',
          background: '#262a31',
          border: '1px solid rgba(255,255,255,.08)',
          boxShadow: '0 18px 56px rgba(0,0,0,.55)',
        }}
      >
        {grouped && (
          <div style={{ width: 112, flex: '0 0 112px', padding: 8, display: 'flex', flexDirection: 'column', gap: 6, background: '#22262c', borderLeft: '1px solid rgba(255,255,255,.08)', overflowY: 'auto' }}>
            {entities.map((e) => {
              const on = e.id === active.id;
              return (
                <div
                  key={e.id}
                  onClick={() => onActivate(e.id)}
                  className="bar-pill"
                  title={e.name}
                  style={{
                    height: 34,
                    flex: '0 0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    direction: 'ltr',
                    padding: '0 10px',
                    borderRadius: 7,
                    cursor: 'pointer',
                    font: `${on ? 600 : 500} 11.5px Assistant,sans-serif`,
                    color: on ? '#fff' : '#c8d0dd',
                    background: on ? '#1f6feb' : 'rgba(255,255,255,.04)',
                    border: `1px solid ${on ? '#1f6feb' : 'rgba(255,255,255,.1)'}`,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {e.tag}
                </div>
              );
            })}
          </div>
        )}
        <CardBody key={active.id} entity={active} onClose={() => onClose(active.id)} onSave={(p) => onSave(active.id, p)} onLocate={() => onLocate(active.id)} />
      </div>
    </div>
  );
}

function CardBody({ entity, onClose, onSave, onLocate }: { entity: EntityItem; onClose: () => void; onSave: (p: EntityPatch) => void; onLocate: () => void }) {
  const initial: EntityPatch = { name: entity.name, location: entity.location, description: entity.description, start: entity.start, end: entity.end };
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<EntityPatch>(initial);
  const [open, setOpen] = useState<Record<string, boolean>>({ details: true, activity: false, geo: false });

  const set = (k: keyof EntityPatch) => (v: string) => setDraft((d) => ({ ...d, [k]: v }));
  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }));
  const coord = entityCoord(entity);

  return (
    <div style={{ width: 300, display: 'flex', flexDirection: 'column', minHeight: 0, fontFamily: 'Assistant,sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '12px 14px' }}>
        <span style={{ width: 28, height: 28, flex: '0 0 28px', borderRadius: 7, background: '#3fe0f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#06232b" strokeWidth={2.6} strokeLinecap="round">
            <path d="M3 13h18M8 13l4-5 4 5" />
          </svg>
        </span>
        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
          <div style={{ font: '700 15px/1.25 Assistant,sans-serif', color: '#f1f5fa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{entity.name}</div>
          <div style={{ font: '400 10.5px Assistant,sans-serif', color: '#8f97a6' }}>{entity.kind}</div>
        </div>
        <HeadBtn title="הצגה על המפה" onClick={onLocate}>
          <circle cx="12" cy="11" r="3" />
          <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" />
        </HeadBtn>
        {!editing && (
          <HeadBtn title="עריכה" onClick={() => setEditing(true)}>
            <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
          </HeadBtn>
        )}
        <HeadBtn title="סגירה" onClick={onClose}>
          <path d="M18 6 6 18M6 6l12 12" />
        </HeadBtn>
      </div>

      <EntityThumb entity={entity} w="100%" h={118} radius={0} />

      <div style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', padding: '0 14px' }}>
        <Section title="פרטים" open={open.details} onToggle={() => toggle('details')}>
          <Label>שם</Label>
          <Input value={draft.name} editing={editing} onChange={set('name')} copy />
          <Label>מיקום</Label>
          <Input value={draft.location} editing={editing} onChange={set('location')} copy />
          <Label>תיאור</Label>
          <Input value={draft.description} editing={editing} onChange={set('description')} multiline />
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: '1 1 0', minWidth: 0 }}>
              <Label>זמן התחלה</Label>
              <Input value={draft.start} editing={editing} onChange={set('start')} date />
            </div>
            <div style={{ flex: '1 1 0', minWidth: 0 }}>
              <Label>זמן סיום</Label>
              <Input value={draft.end} editing={editing} onChange={set('end')} date />
            </div>
          </div>
        </Section>

        <Section title="נתוני פעילות" open={open.activity} onToggle={() => toggle('activity')}>
          <InfoList rows={[...entity.activity, { label: 'סוג מקור', value: entity.source }, { label: 'עודכן', value: entity.updated }]} />
        </Section>

        <Section title="נתוני מיקום" open={open.geo} onToggle={() => toggle('geo')}>
          <InfoList rows={[{ label: 'נ.צ.', value: coord }, { label: 'מרחב', value: entity.area }, ...entity.geo]} />
        </Section>
      </div>

      {editing && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <span
            onClick={() => {
              onSave(draft);
              setEditing(false);
            }}
            className="bar-pill"
            style={btnStyle('#1f6feb', '#fff')}
          >
            שמור שינויים
          </span>
          <span
            onClick={() => {
              setDraft(initial);
              setEditing(false);
            }}
            className="bar-pill"
            style={btnStyle('rgba(255,255,255,.1)', '#e7edf7')}
          >
            ביטול
          </span>
        </div>
      )}
    </div>
  );
}

function Section({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,.09)' }}>
      <div onClick={onToggle} className="entity-acc-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', cursor: 'pointer' }}>
        <span style={{ font: '700 13px Assistant,sans-serif', color: '#f1f5fa' }}>{title}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9aa3b2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 140ms' }}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      {open && <div style={{ paddingBottom: 14 }}>{children}</div>}
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <div style={{ font: '500 11px Assistant,sans-serif', color: '#aeb6c2', margin: '8px 0 5px' }}>{children}</div>;
}

function Input({ value, editing, onChange, copy, multiline, date }: { value: string; editing: boolean; onChange: (v: string) => void; copy?: boolean; multiline?: boolean; date?: boolean }) {
  const [copied, setCopied] = useState(false);
  const box = {
    display: 'flex',
    alignItems: multiline ? 'flex-start' : 'center',
    gap: 6,
    minHeight: multiline ? 64 : 32,
    padding: multiline ? '7px 10px' : '0 10px',
    borderRadius: 6,
    background: editing ? 'rgba(0,0,0,.18)' : 'rgba(255,255,255,.06)',
    border: `1px solid ${editing ? 'rgba(255,255,255,.28)' : 'transparent'}`,
  } as const;
  const text = { flex: '1 1 auto', minWidth: 0, border: 0, outline: 'none', background: 'transparent', color: '#e7edf7', font: '400 12px/1.5 Assistant,sans-serif', textAlign: 'right', direction: date ? 'ltr' : 'rtl', resize: 'none', padding: 0 } as const;

  return (
    <div style={box}>
      {multiline ? (
        <textarea value={value} readOnly={!editing} onChange={(e) => onChange(e.target.value)} rows={3} style={text} />
      ) : (
        <input value={value} readOnly={!editing} onChange={(e) => onChange(e.target.value)} style={text} />
      )}
      {copy && (
        <span
          title={copied ? 'הועתק' : 'העתקה'}
          onClick={() => {
            navigator.clipboard?.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
          style={{ display: 'flex', color: copied ? '#7fdcab' : '#9aa3b2', cursor: 'pointer', flex: '0 0 auto' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            {copied ? <path d="m5 12 5 5 9-10" /> : <><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></>}
          </svg>
        </span>
      )}
      {date && (
        <span style={{ display: 'flex', color: '#9aa3b2', flex: '0 0 auto' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 10h18M8 3v4M16 3v4" />
          </svg>
        </span>
      )}
    </div>
  );
}

function InfoList({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, font: '400 12px Assistant,sans-serif' }}>
          <span style={{ color: '#9aa3b2' }}>{r.label}</span>
          <span style={{ color: '#e7edf7', direction: /^[\d./:, -]+$/.test(r.value) ? 'ltr' : 'rtl' }}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}

function HeadBtn({ title, onClick, children }: { title: string; onClick: () => void; children: ReactNode }) {
  return (
    <span
      title={title}
      onClick={onClick}
      className="tool-icon-btn"
      style={{ width: 26, height: 26, flex: '0 0 26px', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9d1dc', cursor: 'pointer' }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </span>
  );
}

function btnStyle(bg: string, color: string) {
  return {
    height: 30,
    display: 'flex',
    alignItems: 'center',
    padding: '0 14px',
    borderRadius: 7,
    background: bg,
    color,
    font: '600 12px Assistant,sans-serif',
    cursor: 'pointer',
  } as const;
}
