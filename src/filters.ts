// Filter model shared by both filter layouts (demo data only).

export type FilterLayout = 'docked' | 'floating';

export type TimeMode = 'ever' | 'days' | 'range';

export interface TimeFilter {
  mode: TimeMode;
  days: number;
  from: string | null;
  to: string | null;
}

export type DeletedStatus = 'all' | 'deleted' | 'active';

export interface CrossFilters {
  level: string | null;
  force: string | null;
  updater: string | null;
  status: DeletedStatus;
}

export interface FilterState {
  time: TimeFilter;
  cross: CrossFilters;
  /** Selected sub-categories per layer key; an empty list means "show everything". */
  perLayer: Record<string, string[]>;
}

export const EMPTY_FILTERS: FilterState = {
  time: { mode: 'ever', days: 7, from: null, to: null },
  cross: { level: null, force: null, updater: null, status: 'all' },
  perLayer: {},
};

export const TIME_TABS: { id: TimeMode; label: string }[] = [
  { id: 'ever', label: 'אי פעם' },
  { id: 'days', label: 'ימים לאחור' },
  { id: 'range', label: 'טווח זמנים' },
];

/** Presets offered by the single "זמנים" select in the docked layout. */
export const TIME_PRESETS: { id: string; label: string; time: Pick<TimeFilter, 'mode' | 'days'> }[] = [
  { id: 'ever', label: 'אי פעם', time: { mode: 'ever', days: 7 } },
  { id: 'd1', label: '24 שעות אחרונות', time: { mode: 'days', days: 1 } },
  { id: 'd3', label: '3 ימים אחרונים', time: { mode: 'days', days: 3 } },
  { id: 'd7', label: 'שבוע אחרון', time: { mode: 'days', days: 7 } },
  { id: 'd30', label: 'חודש אחרון', time: { mode: 'days', days: 30 } },
];

const TODAY = new Date(2026, 10, 12);

/** The last 30 days as dd/mm/yy strings, newest first. */
export const DATE_OPTIONS: string[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - i);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${String(d.getFullYear()).slice(2)}`;
});

/** Index in DATE_OPTIONS; larger index = older date. */
export const dateRank = (d: string) => DATE_OPTIONS.indexOf(d);

export function timeLabel(t: TimeFilter): string {
  if (t.mode === 'ever') return 'אי פעם';
  if (t.mode === 'days') {
    const preset = TIME_PRESETS.find((p) => p.time.mode === 'days' && p.time.days === t.days);
    return preset ? preset.label : `${t.days} ימים אחרונים`;
  }
  if (t.from && t.to) return `${t.from} – ${t.to}`;
  if (t.from) return `מ־${t.from}`;
  if (t.to) return `עד ${t.to}`;
  return 'טווח זמנים';
}

export const CROSS_SELECTS: { key: 'level' | 'force' | 'updater'; label: string; options: string[] }[] = [
  { key: 'level', label: 'רמה ממונה', options: ['אוגדה 162', 'חטיבה 401', 'חטיבה 933', 'גדוד 9', 'פלוגה ב'] },
  { key: 'force', label: 'כוח מדווח', options: ['גדוד 9', 'פלוגה ב', 'צוות איתור', 'אמ"ן', 'יחידת תצפית'] },
  { key: 'updater', label: 'גורם מעדכן', options: ['קצין מודיעין', 'חמ"ל חטיבתי', 'כוח בשטח', 'עדכון אוטומטי'] },
];

export const STATUS_OPTIONS: { id: DeletedStatus; label: string }[] = [
  { id: 'all', label: 'הכל' },
  { id: 'active', label: 'לא מחוק' },
  { id: 'deleted', label: 'מחוק' },
];

export interface SubCategory {
  id: string;
  label: string;
  count: number;
}

/** Per-layer sub-categories (mock counts). */
export const LAYER_SUBS: Record<string, SubCategory[]> = {
  detect: [
    { id: 'person', label: 'אדם', count: 220 },
    { id: 'general', label: 'אויב כללי', count: 128 },
    { id: 'vehicle', label: 'רכב', count: 96 },
    { id: 'at', label: 'נ״ט', count: 63 },
  ],
  reports: [
    { id: 'fire', label: 'ירי', count: 188 },
    { id: 'observe', label: 'תצפית', count: 142 },
    { id: 'suspect', label: 'חשד', count: 109 },
    { id: 'blast', label: 'פיצוץ', count: 68 },
  ],
  events: [
    { id: 'critical', label: 'קריטי', count: 8 },
    { id: 'high', label: 'גבוה', count: 14 },
    { id: 'medium', label: 'בינוני', count: 16 },
    { id: 'low', label: 'נמוך', count: 12 },
  ],
  infra: [
    { id: 'tunnel', label: 'פיר מנהרה', count: 0 },
    { id: 'post', label: 'עמדה', count: 0 },
    { id: 'depot', label: 'מחסן אמל״ח', count: 0 },
  ],
  sabotage: [
    { id: 'ied', label: 'מטען צד', count: 154 },
    { id: 'mine', label: 'מיקוש', count: 121 },
    { id: 'breach', label: 'פריצה', count: 86 },
  ],
  tahak: [
    { id: 'axis', label: 'צירים', count: 512 },
    { id: 'bridge', label: 'גשרים', count: 74 },
    { id: 'power', label: 'חשמל ומים', count: 496 },
  ],
  targets: [
    { id: 'building', label: 'מבנה', count: 820 },
    { id: 'launcher', label: 'משגר', count: 512 },
    { id: 'shaft', label: 'פיר', count: 368 },
  ],
  capture: [
    { id: 'open', label: 'פתוח', count: 1904 },
    { id: 'taken', label: 'נכבש', count: 1012 },
  ],
  history: [
    { id: 'standing', label: 'עומד', count: 3120 },
    { id: 'damaged', label: 'פגוע', count: 1480 },
  ],
  aman: [
    { id: 'sensor', label: 'חיישן', count: 204 },
    { id: 'camera', label: 'מצלמה', count: 108 },
  ],
};

export function activeFilterCount(f: FilterState): number {
  let n = 0;
  if (f.time.mode === 'days' || (f.time.mode === 'range' && (f.time.from || f.time.to))) n++;
  if (f.cross.level) n++;
  if (f.cross.force) n++;
  if (f.cross.updater) n++;
  if (f.cross.status !== 'all') n++;
  for (const ids of Object.values(f.perLayer)) if (ids.length) n++;
  return n;
}

/** Mix a #rrggbb colour toward white (amount 0..1). */
export function lighten(hex: string, amount: number): string {
  const h = hex.replace('#', '');
  const c = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  const m = c.map((v) => Math.round(v + (255 - v) * amount));
  return `#${m.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}
