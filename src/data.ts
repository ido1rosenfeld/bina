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
  { id: 'e2', sev: 4, text: 'ירי נ"ט לעבר מבנה 934/C', time: '13/05 21:40', place: 'מבנה 934/C', coord: '31.5231, 34.4502', source: 'צוות איתור' },
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
  { key: 'detect', label1: 'איתור', label2: 'אויב', value: '507', color: '#ff4d4f', group: 'enemy' },
  { key: 'reports', label1: 'דיווח', label2: 'מבצעי', value: '507', color: '#f5d90a', group: 'enemy' },
  { key: 'events', label1: 'אירוע', label2: '', value: '50', color: '#ff5c5c', group: 'enemy' },
  { key: 'infra', label1: 'תשתיות', label2: 'אויב', value: '0', color: '#f5d90a', group: 'enemy' },
  { key: 'sabotage', label1: 'חבלה', label2: '', value: '361', color: '#3ddc97', group: 'enemy' },
  { key: 'tahak', label1: 'תח"ק', label2: '', value: '1,082', color: '#f5a524', group: 'enemy' },
  { key: 'heat', label1: 'מפת חום', label2: 'כוחותינו', value: '', color: '#5b9bff', group: 'ours' },
  { key: 'doc', label1: 'תיעוד', label2: 'מבצעי', value: '', color: '#9ec3ff', group: 'ours' },
  { key: 'targets', label1: 'מטרות', label2: 'צ"ד', value: '1,700', color: '#a78bfa', group: 'ours' },
  { key: 'capture', label1: 'יעד', label2: 'לכיבוש', value: '2,916', color: '#22d3ee', group: 'ours' },
  { key: 'history', label1: 'היסטוריית', label2: 'מבנים', value: '4,600', color: '#e7edf7', group: 'aman' },
  { key: 'aman', label1: 'חקורים', label2: 'אמ"ן', value: '312', color: '#a78bfa', group: 'aman' },
  { key: 'shield', label1: 'ציון מגן', label2: '', value: '7.4', color: '#ff4d4f', group: 'aman' },
];

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
  { name: 'מבנה 934/C', time: '07:42' },
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
      text: 'שכבת אמ״ן מציגה כרגע 312 חקורים פעילים בגזרה, לצד 4,600 רישומי היסטוריית מבנים. ההצלבה בין השניים היא שמזהה את שלושת האיתורים הרגישים שמוצגים בחלק א׳ — מבנה 934/C, יעד E19 ומתקן הצומת הצפוני.',
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
