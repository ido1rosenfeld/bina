import { useState } from 'react';
import { DATE_OPTIONS, TIME_PRESETS, TIME_TABS, dateRank, timeLabel, type TimeFilter, type TimeMode } from '../../filters';
import { T } from './tokens';
import { FieldLabel, Icon, Select } from './ui';

type SetTime = (t: TimeFilter) => void;

/** Three-way segmented control: אי פעם / ימים לאחור / טווח זמנים. */
export function TimeTabs({ value, onChange, size = 'md' }: { value: TimeMode; onChange: (m: TimeMode) => void; size?: 'sm' | 'md' }) {
  const h = size === 'sm' ? 26 : 30;
  return (
    <div role="tablist" style={{ display: 'flex', gap: 2, padding: 2, borderRadius: 8, background: 'rgba(0,0,0,.25)', border: `1px solid ${T.cardBorder}` }}>
      {TIME_TABS.map((t) => {
        const on = t.id === value;
        return (
          <span
            key={t.id}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(t.id)}
            className="seg-opt"
            style={{
              flex: '1 1 0',
              height: h,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 12px',
              borderRadius: 6,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              font: `${on ? 600 : 500} ${size === 'sm' ? 12 : 13}px ${T.font}`,
              background: on ? T.accent : 'transparent',
              color: on ? '#fff' : '#b5bac6',
            }}
          >
            {t.label}
          </span>
        );
      })}
    </div>
  );
}

function DaysInput({ value, onChange, compact }: { value: number; onChange: (n: number) => void; compact?: boolean }) {
  const [text, setText] = useState(String(value));
  const [synced, setSynced] = useState(value);
  if (synced !== value) {
    setSynced(value);
    setText(String(value));
  }

  const commit = (raw: string) => {
    const n = Math.round(Number(raw));
    if (Number.isFinite(n) && n >= 1 && n <= 365) onChange(n);
    else setText(String(value));
  };
  const step = (d: number) => onChange(Math.min(365, Math.max(1, value + d)));

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 32, width: compact ? 96 : 132, borderRadius: 4, background: T.fieldBg, border: `1px solid ${T.fieldBorder}`, overflow: 'hidden' }}>
        <StepBtn label="הוספת יום" onClick={() => step(1)} d="M12 5v14M5 12h14" />
        <input
          aria-label="מספר ימים לאחור"
          inputMode="numeric"
          value={text}
          onChange={(e) => {
            const v = e.target.value.replace(/[^\d]/g, '').slice(0, 3);
            setText(v);
            const n = Number(v);
            if (v && n >= 1 && n <= 365) onChange(n);
          }}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
              e.preventDefault();
              step(e.key === 'ArrowUp' ? 1 : -1);
            }
            if (e.key === 'Enter') commit((e.target as HTMLInputElement).value);
          }}
          style={{ flex: '1 1 auto', minWidth: 0, height: '100%', border: 'none', outline: 'none', background: 'transparent', textAlign: 'center', color: T.text, font: `600 14px ${T.font}` }}
        />
        <StepBtn label="הפחתת יום" onClick={() => step(-1)} d="M5 12h14" />
      </div>
      <span style={{ font: `400 14px ${T.font}`, color: T.muted, whiteSpace: 'nowrap' }}>{compact ? 'ימים' : 'ימים אחורה'}</span>
    </div>
  );
}

function StepBtn({ d, label, onClick }: { d: string; label: string; onClick: () => void }) {
  return (
    <span title={label} onClick={onClick} className="tool-icon-btn" style={{ width: 28, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#c9d1dc', flex: '0 0 auto' }}>
      <Icon d={d} size={13} />
    </span>
  );
}

function RangeSelects({ time, onChange, compact }: { time: TimeFilter; onChange: SetTime; compact?: boolean }) {
  const fromOpts = DATE_OPTIONS.map((d) => ({ id: d, label: d, disabled: time.to !== null && dateRank(d) < dateRank(time.to) }));
  const toOpts = DATE_OPTIONS.map((d) => ({ id: d, label: d, disabled: time.from !== null && dateRank(d) > dateRank(time.from) }));
  const w = compact ? 128 : undefined;
  return (
    <div style={{ display: 'flex', gap: compact ? 6 : 10, alignItems: compact ? 'center' : 'stretch' }}>
      <div style={{ flex: compact ? '0 0 auto' : '1 1 0', width: w, minWidth: 0 }}>
        <Select label={compact ? undefined : 'מתאריך'} placeholder={compact ? 'מתאריך' : 'בחר תאריך'} clearable={false} value={time.from} options={fromOpts} onChange={(from) => onChange({ ...time, from })} />
      </div>
      {compact && <span style={{ color: T.muted }}>–</span>}
      <div style={{ flex: compact ? '0 0 auto' : '1 1 0', width: w, minWidth: 0 }}>
        <Select label={compact ? undefined : 'עד תאריך'} placeholder={compact ? 'עד תאריך' : 'בחר תאריך'} clearable={false} value={time.to} options={toOpts} onChange={(to) => onChange({ ...time, to })} />
      </div>
    </div>
  );
}

/** Full time section for the floating panel: tabs, then a body that depends on the tab. */
export function TimeSection({ time, onChange }: { time: TimeFilter; onChange: SetTime }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <TimeTabs value={time.mode} onChange={(mode) => onChange({ ...time, mode })} />
      {time.mode === 'days' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <FieldLabel>הזנת ימים</FieldLabel>
          <DaysInput value={time.days} onChange={(days) => onChange({ ...time, days })} />
        </div>
      )}
      {time.mode === 'range' && <RangeSelects time={time} onChange={onChange} />}
    </div>
  );
}

/** Compact strip shown above the main bar in the floating layout (same state as the panel). */
export function TimeStrip({ time, onChange, onClose }: { time: TimeFilter; onChange: SetTime; onClose: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 42, padding: '4px 14px 4px 8px' }}>
      <span style={{ font: `600 12px ${T.font}`, color: '#e7edf7', whiteSpace: 'nowrap' }}>סינון זמנים</span>
      <TimeTabs size="sm" value={time.mode} onChange={(mode) => onChange({ ...time, mode })} />
      {time.mode === 'days' && <DaysInput compact value={time.days} onChange={(days) => onChange({ ...time, days })} />}
      {time.mode === 'range' && <RangeSelects compact time={time} onChange={onChange} />}
      <span onClick={onClose} title="סגירת סינון זמנים" className="tool-icon-btn" style={{ width: 26, height: 26, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#c9d1dc' }}>
        <Icon d="M18 6 6 18M6 6l12 12" size={14} />
      </span>
    </div>
  );
}

/** Single "זמנים" select used in the docked layout (as in the original Figma frame). */
export function TimePresetSelect({ time, onChange }: { time: TimeFilter; onChange: SetTime }) {
  const match = TIME_PRESETS.find((p) => p.time.mode === time.mode && (time.mode === 'ever' || p.time.days === time.days));
  return (
    <Select
      label="זמנים"
      clearable={false}
      value={match?.id ?? null}
      display={match ? undefined : timeLabel(time)}
      options={TIME_PRESETS.map((p) => ({ id: p.id, label: p.label }))}
      onChange={(id) => {
        const p = TIME_PRESETS.find((x) => x.id === id);
        if (p) onChange({ ...time, ...p.time });
      }}
    />
  );
}
