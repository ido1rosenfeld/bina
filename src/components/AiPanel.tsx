import type { MouseEvent, ReactNode } from 'react';
import { EVENTS, GRAPHS, CATS, SUGGESTED_QUESTIONS } from '../data';
import type { ChatMessage } from '../data';

interface ReportClaim {
  id: string;
  text: string;
}

interface AiPanelProps {
  panelW: number;
  onResizeStart: (e: MouseEvent) => void;
  onClose: () => void;
  graphsOn: boolean;
  toggleGraphs: () => void;
  highlight: string | null;
  onOpenEventList: (title: string) => void;
  onOpenEvent: (id: string) => void;
  rating: number | null;
  setRating: (n: number) => void;
  reportClaim: ReportClaim | null;
  reportCat: string | null;
  reportDone: boolean;
  onReportSummary: () => void;
  onCloseReport: () => void;
  onPickCat: (id: string) => void;
  onSubmitReport: () => void;
  chatOpen: boolean;
  toggleChat: () => void;
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
      <MsgIconBtn title="שתף">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v12M7 8l5-5 5 5" />
          <path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
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

export default function AiPanel(props: AiPanelProps) {
  const {
    panelW,
    onResizeStart,
    onClose,
    graphsOn,
    toggleGraphs,
    highlight,
    onOpenEventList,
    onOpenEvent,
    rating,
    setRating,
    reportClaim,
    reportCat,
    reportDone,
    onReportSummary,
    onCloseReport,
    onPickCat,
    onSubmitReport,
    chatOpen,
    toggleChat,
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

      <div style={{ flex: '1 1 auto', minWidth: 0, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, minHeight: 44, padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,.13)', background: '#1B1C1D' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 8px', minWidth: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ec3ff" strokeWidth={1.8} strokeLinecap="round">
              <path d="M12 3.5a4 4 0 0 1 4 4v.6a4 4 0 0 1 1.5 6.8V17a5.5 5.5 0 0 1-11 0v-2.1A4 4 0 0 1 8 8.1V7.5a4 4 0 0 1 4-4Z" />
            </svg>
            <span style={{ font: '700 14px Assistant,sans-serif', color: '#E6F5FF' }}>סוכן גזרה מבצעית</span>
            <span style={{ font: '400 11px Assistant,sans-serif', color: '#8F91A0' }}>פוליגון מתוחם · 12/05 06:00 – 15/05 08:15</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span onClick={onClose} style={{ font: '400 15px Assistant,sans-serif', color: '#8F91A0', cursor: 'pointer' }}>
              ✕
            </span>
          </div>
        </div>

        <div id="ai-scroll" style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', overflowX: 'hidden', padding: 14 }}>
          <div style={{ border: '1px solid #2f5d8a', borderRadius: 10, background: 'linear-gradient(rgba(24,110,255,.07),rgba(24,110,255,.02))', padding: '12px 14px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: 5, background: 'rgba(24,110,255,.2)', border: '1px solid #2f5d8a' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#9ec3ff">
                    <path d="M12 2l1.9 5.6L19.5 9l-4.4 3.6L16.4 19 12 15.9 7.6 19l1.3-6.4L4.5 9l5.6-1.4L12 2Z" />
                  </svg>
                </div>
                <span style={{ font: '700 12px Assistant,sans-serif', color: '#9ec3ff' }}>תמונת מצב גזרה</span>
              </div>
              <span style={{ font: '400 10px Assistant,sans-serif', color: '#8F91A0', direction: 'ltr' }}>מבוסס בינה מלאכותית, יש להפעיל שיקול דעת בשימוש</span>
            </div>

            <div style={{ font: '700 11px Assistant,sans-serif', color: '#8F91A0', marginBottom: 4 }}>כללי על הגזרה</div>
            <div style={{ font: '400 13px/1.75 Assistant,sans-serif', color: '#E6F5FF' }}>
              גזרת <LinkSpan onClick={onJumpArea}>{AREA_LINKS[0]}</LinkSpan> בגודל 4.2 קמ״ר במרחב חאן יונס, מאופיינת ברכס מרכזי בציר מזרח־מערב ובשני אגני ניקוז. בתוכה
              הישובים <LinkSpan onClick={onJumpArea}>{AREA_LINKS[1]}</LinkSpan> ו<LinkSpan onClick={onJumpArea}>{AREA_LINKS[2]}</LinkSpan>, והצירים המרכזיים בה הם{' '}
              <LinkSpan onClick={onJumpArea}>{AREA_LINKS[3]}</LinkSpan> ו<LinkSpan onClick={onJumpArea}>{AREA_LINKS[4]}</LinkSpan>. בגזרה 3 איתורים רגישים: מבנה 934/C
              (מבנה רב קומות), יעד E19 (פתח מנהרה) ומתקן ציבורי בצומת הצפון.
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,.08)', margin: '11px 0' }} />

            <div style={{ font: '700 11px Assistant,sans-serif', color: '#8F91A0', marginBottom: 4 }}>התרחשויות מבצעיות בתקופה</div>
            <div style={{ font: '400 13px/1.85 Assistant,sans-serif', color: '#E6F5FF' }}>
              בפרק הזמן שבחרת (12/05–15/05) היו <FactSpan onClick={() => onOpenEventList('אירועים בפוליגון · 12/05–15/05')} color="#ff8f92">64 אירועים</FactSpan>, בהם{' '}
              <FactSpan onClick={() => onOpenEventList('אירועים בפוליגון · 12/05–15/05')} color="#ff8f92">17 מיקושים</FactSpan>. דווחו בגזרה{' '}
              <FactSpan onClick={() => onOpenEventList('אירועים בפוליגון · 12/05–15/05')}>9 כוחות</FactSpan>. מירב האירועים היו באזור צומת אמירה–דקל. סטטוס המבנים:
              4,600 מבנים בגזרה, מתוכם <FactSpan onClick={() => onOpenEventList('אירועים בפוליגון · 12/05–15/05')}>612 הרוסים</FactSpan> ו־
              <FactSpan onClick={() => onOpenEventList('אירועים בפוליגון · 12/05–15/05')}>38 נתקפו</FactSpan> בחלון הזמן שסונן.
            </div>

            <div style={{ font: '700 11px Assistant,sans-serif', color: '#8F91A0', margin: '11px 0 5px' }}>אירועים משמעותיים (חומרה 3–4)</div>
            {topEvents.map((ev) => {
              const high = ev.sev >= 3;
              return (
                <div
                  key={ev.id}
                  onClick={() => onOpenEvent(ev.id)}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,.06)', cursor: 'pointer' }}
                >
                  <span
                    style={{
                      flex: '0 0 auto',
                      marginTop: 2,
                      padding: '1px 6px',
                      borderRadius: 4,
                      background: high ? 'rgba(229,72,77,.18)' : 'rgba(245,165,36,.16)',
                      border: `1px solid ${high ? '#7a3b3f' : '#8a6a20'}`,
                      font: '700 9px Assistant,sans-serif',
                      color: high ? '#ff8f92' : '#f5a524',
                    }}
                  >{`חומרה ${ev.sev}`}</span>
                  <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                    <span style={{ font: '400 12px/1.55 Assistant,sans-serif', color: '#E6F5FF' }}>{ev.text}</span>
                    <span style={{ font: '400 10px Assistant,sans-serif', color: '#8F91A0' }}> · {ev.time} · {ev.place}</span>
                  </div>
                </div>
              );
            })}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 9 }}>
              <span onClick={onReportSummary} className="report-link" style={{ font: '500 10px Assistant,sans-serif', color: '#8F91A0', cursor: 'pointer' }}>
                דווח על אי־דיוק
              </span>
            </div>
          </div>

          {reportClaim && (
            <div style={{ marginTop: 10, border: '1px solid #7a3b3f', borderRadius: 10, background: 'rgba(229,72,77,.06)', padding: '12px 14px' }}>
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
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', border: '1px solid #2f6d4f', borderRadius: 8, background: 'rgba(48,164,108,.08)', font: '500 11px Assistant,sans-serif', color: '#7fdcab' }}>
              הדיווח נשלח לתור ניהול המוצר. הסיכום לא השתנה.
            </div>
          )}

          <div
            onClick={toggleGraphs}
            className="graphs-toggle"
            style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', border: '1px solid #2f5d8a', borderRadius: 9, background: 'rgba(24,110,255,.1)', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ec3ff" strokeWidth={1.9} strokeLinecap="round">
                <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
              </svg>
              <span style={{ font: '600 12px Assistant,sans-serif', color: '#9ec3ff' }}>הפק גרפים</span>
            </div>
            <span style={{ font: '400 12px Assistant,sans-serif', color: '#8F91A0' }}>{graphsOn ? '▲' : '▼'}</span>
          </div>

          {graphsOn && (
            <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 10, paddingBottom: 14 }}>
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
          )}

          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', border: '1px solid rgba(255,255,255,.13)', borderRadius: 9, background: '#22252b' }}>
            <span style={{ font: '500 11px Assistant,sans-serif', color: '#c8d0dd' }}>האם המידע עזר לך?</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {[1, 2, 3, 4, 5].map((n) => {
                const on = rating === n;
                return (
                  <span
                    key={n}
                    onClick={() => setRating(n)}
                    style={{
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${on ? '#2f6d4f' : 'rgba(255,255,255,.13)'}`,
                      background: on ? 'rgba(48,164,108,.18)' : '#2b2e34',
                      borderRadius: 6,
                      font: '600 11px Assistant,sans-serif',
                      color: on ? '#7fdcab' : '#c8d0dd',
                      cursor: 'pointer',
                    }}
                  >
                    {n}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {chatOpen && (
        <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(255,255,255,.13)', background: '#191b1f' }}>
          <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 30, padding: '0 12px', borderBottom: '1px solid rgba(255,255,255,.09)' }}>
            <span style={{ font: '700 11px Assistant,sans-serif', color: '#E6F5FF' }}>צ'אט הסוכן</span>
            <span onClick={toggleChat} style={{ font: '400 12px Assistant,sans-serif', color: '#8F91A0', cursor: 'pointer' }}>
              ✕
            </span>
          </div>
          <div style={{ flex: '0 0 auto', maxHeight: 260, overflowY: 'auto', padding: '9px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                  {m.time && (
                    <div style={{ font: '400 9px Assistant,sans-serif', color: isMe ? '#8F91A0' : '#7b8598', marginBottom: 2, textAlign: 'right' }}>{m.time}</div>
                  )}
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
          <div style={{ flex: '0 0 auto', padding: '8px 12px 10px', borderTop: '1px solid rgba(255,255,255,.09)' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSend();
                }}
                placeholder="שאל על הגזרה"
                style={{ flex: '1 1 auto', minWidth: 0, height: 27, padding: '0 9px', background: '#1B1C1D', border: '1px solid rgba(255,255,255,.13)', borderRadius: 7, color: '#E6F5FF', font: '400 11px Assistant,sans-serif', outline: 'none' }}
              />
              <div onClick={onSend} style={{ display: 'flex', alignItems: 'center', height: 27, padding: '0 10px', background: 'rgba(24,110,255,.2)', border: '1px solid #2f5d8a', borderRadius: 7, font: '600 11px Assistant,sans-serif', color: '#9ec3ff', cursor: 'pointer' }}>
                שלח
              </div>
            </div>
            <div style={{ marginTop: 6, font: '400 9px Assistant,sans-serif', color: '#8F91A0' }}>שאלות אחזור נענות כעובדה; מגמות וסיבתיות מסומנות כהערכה.</div>
          </div>
        </div>
      )}

      {overlay}
    </div>
  );
}
