'use client';

import { JSX, Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertTriangle } from 'lucide-react';
import { MapToolbar } from './map-toolbar';
import { Map2D, type MapHandle } from './map-2d';
import { Legend } from './legend';
import { DetailPanel } from './detail-panel';
import type { EcosystemGraph, GraphNode, TruthStatus } from './types';

/* three.js is only pulled down if someone actually switches to 3D. React.lazy is used rather
   than next/dynamic because the map components expose an imperative handle via forwardRef. */
const Map3D = lazy(() => import('./map-3d').then((module) => ({ default: module.Map3D })));

interface EcosystemExplorerProps {
  /** True when the map sits behind the shared-password gate. Controls the sign-out affordance. */
  requiresAuth: boolean;
}

export function EcosystemExplorer({ requiresAuth }: EcosystemExplorerProps): JSX.Element {
  const router = useRouter();
  const mapRef = useRef<MapHandle | null>(null);

  const [graph, setGraph] = useState<EcosystemGraph | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'2d' | '3d'>('2d');
  const [viewId, setViewId] = useState('VIEW-01-EXECUTIVE');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [hiddenTypes, setHiddenTypes] = useState<Set<string>>(new Set());
  const [hiddenStatuses, setHiddenStatuses] = useState<Set<TruthStatus>>(new Set());

  useEffect(() => {
    let cancelled = false;
    void (async (): Promise<void> => {
      try {
        const response = await fetch('/ecosystem/api/graph', { credentials: 'same-origin' });
        if (response.status === 401) {
          router.replace('/ecosystem/login');
          return;
        }
        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }
        const data = (await response.json()) as EcosystemGraph;
        if (!cancelled) {
          setGraph(data);
        }
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : 'Could not load the ecosystem model.');
        }
      }
    })();
    return (): void => {
      cancelled = true;
    };
  }, [router]);

  /* ---- derived slices ---- */
  const preset = useMemo(
    () => (viewId === 'ALL' ? null : (graph?.views.find((v) => v.id === viewId) ?? null)),
    [graph, viewId],
  );

  const visibleNodes = useMemo(() => {
    if (!graph) {
      return [];
    }
    const allowed = preset ? new Set(preset.nodeIds) : null;
    return graph.nodes.filter(
      (node) =>
        (!allowed || allowed.has(node.id)) &&
        !hiddenTypes.has(node.type) &&
        !hiddenStatuses.has(node.status),
    );
  }, [graph, preset, hiddenTypes, hiddenStatuses]);

  const visibleEdges = useMemo(() => {
    if (!graph) {
      return [];
    }
    const ids = new Set(visibleNodes.map((n) => n.id));
    const allowedTypes = preset?.relationshipTypes.length
      ? new Set(preset.relationshipTypes)
      : null;
    return graph.edges.filter(
      (edge) =>
        ids.has(edge.source) &&
        ids.has(edge.target) &&
        (!allowedTypes || allowedTypes.has(edge.type)),
    );
  }, [graph, visibleNodes, preset]);

  const typeCounts = useMemo(() => {
    if (!graph) {
      return [];
    }
    const counts = new Map<string, number>();
    for (const node of graph.nodes) {
      counts.set(node.type, (counts.get(node.type) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }, [graph]);

  const statusCounts = useMemo(() => {
    if (!graph) {
      return [];
    }
    const counts = new Map<TruthStatus, number>();
    for (const node of graph.nodes) {
      counts.set(node.status, (counts.get(node.status) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);
  }, [graph]);

  const searchResults = useMemo(() => {
    if (!graph) {
      return [];
    }
    const query = search.trim().toLowerCase();
    if (!query) {
      return [];
    }
    return graph.nodes
      .filter(
        (node) =>
          node.label.toLowerCase().includes(query) ||
          node.id.toLowerCase().includes(query) ||
          node.aliases.some((alias) => alias.toLowerCase().includes(query)) ||
          node.tags.some((tag) => tag.includes(query)),
      )
      .slice(0, 12);
  }, [graph, search]);

  const selectedNode: GraphNode | null = useMemo(
    () => graph?.nodes.find((n) => n.id === selectedId) ?? null,
    [graph, selectedId],
  );

  /* ---- actions ---- */
  const revealAndFocus = useCallback(
    (id: string) => {
      const visible = visibleNodes.some((n) => n.id === id);
      if (!visible) {
        /* The entity exists but is filtered out. Widen the view rather than silently doing
           nothing, which would look like the search was broken. */
        setViewId('ALL');
        setHiddenTypes(new Set());
        setHiddenStatuses(new Set());
      }
      setSelectedId(id);
      setSearch('');
      window.setTimeout(() => mapRef.current?.focusNode(id), visible ? 0 : 80);
    },
    [visibleNodes],
  );

  const signOut = useCallback(async () => {
    await fetch('/ecosystem/api/session', { method: 'DELETE' });
    router.replace('/ecosystem/login');
  }, [router]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return (): void => window.removeEventListener('keydown', onKey);
  }, []);

  /* ---- states ---- */
  if (error) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-950 p-8">
        <div className="max-w-md text-center">
          <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-amber-400" />
          <h1 className="mb-1 text-base font-semibold text-slate-100">
            Could not load the ecosystem model
          </h1>
          <p className="text-sm text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!graph) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-950">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading the ecosystem model…
        </div>
      </div>
    );
  }

  const softCount =
    (graph.stats.entityStatus.INFERRED ?? 0) +
    (graph.stats.entityStatus.UNVERIFIED ?? 0) +
    (graph.stats.entityStatus.UNKNOWN ?? 0);
  const softShare = Math.round((softCount / graph.stats.entities) * 100);

  return (
    <div className="flex h-full flex-col bg-slate-950">
      <MapToolbar
        graph={graph}
        mode={mode}
        onModeChange={setMode}
        viewId={viewId}
        onViewChange={(id) => {
          setViewId(id);
          window.setTimeout(() => mapRef.current?.fit(), 60);
        }}
        search={search}
        onSearchChange={setSearch}
        searchResults={searchResults}
        onPickResult={revealAndFocus}
        types={typeCounts}
        hiddenTypes={hiddenTypes}
        onToggleType={(type) =>
          setHiddenTypes((previous) => {
            const next = new Set(previous);
            if (next.has(type)) {
              next.delete(type);
            } else {
              next.add(type);
            }
            return next;
          })
        }
        statuses={statusCounts}
        hiddenStatuses={hiddenStatuses}
        onToggleStatus={(status) =>
          setHiddenStatuses((previous) => {
            const next = new Set(previous);
            if (next.has(status)) {
              next.delete(status);
            } else {
              next.add(status);
            }
            return next;
          })
        }
        showLabels={showLabels}
        onToggleLabels={() => setShowLabels((value) => !value)}
        onZoomIn={() => mapRef.current?.zoomBy(1.3)}
        onZoomOut={() => mapRef.current?.zoomBy(1 / 1.3)}
        onFit={() => mapRef.current?.fit()}
        onResetFilters={() => {
          setHiddenTypes(new Set());
          setHiddenStatuses(new Set());
        }}
        showSignOut={requiresAuth}
        onSignOut={() => void signOut()}
      />

      {preset && (
        <p className="border-b border-slate-800 bg-slate-900/60 px-3 py-1.5 text-[11.5px] leading-relaxed text-slate-400">
          <span className="font-medium text-slate-300">{preset.title}</span> · {preset.description}
        </p>
      )}

      <div className="relative flex min-h-0 flex-1">
        <div className="relative min-w-0 flex-1">
          {mode === '2d' ? (
            <Map2D
              ref={mapRef}
              nodes={visibleNodes}
              edges={visibleEdges}
              statusStyle={graph.meta.statusStyle}
              selectedId={selectedId}
              hoveredId={hoveredId}
              showLabels={showLabels}
              onSelect={setSelectedId}
              onHover={setHoveredId}
            />
          ) : (
            <Suspense
              fallback={
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading 3D view…
                  </div>
                </div>
              }
            >
              <Map3D
                ref={mapRef}
                nodes={visibleNodes}
                edges={visibleEdges}
                statusStyle={graph.meta.statusStyle}
                selectedId={selectedId}
                hoveredId={hoveredId}
                showLabels={showLabels}
                onSelect={setSelectedId}
                onHover={setHoveredId}
              />
            </Suspense>
          )}

          <div className="pointer-events-none absolute bottom-3 left-3 z-10">
            <Legend graph={graph} visibleTypes={[...new Set(visibleNodes.map((n) => n.type))]} />
          </div>

          <p className="pointer-events-none absolute top-3 right-3 z-10 rounded border border-slate-800 bg-slate-950/80 px-2 py-1 text-[10.5px] text-slate-500 backdrop-blur-sm">
            {mode === '2d'
              ? 'Drag to pan · scroll to zoom · click a node'
              : 'Drag to orbit · scroll to zoom · click a node'}
          </p>
        </div>

        {selectedNode && (
          <div className="absolute inset-y-0 right-0 z-20 w-full max-w-[380px] sm:relative sm:w-[380px]">
            <DetailPanel
              graph={graph}
              node={selectedNode}
              onClose={() => setSelectedId(null)}
              onNavigate={revealAndFocus}
            />
          </div>
        )}
      </div>

      <footer className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-800 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-500">
        <span>
          <span className="text-slate-300">{visibleNodes.length}</span> of {graph.stats.entities}{' '}
          entities · <span className="text-slate-300">{visibleEdges.length}</span> relationships
        </span>
        <span>mean confidence {graph.stats.meanEntityConfidence.toFixed(2)}</span>
        <span className="text-amber-400/80">{softShare}% inferred, unverified or unknown</span>
        <span>{graph.stats.provisional} provisional</span>
        <span>{graph.stats.openGaps} open gaps</span>
        <span className="ml-auto">
          model generated {new Date(graph.generated).toISOString().slice(0, 10)} · read-only
        </span>
      </footer>
    </div>
  );
}
