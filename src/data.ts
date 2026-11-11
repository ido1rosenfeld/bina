export interface EventItem {
  id: string;
  sev: number;
  text: string;
  time: string;
  place: string;
  coord: string;
  source: string;
}

export const EVENTS: EventItem[] = [
  { id: 'e1', sev: 4, text: 'מיקוש ציר אמירה — מטען צד הופעל על כוח משוריין', time: '14/05 03:12', place: 'ציר אמירה', coord: '31.5223, 34.4491', source: 'גדוד 9' },
  { id: 'e2', sev: 4, text: 'ירי נ"ט לעבר מבנה \u2066934/C\u2069', time: '13/05 21:40', place: 'מבנה \u2066934/C\u2069', coord: '31.5231, 34.4502', source: 'צוות איתור' },
  { id: 'e3', sev: 3, text: 'היתקלות בכוח רגלי בפתח מנהרה E19', time: '13/05 06:55', place: 'יעד E19', coord: '31.5202, 34.4508', source: 'פלוגה ב' },
  { id: 'e4', sev: 3, text: 'זיהוי חוליית שיגור בצומת אמירה–דקל', time: '12/05 18:20', place: 'צומת אמירה–דקל', coord: '31.5218, 34.4536', source: 'אמ"ן' },
  { id: 'e5', sev: 2, text: 'ירי קל לעבר מוצב צפוני', time: '12/05 11:05', place: 'מוצב צפון', coord: '31.5240, 34.4519', source: 'גדוד 9' },
  { id: 'e6', sev: 2, text: 'איתור פתח מנהרה חדש בשולי הרכס', time: '12/05 08:15', place: 'רכס מרכזי', coord: '31.5209, 34.4471', source: 'צוות איתור' },
];

export interface SeveritySlice {
  label: string;
  sev: number;
  count: number;
  color: string;
}

export const SEVERITY_BREAKDOWN: SeveritySlice[] = [
  { label: 'קריטי', sev: 4, count: 9, color: '#ff4d4f' },
  { label: 'גבוה', sev: 3, count: 15, color: '#f5a524' },
  { label: 'בינוני', sev: 2, count: 22, color: '#5b9bff' },
  { label: 'נמוך', sev: 1, count: 18, color: '#8f97a6' },
];

export interface LayerDef {
  key: string;
  label1: string;
  label2: string;
  value: string;
  color: string;
  group: 'enemy' | 'ours' | 'aman';
}

export const LAYERS: LayerDef[] = [
  { key: 'detect', label1: 'איתור', label2: 'אויב', value: '507', color: '#ff5c5c', group: 'enemy' },
  { key: 'reports', label1: 'דיווח', label2: 'מבצעי', value: '507', color: '#f5c518', group: 'enemy' },
  { key: 'events', label1: 'אירוע', label2: '', value: '50', color: '#ff7aa2', group: 'enemy' },
  { key: 'infra', label1: 'תשתיות', label2: 'אויב', value: '0', color: '#c8956a', group: 'enemy' },
  { key: 'sabotage', label1: 'חבלה', label2: '', value: '361', color: '#3ddc97', group: 'enemy' },
  { key: 'tahak', label1: 'תח"ק', label2: '', value: '1,082', color: '#9db4ff', group: 'enemy' },
  { key: 'heat', label1: 'מפת חום', label2: 'כוחותינו', value: '', color: '#5b9bff', group: 'ours' },
  { key: 'doc', label1: 'תיעוד', label2: 'מבצעי', value: '', color: '#9ec3ff', group: 'ours' },
  { key: 'targets', label1: 'מטרות', label2: 'צ"ד', value: '1,700', color: '#5b8def', group: 'ours' },
  { key: 'capture', label1: 'יעד', label2: 'לכיבוש', value: '2,916', color: '#f59e42', group: 'ours' },
  { key: 'history', label1: 'היסטוריית', label2: 'מבנים', value: '4,600', color: '#e7edf7', group: 'aman' },
  { key: 'aman', label1: 'מגן', label2: 'אמ"ן', value: '312', color: '#a78bfa', group: 'aman' },
];

export const SIDEBAR_W = 58;
export const RECS_W = 340;

export const MAP_CENTER: [number, number] = [31.5215, 34.453];

