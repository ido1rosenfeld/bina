import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface MapViewHandle {
  jumpTo: (coord: string) => void;
}

interface MapViewProps {
  layers: Record<string, boolean>;
  mapRight: string;
}

const CENTER: [number, number] = [31.5215, 34.453];
// Local offset helper: dy/dx are small synthetic deltas (not real survey data),
// used only to scatter mock markers around the demo center point.
const off = (dy: number, dx: number): [number, number] => [CENTER[0] + dy * 0.001, CENTER[1] + dx * 0.001];

function buildLayerGroups(map: L.Map) {
  const dot = (color: string, size: number) =>
    L.divIcon({
      className: '',
      iconSize: [size, size],
      html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:1px solid rgba(0,0,0,.6);box-shadow:0 0 6px ${color}"></div>`,
    });
  const pts = (arr: [number, number][], color: string, size: number) =>
    L.layerGroup(arr.map((p) => L.marker(off(p[0], p[1]), { icon: dot(color, size) })));

  const layers: Record<string, L.Layer> = {
    detect: L.layerGroup([
      L.polygon(
        [[1.6, -3.4], [1.7, -1.0], [-0.2, -0.6], [-1.8, -1.4], [-1.7, -3.6]].map((p) => off(p[0], p[1])),
        { color: '#ff4d4f', weight: 1.6, fillColor: '#ff4d4f', fillOpacity: 0.22 },
      ),
    ]),
    reports: pts([[1.1, -2.4], [0.4, -1.2], [-0.6, -2.0], [0.9, 1.4], [-1.2, 0.4]], '#f5d90a', 11),
    events: pts(
      [[1.2, -3.0], [0.9, -2.6], [0.3, -2.9], [-0.4, -2.4], [-1.1, -3.1], [-1.4, -1.9], [-0.2, -0.2], [0.6, 1.2], [-1.2, 2.8], [1.6, 1.4]],
      '#ff5c5c',
      10,
    ),
    infra: L.layerGroup(
      [[0.7, -1.9], [-0.9, 1.0], [1.3, 2.3]].map((p) =>
        L.rectangle([off(p[0] - 0.12, p[1] - 0.12), off(p[0] + 0.12, p[1] + 0.12)], { color: '#f5d90a', weight: 1.5, fillOpacity: 0.3 }),
      ),
    ),
    sabotage: L.layerGroup([
      L.polyline([[2.2, -4.0], [0.4, 0.2], [0.2, 4.0]].map((p) => off(p[0], p[1])), { color: '#3ddc97', weight: 3, dashArray: '8 5' }),
    ]),
    tahak: pts([[1.4, -0.4], [0.2, 0.8], [-1.0, -1.6], [-1.6, 1.8]], '#f5a524', 12),
    heat: L.layerGroup(
      [[0.9, -2.0], [0.2, 0.4], [-1.0, 1.4]].map((p) =>
        L.circle(off(p[0], p[1]), { radius: 130, color: '#5b9bff', fillColor: '#5b9bff', fillOpacity: 0.22, weight: 1 }),
      ),
    ),
    doc: pts([[1.05, -2.45], [0.35, 0.15], [-1.15, 2.75]], '#9ec3ff', 12),
    targets: pts([[1.5, -1.2], [0.7, 1.9], [-0.5, 2.9], [-1.5, -1.0]], '#a78bfa', 11),
    capture: L.layerGroup([
      L.polygon([[1.4, 1.9], [1.5, 3.6], [-0.6, 3.5], [-0.3, 1.7]].map((p) => off(p[0], p[1])), { color: '#22d3ee', weight: 1.8, fillColor: '#22d3ee', fillOpacity: 0.18 }),
    ]),
    history: pts([[1.3, -2.8], [0.8, -1.4], [0.1, -0.4], [-0.7, 0.9], [-1.4, 2.2], [1.0, 2.6]], '#e7edf7', 8),
    aman: pts([[-0.3, -2.2], [-1.3, -0.2], [0.5, -0.3]], '#a78bfa', 13),
  };
  void map;
  return layers;
}

