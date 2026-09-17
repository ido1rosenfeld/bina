import { useState, type MouseEvent, type ReactNode } from 'react';
import { EVENTS, GRAPHS, CATS, SUGGESTED_QUESTIONS, SEVERITY_BREAKDOWN } from '../data';
import type { ChatMessage } from '../data';

interface ReportClaim {
  id: string;
  text: string;
}

interface AiPanelProps {
  panelW: number;
  onResizeStart: (e: MouseEvent) => void;
  onClose: () => void;
  sectionAOpen: boolean;
  toggleSectionA: () => void;
  sectionBOpen: boolean;
  toggleSectionB: () => void;
  graphsOn: boolean;
  toggleGraphs: () => void;
  highlight: string | null;
  onOpenEventList: (title: string) => void;
  onOpenEvent: (id: string) => void;
  dateFrom: string;
  dateTo: string;
  onEditDates: (from: string, to: string) => void;
  reportClaim: ReportClaim | null;
  reportCat: string | null;
  reportDone: boolean;
  onReportSummary: () => void;
  onCloseReport: () => void;
  onPickCat: (id: string) => void;
  onSubmitReport: () => void;
  messages: ChatMessage[];
  suggestedOpen: boolean;
  toggleSuggested: () => void;
  draft: string;
  setDraft: (v: string) => void;
  onSend: () => void;
  onAsk: (q: string) => void;
  onOpenSource: (source: string) => void;
  onJumpArea: () => void;
  overlay?: ReactNode;
}

const AREA_LINKS = ['אל־שוואדה צפון', 'בית לאהיה', 'חורת עבדאללה', 'ציר אמירה', 'ציר דקל'];

