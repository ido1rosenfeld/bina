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
import MissionSheet from './components/MissionSheet';
import RecsPanel from './components/RecsPanel';
import JournalBar from './components/JournalBar';
import ConfirmDialog from './components/ConfirmDialog';
import { ENTITIES, EVENTS, INITIAL_MESSAGES, RECS, RECS_W, ROLES, SIDEBAR_W, answerFor, offsetCoord } from './data';
import type { ChatMessage, RecItem, RoleId } from './data';
import { EMPTY_FILTERS, type FilterLayout, type FilterState } from './filters';

const LAYOUT_KEY = 'bina.filterLayout';
function readLayout(): FilterLayout {
  try {
    return localStorage.getItem(LAYOUT_KEY) === 'floating' ? 'floating' : 'docked';
  } catch {
    return 'docked';
  }
}

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

  const [role, setRole] = useState<RoleId>('agam');
  const [sideActive, setSideActive] = useState<string | null>(null);
  const [missionOpen, setMissionOpen] = useState(false);
  const [recsOpen, setRecsOpen] = useState(false);
  const [queueIds, setQueueIds] = useState(() => RECS.slice(0, -1).map((r) => r.id));
  const [mineIds, setMineIds] = useState(() => [RECS[RECS.length - 1].id]);
  const [activeRecId, setActiveRecId] = useState<string | null>(RECS[RECS.length - 1].id);
  const [historyAsk, setHistoryAsk] = useState<RecItem | null>(null);
  const [historyBarOpen, setHistoryBarOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [filterLayout, setFilterLayoutState] = useState<FilterLayout>(readLayout);

  function setFilterLayout(l: FilterLayout) {
    setFilterLayoutState(l);
    try {
      localStorage.setItem(LAYOUT_KEY, l);
    } catch {
      /* storage unavailable — keep in memory only */
    }
  }

  const exposure = role === 'exposure';
  const rightPanelW = aiOpen ? panelW : recsOpen ? RECS_W : 0;
  const mapRight = `${SIDEBAR_W + rightPanelW}px`;
  const recById = (id: string) => RECS.find((r) => r.id === id);
  const queueRecs = queueIds.map(recById).filter((r) => r !== undefined);
  const mineRecs = mineIds.map(recById).filter((r) => r !== undefined);
  const activeRec = activeRecId && mineIds.includes(activeRecId) ? (recById(activeRecId) ?? null) : null;

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 2600);
  }

  function changeRole(r: RoleId) {
    setRole(r);
    setSideActive(null);
    setRecsOpen(false);
    setHistoryBarOpen(false);
    setHistoryAsk(null);
  }

  function onSideItem(id: string) {
    if (id === 'mission') return setMissionOpen(true);
    if (id === 'recs') {
      setAiOpen(false);
      return setRecsOpen((v) => !v);
    }
    setSideActive((a) => (a === id ? null : id));
  }

  function toggleAi() {
    if (aiOpen) return closeAi();
    setRecsOpen(false);
    setAiOpen(true);
  }

  function openHistoryForRec(rec: RecItem) {
    const [lat, lng] = offsetCoord(rec.dy, rec.dx);
    setHistoryAsk(null);
    setHistoryBarOpen(true);
    mapRef.current?.jumpTo(`${lat}, ${lng}`);
  }
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
      <TopBar role={role} onRole={changeRole} />
      {(!exposure || historyBarOpen) && (
      <FilterBar
        mapRight={mapRight}
        onClose={exposure ? () => setHistoryBarOpen(false) : undefined}
        docOpen={docOpen}
        toggleDoc={() => setDocOpen((v) => !v)}
        layers={layers}
        toggleLayer={toggleLayer}
        filters={filters}
        setFilters={setFilters}
        filterLayout={filterLayout}
        setFilterLayout={setFilterLayout}
      />
      )}
      {exposure && !historyBarOpen && (
        <JournalBar
          mapRight={mapRight}
          activeRec={activeRec}
          onSubmit={(_, tab) => showToast(activeRec ? `התיאור נוסף להמלצה ${activeRec.id}` : `הדיווח נוסף ליומן · ${tab}`)}
          onFinishRec={(verdict) => {
            if (!activeRec) return;
            setMineIds((ids) => ids.filter((x) => x !== activeRec.id));
            setActiveRecId(null);
            showToast(`הטיפול בהמלצה ${activeRec.id} הסתיים · ${verdict}`);
          }}
        />
      )}
      <SideBar
        role={role}
        roleShort={ROLES.find((r) => r.id === role)?.short ?? ''}
        activeKey={recsOpen ? 'recs' : missionOpen ? 'mission' : sideActive}
        onItem={onSideItem}
        aiOpen={aiOpen}
        onToggleAi={toggleAi}
      />
      {recsOpen && (
        <RecsPanel
          queue={queueRecs}
          mine={mineRecs}
          activeId={activeRecId}
          onTake={(id) => {
            setQueueIds((ids) => ids.filter((x) => x !== id));
            setMineIds((ids) => [...ids, id]);
            setActiveRecId(id);
          }}
          onReject={(id) => {
            setQueueIds((ids) => ids.filter((x) => x !== id));
            showToast(`ההמלצה ${id} נדחתה`);
          }}
          onOpenRec={setHistoryAsk}
          onActivate={setActiveRecId}
          onClose={() => setRecsOpen(false)}
        />
      )}
      {historyAsk && (
        <div style={{ position: 'absolute', top: 44, bottom: 0, left: 0, right: mapRight, zIndex: 880, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5,7,10,.25)' }} onClick={() => setHistoryAsk(null)}>
          <ConfirmDialog
            title="האם ברצונך לפתוח את סרגל ההיסטוריה הגזרתית?"
            body={`הסרגל יציג את ההתרחשויות, התשתיות והמגמות בגזרה סביב ${historyAsk.title} ${historyAsk.id}.`}
            confirmLabel="כן, פתח סרגל"
            onConfirm={() => openHistoryForRec(historyAsk)}
            onCancel={() => setHistoryAsk(null)}
          />
        </div>
      )}
      {missionOpen && (
        <MissionSheet onClose={() => setMissionOpen(false)} onToast={showToast} layers={layers} toggleLayer={toggleLayer} filters={filters} setFilters={setFilters} filterLayout={filterLayout} setFilterLayout={setFilterLayout} />
      )}
      {toast && (
        <div dir="rtl" style={{ position: 'absolute', top: 58, left: '50%', transform: 'translateX(-50%)', zIndex: 1100, padding: '9px 16px', borderRadius: 10, background: '#1f2a3d', border: '1px solid rgba(77,141,255,.45)', color: '#e7edf7', font: '600 12.5px Assistant,sans-serif', boxShadow: '0 12px 36px rgba(0,0,0,.5)' }}>
          {toast}
        </div>
      )}
      {hoverEntity && entityAnchor && (
        <EntityHoverCard entity={hoverEntity} anchor={entityAnchor} rightInset={SIDEBAR_W + rightPanelW} onClose={() => selectEntity(null)} onView={() => viewEntity(hoverEntity.id)} />
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
