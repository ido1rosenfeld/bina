import { useRef, useState, type MouseEvent } from 'react';
import TopBar from './components/TopBar';
import MapView, { type MapViewHandle } from './components/MapView';
import FilterBar from './components/FilterBar';
import AiPanel from './components/AiPanel';
import AiFab from './components/AiFab';
import EventListOverlay from './components/EventListOverlay';
import EventCardModal from './components/EventCardModal';
import { EVENTS, INITIAL_MESSAGES, answerFor } from './data';
import type { ChatMessage } from './data';

interface ReportClaim {
  id: string;
  text: string;
}

export default function App() {
  const mapRef = useRef<MapViewHandle | null>(null);

  const [docOpen, setDocOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [sectionAOpen, setSectionAOpen] = useState(false);
  const [sectionBOpen, setSectionBOpen] = useState(false);
  const [graphsOn, setGraphsOn] = useState(false);
  const [highlight] = useState<string | null>(null);
  const [layers, setLayers] = useState<Record<string, boolean>>({ events: true, detect: true });
  const [panelW, setPanelW] = useState(420);
  const [suggestedOpen, setSuggestedOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [listTitle, setListTitle] = useState('');
  const [eventOpenId, setEventOpenId] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [reportClaim, setReportClaim] = useState<ReportClaim | null>(null);
  const [reportCat, setReportCat] = useState<string | null>(null);
  const [reportDone, setReportDone] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  const mapRight = aiOpen ? `${panelW}px` : '0px';

  function toggleLayer(key: string) {
    setLayers((s) => ({ ...s, [key]: !s[key] }));
    if (key === 'doc') setDocOpen((v) => !v);
  }

  function openEventList(title: string) {
    setAiOpen(true);
    setListOpen(true);
    setListTitle(title);
  }

  function closeAi() {
    setAiOpen(false);
    setReportClaim(null);
    setListOpen(false);
    setEventOpenId(null);
  }

  function beginResize(e: MouseEvent) {
    e.preventDefault();
    const startX = e.clientX;
    const startW = panelW;
    const move = (ev: globalThis.MouseEvent) => {
      const w = Math.max(300, Math.min(window.innerWidth - 160, startW + (startX - ev.clientX)));
      setPanelW(w);
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      document.body.style.userSelect = '';
    };
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }

  function jumpToMap(coord: string) {
    setEventOpenId(null);
    setListOpen(false);
    setAiOpen(false);
    mapRef.current?.jumpTo(coord);
  }

  function pushChat(text: string) {
    const q = text.trim();
    if (!q) return;
    const reply = answerFor(q);
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setDraft('');
    setMessages((s) => [...s, { who: 'me', text: q, time }, { who: 'ai', ...reply, time }]);
  }

  function submitReport() {
    if (!reportClaim) return;
    setReportClaim(null);
    setReportDone(true);
  }

  const eventOpen = eventOpenId ? EVENTS.find((e) => e.id === eventOpenId) ?? null : null;

  return (
    <div dir="rtl" style={{ position: 'fixed', inset: 0, background: '#14151a', color: '#e7edf7', overflow: 'hidden', fontFamily: 'Assistant,system-ui,sans-serif' }}>
      <MapView ref={mapRef} layers={layers} mapRight={mapRight} />
      <TopBar />
      <FilterBar mapRight={mapRight} docOpen={docOpen} toggleDoc={() => setDocOpen((v) => !v)} layers={layers} toggleLayer={toggleLayer} />
      {!aiOpen && <AiFab onClick={() => setAiOpen(true)} />}

      {aiOpen && (
        <AiPanel
          panelW={panelW}
          onResizeStart={beginResize}
          onClose={closeAi}
          sectionAOpen={sectionAOpen}
          toggleSectionA={() => setSectionAOpen((v) => !v)}
          sectionBOpen={sectionBOpen}
          toggleSectionB={() => setSectionBOpen((v) => !v)}
          graphsOn={graphsOn}
          toggleGraphs={() => setGraphsOn((v) => !v)}
          highlight={highlight}
          onOpenEventList={openEventList}
          onOpenEvent={(id) => setEventOpenId(id)}
          rating={rating}
          setRating={setRating}
          reportClaim={reportClaim}
          reportCat={reportCat}
          reportDone={reportDone}
          onReportSummary={() => {
            setReportClaim({ id: 'summary', text: 'תמונת המצב המסונתזת (פסקה כללית + התרחשויות)' });
            setReportCat(null);
            setReportDone(false);
          }}
          onCloseReport={() => setReportClaim(null)}
          onPickCat={(id) => setReportCat(id)}
          onSubmitReport={submitReport}
          messages={messages}
          suggestedOpen={suggestedOpen}
          toggleSuggested={() => setSuggestedOpen((v) => !v)}
          draft={draft}
          setDraft={setDraft}
          onSend={() => pushChat(draft)}
          onAsk={pushChat}
          onOpenSource={openEventList}
          onJumpArea={() => setAiOpen(false)}
          overlay={
            <>
              {listOpen && (
                <EventListOverlay
                  title={listTitle || 'רשימת האירועים'}
                  events={EVENTS}
                  onClose={() => setListOpen(false)}
                  onOpenEvent={(ev) => setEventOpenId(ev.id)}
                />
              )}
              {eventOpen && <EventCardModal event={eventOpen} onClose={() => setEventOpenId(null)} onJumpToMap={() => jumpToMap(eventOpen.coord)} />}
            </>
          }
        />
      )}
    </div>
  );
}