function LinkSpan({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <span onClick={onClick} style={{ color: '#9ec3ff', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}>
      {children}
    </span>
  );
}

function FactSpan({ children, onClick, color = '#9ec3ff' }: { children: ReactNode; onClick: () => void; color?: string }) {
  return (
    <span onClick={onClick} style={{ fontWeight: 700, color, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}>
      {children}
    </span>
  );
}

function BotAvatar() {
  return (
    <div
      style={{
        flex: '0 0 24px',
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: 'linear-gradient(#3d8bff,#1d5fd6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 0 1px rgba(255,255,255,.1)',
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3.5a4 4 0 0 1 4 4v.6a4 4 0 0 1 1.5 6.8V17a5.5 5.5 0 0 1-11 0v-2.1A4 4 0 0 1 8 8.1V7.5a4 4 0 0 1 4-4Z" />
      </svg>
    </div>
  );
}

function UserAvatar() {
  return (
    <div
      style={{
        flex: '0 0 24px',
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: '#3a3d44',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c8d0dd" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 20c1.2-3.6 4-5.4 7-5.4s5.8 1.8 7 5.4" />
      </svg>
    </div>
  );
}

function MsgIconBtn({ title, onClick, children }: { title: string; onClick?: () => void; children: ReactNode }) {
  return (
    <span
      title={title}
      onClick={onClick}
      className="msg-icon-btn"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: 5, color: '#7d8492', cursor: 'pointer' }}
    >
      {children}
    </span>
  );
}

function MessageActions({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <MsgIconBtn title="העתק" onClick={() => navigator.clipboard?.writeText(text)}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="12" height="12" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
      </MsgIconBtn>
      <MsgIconBtn title="מועיל">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3Zm0 0 3.5-7A2 2 0 0 1 12 3v0a2 2 0 0 1 2 2.2L13.5 9H19a2 2 0 0 1 2 2.3l-1.1 7A2 2 0 0 1 17.9 20H10a3 3 0 0 1-3-3v-6Z" />
        </svg>
      </MsgIconBtn>
      <MsgIconBtn title="לא מועיל">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(180deg)' }}>
          <path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3Zm0 0 3.5-7A2 2 0 0 1 12 3v0a2 2 0 0 1 2 2.2L13.5 9H19a2 2 0 0 1 2 2.3l-1.1 7A2 2 0 0 1 17.9 20H10a3 3 0 0 1-3-3v-6Z" />
        </svg>
      </MsgIconBtn>
    </div>
  );
}

function ClipboardIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M9 11h6M9 15h6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

function PieIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12A9 9 0 1 1 12 3v9Z" />
      <path d="M21 12A9 9 0 0 0 12 3" />
    </svg>
  );
}

function PencilIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8F91A0" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 140ms' }}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function SectionHeader({ id, color, icon, title, open, onToggle }: { id: string; color: string; icon: ReactNode; title: string; open: boolean; onToggle: () => void }) {
  return (
    <div
      id={id}
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        padding: '9px 12px',
        borderRadius: 9,
        border: `1px solid ${color}55`,
        background: `${color}18`,
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 22, height: 22, borderRadius: 6, background: `${color}30`, border: `1px solid ${color}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          {icon}
        </div>
        <span style={{ font: '700 12.5px Assistant,sans-serif', color: '#E6F5FF' }}>{title}</span>
      </div>
      <ChevronIcon open={open} />
    </div>
  );
}

function NavPill({ color, children, onClick }: { color: string; children: ReactNode; onClick: () => void }) {
  return (
    <span
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        height: 24,
        padding: '0 10px',
        borderRadius: 999,
        background: `${color}2e`,
        border: `1px solid ${color}80`,
        font: '700 10.5px Assistant,sans-serif',
        color: '#E6F5FF',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

function SparkleIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff">
      <path d="M12 2c.9 3.4 1.9 4.9 4.6 5.6-2.7.7-3.7 2.2-4.6 5.6-.9-3.4-1.9-4.9-4.6-5.6C10.1 6.9 11.1 5.4 12 2Z" />
      <path d="M19 13c.5 1.8 1 2.5 2.4 2.9-1.4.4-1.9 1.1-2.4 2.9-.5-1.8-1-2.5-2.4-2.9 1.4-.4 1.9-1.1 2.4-2.9Z" />
      <path d="M6 15c.4 1.4.8 1.9 1.9 2.2-1.1.3-1.5.8-1.9 2.2-.4-1.4-.8-1.9-1.9-2.2 1.1-.3 1.5-.8 1.9-2.2Z" />
    </svg>
  );
}

function EmptyChatState({ onAsk }: { onAsk: (q: string) => void }) {
  return (
    <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '18px 6px', textAlign: 'center' }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'linear-gradient(135deg,#4f7bff,#8a5cf6,#e05ad0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 28px rgba(90,60,220,.35)',
        }}
      >
        <SparkleIcon />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ font: '700 14px Assistant,sans-serif', color: '#E6F5FF' }}>מה תרצו לדעת על הגזרה?</span>
        <span style={{ font: '400 11px/1.5 Assistant,sans-serif', color: '#8F91A0' }}>אפשר לשאול בשפה חופשית על אירועים, מגמות ותשתיות בפוליגון שנבחר</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, width: '100%', maxWidth: 300 }}>
        {SUGGESTED_QUESTIONS.map((q) => (
          <div
            key={q}
            onClick={() => onAsk(q)}
            className="starter-q"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              padding: '9px 12px',
              border: '1px solid rgba(255,255,255,.13)',
              borderRadius: 10,
              background: '#22252b',
              font: '400 12px Assistant,sans-serif',
              color: '#c8d0dd',
              cursor: 'pointer',
              textAlign: 'right',
            }}
          >
            <span>{q}</span>
            <span style={{ flex: '0 0 auto', color: '#8F91A0' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ size = 108 }: { size?: number }) {
  const total = SEVERITY_BREAKDOWN.reduce((s, x) => s + x.count, 0);
  const r = 40;
  const c = 2 * Math.PI * r;
  const segments = SEVERITY_BREAKDOWN.reduce<{ sev: number; color: string; dash: number; offset: number }[]>((acc, s) => {
    const prevEnd = acc.length ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0;
    acc.push({ sev: s.sev, color: s.color, dash: (s.count / total) * c, offset: prevEnd });
    return acc;
  }, []);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="14" />
      {segments.map((seg) => (
        <circle
          key={seg.sev}
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={seg.color}
          strokeWidth="14"
          strokeDasharray={`${seg.dash} ${c - seg.dash}`}
          strokeDashoffset={-seg.offset}
          transform="rotate(-90 50 50)"
        />
      ))}
      <text x="50" y="47" textAnchor="middle" fontSize="13" fontWeight={700} fill="#E6F5FF">
        {total}
      </text>
      <text x="50" y="60" textAnchor="middle" fontSize="7" fill="#8F91A0">
        אירועים
      </text>
    </svg>
  );
}

export default function AiPanel(props: AiPanelProps) {
  const {
    panelW,
    onResizeStart,
    onClose,
    sectionAOpen,
    toggleSectionA,
    sectionBOpen,
    toggleSectionB,
    graphsOn,
    toggleGraphs,
    highlight,
    onOpenEventList,
    onOpenEvent,
    dateFrom,
    dateTo,
    onEditDates,
    reportClaim,
    reportCat,
    reportDone,
    onReportSummary,
    onCloseReport,
    onPickCat,
    onSubmitReport,
    messages,
    suggestedOpen,
    toggleSuggested,
    draft,
    setDraft,
    onSend,
    onAsk,
    onOpenSource,
    onJumpArea,
    overlay,
  } = props;

  const topEvents = EVENTS.filter((e) => e.sev >= 3);
  const [editingDates, setEditingDates] = useState(false);
  const [dateFromDraft, setDateFromDraft] = useState(dateFrom);
  const [dateToDraft, setDateToDraft] = useState(dateTo);

  function startEditDates() {
    setDateFromDraft(dateFrom);
    setDateToDraft(dateTo);
    setEditingDates(true);
  }

  function saveDates() {
    onEditDates(dateFromDraft.trim() || dateFrom, dateToDraft.trim() || dateTo);
    setEditingDates(false);
  }

  function handleExport() {
    if (!sectionAOpen) toggleSectionA();
    if (!sectionBOpen) toggleSectionB();
    if (!graphsOn) toggleGraphs();
    setTimeout(() => window.print(), 300);
  }

  function jumpTo(id: string, open: boolean, onToggle: () => void) {
    if (!open) onToggle();
    requestAnimationFrame(() => {
      setTimeout(() => {
        const box = document.getElementById('ai-scroll');
        const el = document.getElementById(id);
        if (box && el) box.scrollTop = el.offsetTop - box.offsetTop - 8;
      }, 40);
    });
  }

  return (
    <div
      dir="rtl"
      style={{
        position: 'fixed',
        top: 44,
        right: 0,
        bottom: 0,
        width: panelW,
        zIndex: 700,
        display: 'flex',
        flexDirection: 'column',
        background: '#14151a',
        borderLeft: '1px solid rgba(255,255,255,.13)',
        boxShadow: '-24px 0 64px rgba(0,0,0,.5)',
        fontFamily: 'Assistant,system-ui,sans-serif',
      }}
    >
      <div onMouseDown={onResizeStart} style={{ position: 'absolute', top: 0, bottom: 0, left: -3, width: 8, zIndex: 9, cursor: 'col-resize' }} />

      <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 9, padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,.13)', background: '#1B1C1D' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ font: '700 15px Assistant,sans-serif', color: '#E6F5FF' }}>סוכן בינה מבצעית</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {editingDates ? (
              <div style={{ direction: 'ltr', display: 'flex', alignItems: 'center', gap: 4 }}>
                <input
                  value={dateFromDraft}
                  onChange={(e) => setDateFromDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveDates();
                  }}
                  style={{ width: 40, height: 20, padding: '0 5px', background: '#1B1C1D', border: '1px solid rgba(255,255,255,.2)', borderRadius: 4, color: '#E6F5FF', font: '400 10px Assistant,sans-serif', outline: 'none', textAlign: 'center' }}
                />
                <span style={{ color: '#8F91A0', font: '400 10px Assistant,sans-serif' }}>–</span>
                <input
                  value={dateToDraft}
                  onChange={(e) => setDateToDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveDates();
                  }}
                  style={{ width: 40, height: 20, padding: '0 5px', background: '#1B1C1D', border: '1px solid rgba(255,255,255,.2)', borderRadius: 4, color: '#E6F5FF', font: '400 10px Assistant,sans-serif', outline: 'none', textAlign: 'center' }}
                />
                <span onClick={saveDates} title="שמירה" style={{ color: '#7fdcab', cursor: 'pointer', font: '700 12px Assistant,sans-serif' }}>
                  ✓
                </span>
              </div>
            ) : (
              <span
                onClick={startEditDates}
                title="עריכת טווח תאריכים"
                style={{ direction: 'ltr', display: 'flex', alignItems: 'center', gap: 5, height: 20, padding: '0 8px', borderRadius: 4, background: 'rgba(0,0,0,.25)', border: '1px solid rgba(255,255,255,.13)', font: '500 10px Assistant,sans-serif', color: '#c8d0dd', cursor: 'pointer' }}
              >
                {dateFrom}–{dateTo}
                <span style={{ color: '#8F91A0', display: 'flex' }}>
                  <PencilIcon size={9} />
                </span>
              </span>
            )}
            <span onClick={handleExport} title="ייצוא ל-PDF" style={{ font: '400 14px Assistant,sans-serif', color: '#8F91A0', cursor: 'pointer' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8F91A0" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12m0 0-4-4m4 4 4-4" />
                <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
              </svg>
            </span>
            <span onClick={onClose} title="סגור" style={{ font: '400 16px Assistant,sans-serif', color: '#8F91A0', cursor: 'pointer' }}>
              ✕
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <NavPill color="#8b93a3" onClick={() => jumpTo('section-a', sectionAOpen, toggleSectionA)}>
            <ClipboardIcon />
            קרקע וסביבה
          </NavPill>
          <NavPill color="#e5484d" onClick={() => jumpTo('section-b', sectionBOpen, toggleSectionB)}>
            <ClockIcon />
            התרחשיות
          </NavPill>
          <NavPill color="#5b9bff" onClick={() => jumpTo('section-c', graphsOn, toggleGraphs)}>
            <PieIcon />
            גרפים
          </NavPill>
        </div>
      </div>

      <div style={{ flex: '1 1 auto', minWidth: 0, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div id="ai-scroll" style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', overflowX: 'hidden', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div id="print-report" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="print-only" style={{ marginBottom: 4 }}>
            <div style={{ font: '700 16px Assistant,sans-serif', color: '#E6F5FF' }}>דוח תמונת מצב — חרבות ברזל · חטיבה 188</div>
            <div style={{ font: '400 11px Assistant,sans-serif', color: '#8F91A0' }}>הופק בתאריך {new Date().toLocaleString('he-IL')}</div>
          </div>

          <div>
            <SectionHeader id="section-a" color="#8b93a3" icon={<ClipboardIcon />} title="חלק א׳ - קרקע ומאפייני סביבה" open={sectionAOpen} onToggle={toggleSectionA} />
            {sectionAOpen && (
              <div style={{ border: '1px solid rgba(255,255,255,.09)', borderTop: 'none', borderRadius: '0 0 9px 9px', padding: '10px 12px', background: '#1c1e24' }}>
                <div style={{ font: '400 13px/1.75 Assistant,sans-serif', color: '#E6F5FF' }}>
                  גזרת <LinkSpan onClick={onJumpArea}>{AREA_LINKS[0]}</LinkSpan> בגודל 4.2 קמ״ר במרחב חאן יונס, מאופיינת ברכס מרכזי בציר מזרח־מערב ובשני אגני ניקוז. בתוכה
                  הישובים <LinkSpan onClick={onJumpArea}>{AREA_LINKS[1]}</LinkSpan> ו<LinkSpan onClick={onJumpArea}>{AREA_LINKS[2]}</LinkSpan>, והצירים המרכזיים בה הם{' '}
                  <LinkSpan onClick={onJumpArea}>{AREA_LINKS[3]}</LinkSpan> ו<LinkSpan onClick={onJumpArea}>{AREA_LINKS[4]}</LinkSpan>. בגזרה 3 איתורים רגישים: מבנה 934/C
                  (מבנה רב קומות), יעד E19 (פתח מנהרה) ומתקן ציבורי בצומת הצפון.
                </div>
              </div>
            )}
          </div>

          <div>
            <SectionHeader id="section-b" color="#e5484d" icon={<ClockIcon />} title="חלק ב׳ - התרחשיות מבצעיות בתקופה" open={sectionBOpen} onToggle={toggleSectionB} />
            {sectionBOpen && (
              <div style={{ border: '1px solid rgba(255,255,255,.09)', borderTop: 'none', borderRadius: '0 0 9px 9px', padding: '10px 12px', background: '#1c1e24' }}>
                <div style={{ font: '400 13px/1.85 Assistant,sans-serif', color: '#E6F5FF', marginBottom: 10 }}>
                  בפרק הזמן שבחרת (12/05–15/05) היו <FactSpan onClick={() => onOpenEventList('אירועים בפוליגון · 12/05–15/05')} color="#ff8f92">64 אירועים</FactSpan>, בהם{' '}
                  <FactSpan onClick={() => onOpenEventList('אירועים בפוליגון · 12/05–15/05')} color="#ff8f92">17 מיקושים</FactSpan>. דווחו בגזרה{' '}
                  <FactSpan onClick={() => onOpenEventList('אירועים בפוליגון · 12/05–15/05')}>9 כוחות</FactSpan>. מירב האירועים היו באזור צומת אמירה–דקל. סטטוס המבנים:
                  4,600 מבנים בגזרה, מתוכם <FactSpan onClick={() => onOpenEventList('אירועים בפוליגון · 12/05–15/05')}>612 הרוסים</FactSpan> ו־
                  <FactSpan onClick={() => onOpenEventList('אירועים בפוליגון · 12/05–15/05')}>38 נתקפו</FactSpan> בחלון הזמן שסונן.
                </div>

                <div style={{ position: 'relative' }}>
                  {topEvents.map((ev, i) => (
                    <div key={ev.id} onClick={() => onOpenEvent(ev.id)} style={{ display: 'flex', gap: 10, cursor: 'pointer', paddingBottom: i === topEvents.length - 1 ? 0 : 14 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: ev.sev >= 3 ? '#ff4d4f' : '#f5a524', flex: '0 0 auto' }} />
                        {i !== topEvents.length - 1 && <span style={{ width: 1, flex: '1 1 auto', background: 'rgba(255,255,255,.12)', marginTop: 2 }} />}
                      </div>
                      <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                        <div style={{ font: '400 10px Assistant,sans-serif', color: '#8F91A0', direction: 'ltr', textAlign: 'right' }}>{ev.time}</div>
                        <div style={{ font: '600 12.5px/1.5 Assistant,sans-serif', color: '#E6F5FF' }}>{ev.text}</div>
                        <div style={{ font: '400 11px Assistant,sans-serif', color: '#8F91A0' }}>{ev.place}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 12 }}>
                  <span onClick={onReportSummary} className="report-link" style={{ font: '500 10px Assistant,sans-serif', color: '#8F91A0', cursor: 'pointer' }}>
                    דווח על אי־דיוק
                  </span>
                </div>

                {reportClaim && (
                  <div className="no-print" style={{ marginTop: 10, border: '1px solid #7a3b3f', borderRadius: 10, background: 'rgba(229,72,77,.06)', padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ font: '700 12px Assistant,sans-serif', color: '#ff8f92' }}>דיווח על טענה</span>
                      <span onClick={onCloseReport} style={{ font: '400 13px Assistant,sans-serif', color: '#8F91A0', cursor: 'pointer' }}>
                        ✕
                      </span>
                    </div>
                    <div style={{ font: '400 12px/1.5 Assistant,sans-serif', color: '#c8d0dd', padding: '7px 9px', background: 'rgba(0,0,0,.25)', borderRadius: 6, marginBottom: 9 }}>{reportClaim.text}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 9 }}>
                      {CATS.map((cat) => {
                        const on = reportCat === cat.id;
                        return (
                          <span
                            key={cat.id}
                            onClick={() => onPickCat(cat.id)}
                            style={{
                              height: 24,
                              display: 'flex',
                              alignItems: 'center',
                              padding: '0 9px',
                              borderRadius: 999,
                              border: `1px solid ${on ? '#ff4d4f' : 'rgba(255,255,255,.13)'}`,
                              background: on ? 'rgba(229,72,77,.18)' : '#22252b',
                              font: '500 11px Assistant,sans-serif',
                              color: on ? '#ff8f92' : '#c8d0dd',
                              cursor: 'pointer',
                            }}
                          >
                            {cat.label}
                          </span>
                        );
                      })}
                    </div>
                    <textarea
                      placeholder="פירוט חופשי (רשות)"
                      style={{ width: '100%', height: 54, boxSizing: 'border-box', resize: 'none', padding: '7px 9px', background: '#1B1C1D', border: '1px solid rgba(255,255,255,.13)', borderRadius: 6, color: '#E6F5FF', font: '400 12px Assistant,sans-serif', outline: 'none' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 9 }}>
                      <span style={{ font: '400 10px Assistant,sans-serif', color: '#8F91A0' }}>נאסף אוטומטית: גזרה, חלון זמן, גרסת מודל ו-prompt, גרפים מוצגים, מזהה משתמש</span>
                      <div onClick={onSubmitReport} style={{ display: 'flex', alignItems: 'center', height: 26, padding: '0 12px', background: 'rgba(229,72,77,.18)', border: '1px solid #7a3b3f', borderRadius: 6, font: '600 11px Assistant,sans-serif', color: '#ff8f92', cursor: 'pointer' }}>
                        שליחה
                      </div>
                    </div>
                  </div>
                )}

                {reportDone && (
                  <div className="no-print" style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', border: '1px solid #2f6d4f', borderRadius: 8, background: 'rgba(48,164,108,.08)', font: '500 11px Assistant,sans-serif', color: '#7fdcab' }}>
                    הדיווח נשלח לתור ניהול המוצר. הסיכום לא השתנה.
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <SectionHeader id="section-c" color="#5b9bff" icon={<PieIcon />} title="חלק ג׳ - גרפים ומגמות" open={graphsOn} onToggle={toggleGraphs} />
            {graphsOn && (
              <div style={{ border: '1px solid rgba(255,255,255,.09)', borderTop: 'none', borderRadius: '0 0 9px 9px', padding: '12px', background: '#1c1e24', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <DonutChart />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span style={{ font: '600 11px Assistant,sans-serif', color: '#8F91A0', marginBottom: 2 }}>פילוח לפי חומרה</span>
                    {SEVERITY_BREAKDOWN.map((s) => (
                      <div key={s.sev} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flex: '0 0 auto' }} />
                        <span style={{ font: '500 11px Assistant,sans-serif', color: '#E6F5FF' }}>
                          {s.label} ({s.count})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 10 }}>
                  {GRAPHS.map((c) => {
                    const max = Math.max(...c.vals) || 1;
                    const border = highlight === c.id ? '#5b9bff' : 'rgba(255,255,255,.09)';
                    return (
                      <div key={c.id} id={`chart-${c.id}`} style={{ border: `1px solid ${border}`, borderRadius: 9, background: '#2b2e34', padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ font: '600 11px Assistant,sans-serif', color: '#E6F5FF' }}>{c.title}</span>
                          <span onClick={() => onOpenEventList(c.title)} style={{ font: '500 9px Assistant,sans-serif', color: '#9ec3ff', cursor: 'pointer' }}>
                            רשימת אירועים
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 70 }}>
                          {c.vals.map((v, i) => (
                            <div key={i} style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
                              <div style={{ height: `${Math.round((v / max) * 100)}%`, background: c.color, borderRadius: '2px 2px 0 0' }} />
                            </div>
                          ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, font: '400 9px Assistant,sans-serif', color: '#8F91A0' }}>
                          <span>{c.from}</span>
                          <span>{c.to}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          </div>

          {messages.length === 0 && <EmptyChatState onAsk={onAsk} />}

          {messages.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {messages.map((m, i) => {
                const isMe = m.who === 'me';
                const bubble = (
                  <div
                    dir="rtl"
                    style={{
                      padding: '7px 10px',
                      borderRadius: 11,
                      background: isMe ? 'rgba(255,255,255,.05)' : '#e9f0fb',
                      boxShadow: isMe ? 'none' : '0 1px 3px rgba(0,0,0,.25)',
                    }}
                  >
                    {m.time && <div style={{ font: '400 9px Assistant,sans-serif', color: isMe ? '#8F91A0' : '#7b8598', marginBottom: 2, textAlign: 'right' }}>{m.time}</div>}
                    {m.estimate && (
                      <span style={{ display: 'inline-block', marginBottom: 3, padding: '1px 6px', borderRadius: 4, background: 'rgba(245,165,36,.16)', border: '1px solid #8a6a20', font: '700 9px Assistant,sans-serif', color: '#f5a524' }}>
                        הערכה בלבד
                      </span>
                    )}
                    <div style={{ font: '400 11px/1.5 Assistant,sans-serif', color: isMe ? '#E6F5FF' : '#3c4457' }}>{m.text}</div>
                    {m.source && (
                      <span onClick={() => onOpenSource(m.source!)} style={{ display: 'inline-block', marginTop: 3, font: '500 10px Assistant,sans-serif', color: isMe ? '#9ec3ff' : '#3169c9', cursor: 'pointer' }}>
                        {`מקור: ${m.source}`}
                      </span>
                    )}
                  </div>
                );
                return (
                  <div key={i} style={{ direction: 'ltr', display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', gap: 8 }}>
                    {!isMe && <BotAvatar />}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxWidth: '82%' }}>
                      {bubble}
                      {!isMe && (
                        <div style={{ direction: 'rtl' }}>
                          <MessageActions text={m.text} />
                        </div>
                      )}
                    </div>
                    {isMe && <UserAvatar />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ flex: '0 0 auto', padding: '8px 14px 12px', background: '#14151a' }}>
          {messages.length > 0 && (
            <>
              <div onClick={toggleSuggested} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <span style={{ font: '500 10px Assistant,sans-serif', color: '#8F91A0' }}>שאלות מוצעות</span>
                <span style={{ font: '400 10px Assistant,sans-serif', color: '#8F91A0' }}>{suggestedOpen ? '▲' : '▼'}</span>
              </div>
              {suggestedOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 7 }}>
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <span key={q} onClick={() => onAsk(q)} className="suggested-q" style={{ padding: '5px 8px', border: '1px solid rgba(255,255,255,.13)', borderRadius: 7, background: '#22252b', font: '400 11px Assistant,sans-serif', color: '#c8d0dd', cursor: 'pointer' }}>
                      {q}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 8,
              height: 38,
              padding: '0 6px 0 14px',
              background: '#1B1C1D',
              border: '1px solid rgba(255,255,255,.15)',
              borderRadius: 999,
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSend();
              }}
              placeholder="איך אוכל לעזור?"
              style={{ flex: '1 1 auto', minWidth: 0, height: 26, border: 0, background: 'transparent', color: '#E6F5FF', font: '400 12px Assistant,sans-serif', outline: 'none' }}
            />
            <div
              onClick={onSend}
              style={{
                flex: '0 0 auto',
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#5b9bff,#1863e0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(-135deg)' }}>
                <path d="M22 2 11 13" />
                <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
              </svg>
            </div>
          </div>
          <div style={{ marginTop: 6, font: '400 9px Assistant,sans-serif', color: '#8F91A0' }}>יכולות מבוססות AI עשויות לטעות, יש להפעיל שיקול דעת מבצעי.</div>
        </div>
      </div>

      {overlay}
    </div>
  );
}
