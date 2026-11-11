import { useRef, useState, type MouseEvent } from 'react';
import TopBar from './components/TopBar';
import MapView, { type MapViewHandle, type ScreenPoint } from './components/MapView';
import FilterBar from './components/FilterBar';
import AiPanel from './components/AiPanel';
import SideBar from './components/SideBar';
import EventListOverlay from './components/EventListOverlay';
import EventCardModal from './components/EventCardModal';
import EntityHoverCard from './components/EntityHoverCard';
import EntityCard, { type EntityPatch } from './components/EntityCard';
import { ENTITIES, EVENTS, INITIAL_MESSAGES, SIDEBAR_W, answerFor } from './data';
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
  const [dateFrom, setDateFrom] = useState('12/05');
  const [dateTo, setDateTo] = useState('15/05');
  const [reportClaim, setReportClaim] = useState<ReportClaim | null>(null);
  const [reportCat, setReportCat] = useState<string | null>(null);
  const [reportDone, setReportDone] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [hoverOpen, setHoverOpen] = useState(false);
  const [entityAnchor, setEntityAnchor] = useState<ScreenPoint | null>(null);
  const [cardIds, setCardIds] = useState<string[]>([]);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [entityEdits, setEntityEdits] = useState<Record<string, EntityPatch>>({});

  const mapRight = `${SIDEBAR_W + (aiOpen ? panelW : 0)}px`;
  const entities = ENTITIES.map((e) => ({ ...e, ...entityEdits[e.id] }));
  const hoverEntity = hoverOpen ? entities.find((e) => e.id === selectedEntityId) : undefined;
  const cardEntities = cardIds.map((id) => entities.find((e) => e.id === id)).filter((e) => e !== undefined);

  function selectEntity(id: string | null) {
    setSelectedEntityId(id);
    setHoverOpen(id !== null);
  }

  function viewEntity(id: string) {
    setCardIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
    setActiveCardId(id);
    setHoverOpen(false);
  }

  function closeEntityCard(id: string) {
    const rest = cardIds.filter((x) => x !== id);
    setCardIds(rest);
    setActiveCardId(rest[rest.length - 1] ?? null);
    if (selectedEntityId === id) setSelectedEntityId(null);
  }

  function activateEntityCard(id: string) {
    setActiveCardId(id);
    setSelectedEntityId(id);
    setHoverOpen(false);
  }

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
      const w = Math.max(300, Math.min(window.innerWidth - 160 - SIDEBAR_W, startW + (startX - ev.clientX)));
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
      <MapView
        ref={mapRef}
        layers={layers}
        mapRight={mapRight}
        selectedEntityId={selectedEntityId}
        onSelectEntity={selectEntity}
        onEntityAnchor={setEntityAnchor}
      />
      <TopBar />
      <FilterBar
        mapRight={mapRight}
        docOpen={docOpen}
        toggleDoc={() => setDocOpen((v) => !v)}
        layers={layers}
        toggleLayer={toggleLayer}
      />
      <SideBar aiOpen={aiOpen} onToggleAi={() => (aiOpen ? closeAi() : setAiOpen(true))} />
      {hoverEntity && entityAnchor && (
        <EntityHoverCard entity={hoverEntity} anchor={entityAnchor} rightInset={SIDEBAR_W + (aiOpen ? panelW : 0)} onClose={() => selectEntity(null)} onView={() => viewEntity(hoverEntity.id)} />
      )}
      {cardEntities.length > 0 && activeCardId && (
        <EntityCard
          entities={cardEntities}
          activeId={activeCardId}
          onActivate={activateEntityCard}
          onClose={closeEntityCard}
          onSave={(id, patch) => setEntityEdits((s) => ({ ...s, [id]: patch }))}
          onLocate={(id) => {
            setSelectedEntityId(id);
            mapRef.current?.focusEntity(id);
          }}
        />
      )}

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
          dateFrom={dateFrom}
          dateTo={dateTo}
          onEditDates={(from, to) => {
            setDateFrom(from);
            setDateTo(to);
          }}
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
