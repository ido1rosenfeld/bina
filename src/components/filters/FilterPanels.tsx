import type { CSSProperties } from 'react';
import { LAYERS } from '../../data';
import { CROSS_SELECTS, LAYER_SUBS, STATUS_OPTIONS, lighten, type CrossFilters, type FilterState } from '../../filters';
import { TimePresetSelect, TimeSection } from './TimeFilter';
import { PANEL, T } from './tokens';
import { CheckCard, Chip, FieldLabel, PanelFooter, PanelHeader, Section, Select, TextLinks } from './ui';

type SetFilters = (f: FilterState) => void;

interface PanelProps {
  filters: FilterState;
  setFilters: SetFilters;
  layers: Record<string, boolean>;
  onClose: () => void;
  style?: CSSProperties;
}

/** רמה ממונה / כוח מדווח / גורם מעדכן + status chips. */
function CrossFields({ cross, onChange }: { cross: CrossFilters; onChange: (c: CrossFilters) => void }) {
  return (
    <>
      {CROSS_SELECTS.map((s) => (
        <Select key={s.key} label={s.label} value={cross[s.key]} options={s.options.map((o) => ({ id: o, label: o }))} onChange={(v) => onChange({ ...cross, [s.key]: v })} />
      ))}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 2 }}>
        <FieldLabel>סטטוס</FieldLabel>
        <div role="radiogroup" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {STATUS_OPTIONS.map((o) => (
            <Chip key={o.id} selected={cross.status === o.id} onClick={() => onChange({ ...cross, status: o.id })}>
              {o.label}
            </Chip>
          ))}
        </div>
      </div>
    </>
  );
}

/** One collapsible section per active map layer, with check-cards for its sub-categories. */
function LayerSections({ filters, setFilters, layers }: Omit<PanelProps, 'onClose'>) {
  const active = LAYERS.filter((l) => layers[l.key] && LAYER_SUBS[l.key]);
  if (!active.length) {
    return (
      <div style={{ padding: '14px 12px', borderRadius: 8, background: T.sectionBg, font: `400 13px/19px ${T.font}`, color: T.muted, textAlign: 'center' }}>
        אין שכבות פעילות. הפעל שכבה בסרגל כדי לסנן לפיה.
      </div>
    );
  }
  const setLayer = (key: string, ids: string[]) => setFilters({ ...filters, perLayer: { ...filters.perLayer, [key]: ids } });

  return (
    <>
      {active.map((l) => {
        const subs = LAYER_SUBS[l.key];
        const sel = filters.perLayer[l.key] ?? [];
        return (
          <Section
            key={l.key}
            collapsible
            title={`${l.label1}${l.label2 ? ` ${l.label2}` : ''}`}
            color={lighten(l.color, 0.35)}
            footer={
              <TextLinks
                items={[
                  { label: 'בחר הכל', onClick: () => setLayer(l.key, subs.map((s) => s.id)) },
                  { label: 'נקה הכל', onClick: () => setLayer(l.key, []) },
                ]}
              />
            }
          >
            {subs.map((s) => (
              <CheckCard
                key={s.id}
                label={s.label}
                count={s.count}
                color={l.color}
                checked={sel.includes(s.id)}
                onClick={() => setLayer(l.key, sel.includes(s.id) ? sel.filter((x) => x !== s.id) : [...sel, s.id])}
              />
            ))}
          </Section>
        );
      })}
    </>
  );
}

const BODY: CSSProperties = { flex: '1 1 auto', minHeight: 0, overflowY: 'auto', padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 16 };

/** Layout B — one floating window on the left of the map with everything inside. */
export function FloatingFilterPanel({ filters, setFilters, layers, onClose, style }: PanelProps) {
  return (
    <div dir="rtl" className="bina-in" style={{ ...PANEL, width: 305, ...style }}>
      <PanelHeader title="סינונים" onClose={onClose} />
      <div style={BODY}>
        <Section title="זמנים">
          <TimeSection time={filters.time} onChange={(time) => setFilters({ ...filters, time })} />
        </Section>
        <Section title="רוחבי">
          <CrossFields cross={filters.cross} onChange={(cross) => setFilters({ ...filters, cross })} />
        </Section>
        <LayerSections filters={filters} setFilters={setFilters} layers={layers} />
      </div>
      <PanelFooter onReset={() => setFilters({ ...filters, cross: EMPTY_CROSS, perLayer: {}, time: { ...filters.time, mode: 'ever' } })} onSave={onClose} />
    </div>
  );
}

const EMPTY_CROSS: CrossFilters = { level: null, force: null, updater: null, status: 'all' };

/** Layout A, right of the main bar — cross-cutting filters only. */
export function CrossPanel({ filters, setFilters, onClose, style }: PanelProps) {
  return (
    <div dir="rtl" className="bina-in" style={{ ...PANEL, width: 280, ...style }}>
      <PanelHeader title="סינונים רוחביים" onClose={onClose} />
      <div style={BODY}>
        <CrossFields cross={filters.cross} onChange={(cross) => setFilters({ ...filters, cross })} />
      </div>
      <PanelFooter onReset={() => setFilters({ ...filters, cross: EMPTY_CROSS })} onSave={onClose} />
    </div>
  );
}

/** Layout A, left of the main bar — time filter and per-layer filters. */
export function LayerTimePanel({ filters, setFilters, layers, onClose, style }: PanelProps) {
  return (
    <div dir="rtl" className="bina-in" style={{ ...PANEL, width: 290, ...style }}>
      <PanelHeader title="זמן ושכבות" onClose={onClose} />
      <div style={BODY}>
        <TimePresetSelect time={filters.time} onChange={(time) => setFilters({ ...filters, time })} />
        <LayerSections filters={filters} setFilters={setFilters} layers={layers} />
      </div>
      <PanelFooter onReset={() => setFilters({ ...filters, perLayer: {}, time: { ...filters.time, mode: 'ever' } })} onSave={onClose} />
    </div>
  );
}