// Synthetic offsets (not real survey data) used to scatter mock map content around the demo center.
export function offsetCoord(dy: number, dx: number): [number, number] {
  return [MAP_CENTER[0] + dy * 0.001, MAP_CENTER[1] + dx * 0.001];
}

export function aerialTileUrl(lat: number, lng: number, z = 17): string {
  const n = 2 ** z;
  const x = Math.floor(((lng + 180) / 360) * n);
  const rad = (lat * Math.PI) / 180;
  const y = Math.floor(((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n);
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
}

export interface InfoRow {
  label: string;
  value: string;
}

export interface EntityItem {
  id: string;
  tag: string;
  name: string;
  kind: string;
  dy: number;
  dx: number;
  updated: string;
  location: string;
  description: string;
  start: string;
  end: string;
  source: string;
  area: string;
  activity: InfoRow[];
  geo: InfoRow[];
}

export const ENTITIES: EntityItem[] = [
  {
    id: 'en-a1c', tag: 'A/1/C', name: 'מבנה A/1/C', kind: 'מבנה', dy: 0.8, dx: -1.6, updated: '14/05/26 07:42:10',
    location: 'רכס מרכזי, צפון', description: 'מבנה מגורים דו־קומתי בשולי הרכס. נצפתה תנועה בכניסה הצפונית ב-48 השעות האחרונות.',
    start: '12/05/26', end: '15/05/26', source: 'צוות איתור', area: 'אל־שוואדה צפון',
    activity: [{ label: 'אירועים קשורים', value: '2' }, { label: 'דיווח אחרון', value: '14/05 07:42' }, { label: 'רמת פעילות', value: 'בינונית' }],
    geo: [{ label: 'גובה', value: '48 מ׳' }, { label: 'ציר קרוב', value: 'ציר אמירה' }],
  },
  {
    id: 'en-934c', tag: '934/C', name: 'מבנה \u2066934/C\u2069', kind: 'מבנה רב קומות', dy: 1.1, dx: -2.4, updated: '13/05/26 21:40:05',
    location: 'צפון־מערב הגזרה', description: 'מבנה רב קומות בן שש קומות. ממנו בוצע ירי נ״ט לעבר הכוח ב-13/05.',
    start: '12/05/26', end: '15/05/26', source: 'צוות איתור', area: 'אל־שוואדה צפון',
    activity: [{ label: 'אירועים קשורים', value: '3' }, { label: 'דיווח אחרון', value: '13/05 21:40' }, { label: 'רמת פעילות', value: 'גבוהה' }],
    geo: [{ label: 'גובה', value: '51 מ׳' }, { label: 'ציר קרוב', value: 'ציר אמירה' }],
  },
  {
    id: 'en-e19', tag: 'E19', name: 'יעד E19', kind: 'פתח מנהרה', dy: -0.5, dx: -2.2, updated: '13/05/26 06:55:31',
    location: 'שולי הרכס, מערב', description: 'פתח מנהרה שאותר בשולי הרכס. זירת ההיתקלות בכוח רגלי מ-13/05.',
    start: '12/05/26', end: '15/05/26', source: 'פלוגה ב', area: 'בית לאהיה',
    activity: [{ label: 'אירועים קשורים', value: '4' }, { label: 'דיווח אחרון', value: '13/05 06:55' }, { label: 'רמת פעילות', value: 'גבוהה' }],
    geo: [{ label: 'גובה', value: '39 מ׳' }, { label: 'ציר קרוב', value: 'ציר דקל' }],
  },
  {
    id: 'en-a2e', tag: 'A/2/E', name: 'מבנה A/2/E', kind: 'מבנה ציבור', dy: -1.3, dx: -0.2, updated: '12/05/26 16:10:44',
    location: 'דרום הגזרה', description: 'מבנה ציבור לשעבר שמשמש כנקודת תצפית. לא דווחה פעילות בימים האחרונים.',
    start: '12/05/26', end: '15/05/26', source: 'גדוד 9', area: 'חורת עבדאללה',
    activity: [{ label: 'אירועים קשורים', value: '0' }, { label: 'דיווח אחרון', value: '12/05 16:10' }, { label: 'רמת פעילות', value: 'נמוכה' }],
    geo: [{ label: 'גובה', value: '36 מ׳' }, { label: 'ציר קרוב', value: 'ציר דקל' }],
  },
  {
    id: 'en-931a', tag: '931/A', name: 'מתחם \u2066931/A\u2069', kind: 'מתחם', dy: 0.7, dx: 1.9, updated: '14/05/26 11:22:08',
    location: 'מזרח הגזרה', description: 'מתחם של שלושה מבנים צמודים עם חצר פנימית. זוהתה בו חוליית שיגור ב-12/05.',
    start: '12/05/26', end: '15/05/26', source: 'אמ"ן', area: 'אל־שוואדה צפון',
    activity: [{ label: 'אירועים קשורים', value: '1' }, { label: 'דיווח אחרון', value: '14/05 11:22' }, { label: 'רמת פעילות', value: 'בינונית' }],
    geo: [{ label: 'גובה', value: '44 מ׳' }, { label: 'ציר קרוב', value: 'צומת אמירה–דקל' }],
  },
  {
    id: 'en-a4b', tag: 'A/4/B', name: 'מבנה A/4/B', kind: 'מבנה', dy: 1.3, dx: 2.5, updated: '13/05/26 09:03:57',
    location: 'צפון־מזרח הגזרה', description: 'מבנה בן שלוש קומות על ציר התנועה הצפוני.',
    start: '12/05/26', end: '15/05/26', source: 'צוות איתור', area: 'אל־שוואדה צפון',
    activity: [{ label: 'אירועים קשורים', value: '1' }, { label: 'דיווח אחרון', value: '13/05 09:03' }, { label: 'רמת פעילות', value: 'נמוכה' }],
    geo: [{ label: 'גובה', value: '46 מ׳' }, { label: 'ציר קרוב', value: 'ציר אמירה' }],
  },
  {
    id: 'en-a1f', tag: 'A/1/F', name: 'מבנה A/1/F', kind: 'מבנה', dy: -0.6, dx: 2.9, updated: '14/05/26 18:30:12',
    location: 'מזרח הגזרה', description: 'מבנה מגורים סמוך לגדר המזרחית. אותר בו פתח אוורור חשוד.',
    start: '12/05/26', end: '15/05/26', source: 'גדוד 9', area: 'חורת עבדאללה',
    activity: [{ label: 'אירועים קשורים', value: '2' }, { label: 'דיווח אחרון', value: '14/05 18:30' }, { label: 'רמת פעילות', value: 'בינונית' }],
    geo: [{ label: 'גובה', value: '41 מ׳' }, { label: 'ציר קרוב', value: 'ציר דקל' }],
  },
  {
    id: 'en-50a1', tag: '50/A/1', name: 'כוח קטן במרחב 50', kind: 'כוח', dy: -1.5, dx: -1.0, updated: '15/05/26 10:01:54',
    location: 'דרום־מערב הגזרה', description: 'כוח רגלי קטן שנצפה נע בין המבנים בדרום־מערב הגזרה.',
    start: '15/05/26', end: '15/05/26', source: 'תצפית', area: 'בית לאהיה',
    activity: [{ label: 'אירועים קשורים', value: '1' }, { label: 'דיווח אחרון', value: '15/05 10:01' }, { label: 'רמת פעילות', value: 'גבוהה' }],
    geo: [{ label: 'גובה', value: '37 מ׳' }, { label: 'ציר קרוב', value: 'ציר דקל' }],
  },
];

export function entityCoord(e: EntityItem): string {
  const [lat, lng] = offsetCoord(e.dy, e.dx);
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

export const GROUPS = [
  { name: 'התרחשויות', color: '#ffb224', keys: ['detect', 'reports', 'events'] },
  { name: 'אויב', color: '#e5484d', keys: ['infra', 'sabotage', 'tahak'] },
  { name: 'כוחותינו', color: '#5b9bff', keys: ['heat', 'targets', 'capture'] },
  { name: 'מידע מתקדם', color: '#8f97a6', keys: ['history', 'aman', 'shield', 'doc'] },
];

export interface ChartDef {
  id: string;
  title: string;
  from: string;
  to: string;
  vals: number[];
  color: string;
}

export const GRAPHS: ChartDef[] = [
  { id: 'gtype', title: 'פילוח לפי סוג אירוע', from: 'מיקוש', to: 'אחר', vals: [17, 12, 9, 8, 6, 5, 4, 3], color: '#ff4d4f' },
  { id: 'gsev', title: 'פילוח לפי חומרה', from: 'חומרה 1', to: 'חומרה 4', vals: [21, 19, 15, 9], color: '#f5a524' },
  { id: 'ghours', title: 'פילוח לפי שעות ביום', from: '00:00', to: '23:00', vals: [3, 2, 4, 6, 9, 11, 8, 7, 5, 9, 12, 6], color: '#f5d90a' },
  { id: 'gsource', title: 'פילוח לפי גורם מדווח', from: 'גדוד', to: 'אחר', vals: [24, 17, 11, 7, 5], color: '#a78bfa' },
  { id: 'gstack', title: 'שעות ביום לפי סוג אירוע', from: '00:00', to: '23:00', vals: [4, 3, 6, 8, 12, 14, 9, 8, 6, 10, 13, 7], color: '#22d3ee' },
];

export const CATS = [
  { id: 'inaccurate', label: 'לא מדויק' },
  { id: 'missing', label: 'חסר מידע מהותי' },
  { id: 'wronglink', label: 'קישור לגרף שגוי' },
  { id: 'misleading', label: 'ניסוח מטעה' },
  { id: 'other', label: 'אחר' },
];

export const SHOTS = [
  { name: 'מבנה \u2066934/C\u2069', time: '07:42' },
  { name: 'ציר אמירה', time: '07:58' },
  { name: 'יעד E19', time: '08:03' },
  { name: 'מחסום צפון', time: '08:11' },
];

export const SUGGESTED_QUESTIONS = [
  'כמה אירועים היו בגזרה ומה סוגיהם?',
  'האם יש שעות פעילות גבוהה יותר בגזרה?',
  'אילו אירועים קדמו להיתקלות ב-E19?',
];

export interface ChatMessage {
  who: 'ai' | 'me';
  text: string;
  estimate?: boolean;
  source?: string;
  time?: string;
}

export const INITIAL_MESSAGES: ChatMessage[] = [];

export function answerFor(q: string): Omit<ChatMessage, 'who'> {
  if (/(כמה|אילו|מה האירועים|רשימ)/.test(q)) {
    return {
      text: 'בפוליגון ובטווח שנבחרו היו 64 אירועים: 17 מיקושים, 12 ירי נ״ט, 9 היתקלויות ו-26 אחרים. הבולט מביניהם הוא המיקוש בציר אמירה (14/05, חומרה 4) שבו הופעל מטען צד על כוח משוריין. תשעה כוחות דיווחו, ורוב הדיווחים הגיעו מגדוד 9 וצוות האיתור.',
      source: 'אירועים בפוליגון · 12/05–15/05',
    };
  }
  if (/(שעות|מגמ|השווה|גבוה|נמוך|ממוצע)/.test(q)) {
    return {
      text: 'ריכוז הפעילות הוא בין 02:00 ל-06:00, כ-38% מהאירועים, עם שיא בולט סביב 04:00. בהשוואה לשבועיים הקודמים ישנה מגמת עלייה מתונה (כ-12%) שמרוכזת כמעט כולה סביב צומת אמירה–דקל, בעוד ששאר הגזרה יציבה.',
      estimate: true,
      source: 'פילוח לפי שעות ביום',
    };
  }
  if (/(קדמו|למה|סיב|דפוס|חריג)/.test(q)) {
    return {
      text: 'להיתקלות ב-E19 קדמו שני איתורי תנועה ברכס המרכזי ודיווח על פתח מנהרה חדש, שניהם ב-24 השעות שלפני. הרצף הזה — תנועה, איתור פתח, ואז היתקלות — חוזר על עצמו פעמיים נוספות בחודש האחרון באזורים סמוכים, מה שמחזק השערת דפוס אך אינו מוכיח קשר סיבתי ישיר.',
      estimate: true,
      source: 'אירועים בפוליגון · 12/05–15/05',
    };
  }
  if (/(מבנ|תשתי|הרוס|נתקפ)/.test(q)) {
    return {
      text: 'בגזרה 4,600 מבנים רשומים, מתוכם 612 הרוסים ו-38 נתקפו בחלון הזמן הנוכחי. תשתיות אויב פעילות שאותרו: 0 (כל התשתיות שאותרו נוטרלו), אך יש 1,082 תח״ק פתוחות שממתינות לטיפול — זה המספר לעקוב אחריו.',
      source: 'אירועים בפוליגון · 12/05–15/05',
    };
  }
  if (/(אמ"?ן|מודיעין|חקור)/.test(q)) {
    return {
      text: 'שכבת אמ״ן מציגה כרגע 312 חקורים פעילים בגזרה, לצד 4,600 רישומי היסטוריית מבנים. ההצלבה בין השניים היא שמזהה את שלושת האיתורים הרגישים שמוצגים בחלק א׳ — מבנה \u2066934/C\u2069, יעד E19 ומתקן הצומת הצפוני.',
      source: 'אירועים בפוליגון · 12/05–15/05',
    };
  }
  if (/(ציון מגן|סיכון|מגן)/.test(q)) {
    return {
      text: 'ציון המגן הנוכחי לגזרה הוא 7.4 מתוך 10, ירידה קלה משבוע שעבר בעקבות המיקוש בציר אמירה. הציון משוקלל מאיתורי אויב, תח״ק פתוחות וקצב האירועים — ברגע שתח״ק אלו ייסגרו צפויה עלייה חזרה מעל 8.',
      estimate: true,
      source: 'פילוח לפי חומרה',
    };
  }
  if (/(צור|תייצר|בנה|הכן|גרף חדש|ויזואל)/.test(q)) {
    return { text: 'אין באפשרותי ליצור ויזואליזציות חדשות מעבר לקיים. אפשר ללחוץ על "חלק ג׳ - גרפים ומגמות" ולקבל את חמשת הפילוחים הזמינים לפוליגון, כולל פילוח החומרה שמוצג כדונאט.' };
  }
  return {
    text: 'זו שאלה מעניינת, אבל היא מחוץ למרחב שאני יכול לענות עליו ברמת סמך מספקת כרגע. נסה לשאול על כמות אירועים, שעות פעילות, מבנים ותשתיות, שכבת אמ״ן או ציון המגן — אלה הנושאים שיש לי עליהם נתונים מוצקים בפוליגון הנוכחי.',
  };
}

export function hexA(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export type RoleId = 'agam' | 'fire' | 'exposure' | 'intel';

export const ROLES: { id: RoleId; name: string; unit: string; short: string }[] = [
  { id: 'agam', name: 'אג"ם', unit: 'צי"ד אג"ם', short: 'אג"ם' },
  { id: 'fire', name: 'אש אוויר', unit: 'צי"ד אש', short: 'אש' },
  { id: 'exposure', name: 'חשיפת תקיפה', unit: 'צי"ד אש', short: 'חשיפה' },
  { id: 'intel', name: 'מודיעין ואיסוף', unit: 'צי"ד מודיעין', short: 'מודיעין' },
];

export interface RecItem {
  id: string;
  title: string;
  score: string;
  age: string;
  cls: string;
  level: string;
  grid: string;
  desc: string;
  creator: string;
  owner: string;
  created: string;
  dy: number;
  dx: number;
}

export const RECS: RecItem[] = [
  { id: 'א8197', title: 'איתור צי"ד', score: '5.0', age: '12 דק׳', cls: 'אדם', level: 'חשוד חזותי', grid: '669602 : 716244', desc: '2 ב"א', creator: 'קמ"ן גדוד 9', owner: 'גדמ"ר צפון', created: '11.11.2026 16:03:12', dy: 0.9, dx: -2.0 },
  { id: 'א8194', title: 'איתור צי"ד', score: '5.0', age: '38 דק׳', cls: 'רכב', level: 'חשוד חזותי', grid: '669455 : 716090', desc: 'רכב מסחרי לבן', creator: 'צוות איתור', owner: 'גדמ"ר צפון', created: '11.11.2026 15:37:48', dy: -0.4, dx: 0.6 },
  { id: 'א8190', title: 'תנועה חשודה', score: '4.2', age: '51 דק׳', cls: 'אדם', level: 'מודיעיני', grid: '669710 : 716301', desc: 'תנועה בפתח מבנה', creator: 'אמ"ן', owner: 'גדמ"ר דרום', created: '11.11.2026 15:24:05', dy: 1.2, dx: 2.2 },
  { id: 'א0907', title: 'איתור צי"ד', score: '5.0', age: '39 דק׳', cls: 'אדם', level: 'חשוד חזותי', grid: '669518 : 716177', desc: '3 ב"א', creator: 'קמ"ן גדוד 9', owner: 'גדמ"ר צפון', created: '11.11.2026 15:41:37', dy: -0.6, dx: -2.3 },
];