function buildBaseLayers(map: L.Map) {
  const poly = (pts: [number, number][], color: string, fill?: string) =>
    L.polygon(pts.map((p) => off(p[0], p[1])), { color, weight: 1.5, fillColor: fill || color, fillOpacity: fill ? 0.3 : 0 }).addTo(map);
  const line = (pts: [number, number][], opts: L.PolylineOptions) => L.polyline(pts.map((p) => off(p[0], p[1])), opts).addTo(map);

  poly([[1.6, -3.4], [1.7, -1.0], [-0.2, -0.6], [-1.8, -1.4], [-1.7, -3.6]], '#e5484d', '#e5484d');
  poly([[-0.1, -0.6], [-0.3, 1.7], [-1.9, 1.6], [-1.8, -1.4]], '#3fd0d4', '#3fd0d4');
  poly([[1.5, -0.9], [1.4, 1.9], [-0.3, 1.7], [-0.2, -0.6]], '#30a46c');
  poly([[1.4, 1.9], [1.5, 3.6], [-0.6, 3.5], [-0.3, 1.7]], '#30a46c');
  line([[2.2, -4.0], [0.4, 0.2], [0.2, 4.0]], { color: '#0b0d12', weight: 3 });
  line([[2.4, 3.0], [0.1, 3.2], [-2.0, 2.6]], { color: '#5b9bff', weight: 2, dashArray: '6 4' });
  line([[2.5, 3.3], [0.2, 3.5], [-2.0, 2.9]], { color: '#e5484d', weight: 2 });
  L.circle(off(0.9, -2.0), { radius: 90, color: '#ffb224', fillColor: '#e0c08a', fillOpacity: 0.4, weight: 1.5 }).addTo(map);

  const xIcon = L.divIcon({ className: '', html: '<div class="opsmap-xmark">&#10005;</div>', iconSize: [16, 16] });
  ([[1.2, -3.0], [0.9, -2.6], [0.3, -2.9], [-0.4, -2.4], [-1.1, -3.1], [-1.4, -1.9], [-0.9, -0.9], [-0.2, -0.2], [0.5, -0.3], [1.0, 0.6], [0.6, 1.2], [-0.1, 1.1], [-0.8, 0.6], [-1.5, 1.2], [1.2, 2.2], [0.4, 2.6], [-0.3, 2.2], [-1.2, 2.8], [1.6, 1.4], [-1.7, -0.4]] as [number, number][])
    .forEach((p) => L.marker(off(p[0], p[1]), { icon: xIcon }).addTo(map));

  (
    [
      ['A/1/C', 0.8, -1.6],
      ['934/C', 1.1, -2.4],
      ['E19', -0.5, -2.2],
      ['A/2/E', -1.3, -0.2],
      ['931/A', 0.7, 1.9],
      ['A/4/B', 1.3, 2.5],
      ['A/1/F', -0.6, 2.9],
      ['50/A/1', -1.5, -1.0],
    ] as [string, number, number][]
  ).forEach(([t, dy, dx]) =>
    L.marker(off(dy, dx), { icon: L.divIcon({ className: '', html: `<div class="opsmap-tag">${t}</div>`, iconSize: [46, 12] }) }).addTo(map),
  );
}

const MapView = forwardRef<MapViewHandle, MapViewProps>(function MapView({ layers, mapRight }, ref) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupsRef = useRef<Record<string, L.Layer> | null>(null);
  const pinRef = useRef<L.CircleMarker | null>(null);

  useImperativeHandle(ref, () => ({
    jumpTo(coord: string) {
      const map = mapRef.current;
      if (!map || !coord) return;
      const parts = coord.split(',').map((s) => parseFloat(s)) as [number, number];
      if (parts.length !== 2 || Number.isNaN(parts[0])) return;
      map.setView(parts, 17, { animate: true });
      if (pinRef.current) map.removeLayer(pinRef.current);
      pinRef.current = L.circleMarker(parts, { radius: 9, color: '#ff4d4f', weight: 2, fillColor: '#ff4d4f', fillOpacity: 0.5 }).addTo(map);
    },
  }));

  useEffect(() => {
    if (!elRef.current || mapRef.current) return;
    const map = L.map(elRef.current, { zoomControl: false }).setView(CENTER, 16);
    L.control.zoom({ position: 'topright' }).addTo(map);

    const esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Esri World Imagery',
    });
    // A single stray tile (an edge tile at the view boundary, a transient
    // network hiccup) fires 'tileerror' too and must not nuke the whole
    // aerial layer — only fall back once errors pile up across many tiles,
    // and remove Esri when we do so the street map never sits stacked on
    // top of a still-mostly-working aerial layer.
    let errorCount = 0;
    let fellBack = false;
    esri.on('tileerror', () => {
      errorCount += 1;
      if (fellBack || errorCount < 6) return;
      fellBack = true;
      map.removeLayer(esri);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: 'OpenStreetMap' }).addTo(map);
    });
    esri.on('tileload', () => {
      errorCount = 0;
    });
    esri.addTo(map);

    buildBaseLayers(map);

    mapRef.current = map;
    layerGroupsRef.current = buildLayerGroups(map);
    Object.entries(layerGroupsRef.current).forEach(([key, lg]) => {
      if (layers[key]) lg.addTo(map);
    });

    const ro = new ResizeObserver(() => map.invalidateSize({ pan: false, animate: false }));
    ro.observe(elRef.current);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      layerGroupsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const groups = layerGroupsRef.current;
    if (!map || !groups) return;
    Object.entries(groups).forEach(([key, lg]) => {
      const want = !!layers[key];
      const has = map.hasLayer(lg);
      if (want && !has) lg.addTo(map);
      if (!want && has) map.removeLayer(lg);
    });
  }, [layers]);

  useEffect(() => {
    mapRef.current?.invalidateSize({ pan: false, animate: false });
  }, [mapRight]);

  return <div ref={elRef} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: mapRight, zIndex: 0 }} />;
});

export default MapView;
