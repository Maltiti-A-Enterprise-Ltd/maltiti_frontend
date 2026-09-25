'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';
import type { GraphEdge, GraphNode, StatusStyle, TruthStatus } from './types';

export interface MapHandle {
  focusNode: (id: string) => void;
  fit: () => void;
  zoomBy: (factor: number) => void;
}

interface Map2DProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  statusStyle: Record<TruthStatus, StatusStyle>;
  selectedId: string | null;
  hoveredId: string | null;
  showLabels: boolean;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
}

const MIN_SCALE = 0.08;
const MAX_SCALE = 6;
const BACKGROUND = '#0a0f16';

const nodeRadius = (node: GraphNode): number => 4.5 + Math.sqrt(node.degree) * 2.5;

function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Canvas map with drag-to-pan and scroll-to-zoom.
 *
 * Positions are precomputed by the knowledge model build, so there is no physics simulation
 * here: the map is identical every time it loads, which is what lets people build spatial
 * memory of where the shea chain or the market side lives.
 *
 * The render loop only runs while something is actually moving. Once the camera settles it
 * stops, so an idle map costs nothing.
 */
export const Map2D = forwardRef<MapHandle, Map2DProps>(function Map2D(
  { nodes, edges, statusStyle, selectedId, hoveredId, showLabels, onSelect, onHover },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /* Camera: world coordinate sitting at the centre of the viewport, plus a zoom scale.
     `target` is where it is heading; `current` is where it is now. */
  const camera = useRef({ x: 0, y: 0, scale: 0.6 });
  const target = useRef({ x: 0, y: 0, scale: 0.6 });
  const size = useRef({ width: 0, height: 0, dpr: 1 });
  const frame = useRef<number | null>(null);
  const dragging = useRef<{ active: boolean; moved: boolean; x: number; y: number }>({
    active: false,
    moved: false,
    x: 0,
    y: 0,
  });
  const pinch = useRef<{ distance: number; scale: number } | null>(null);

  /* Latest props, read inside the render loop and event handlers without having to
     re-subscribe listeners on every change. Synced in a layout effect rather than during
     render: writing to a ref while rendering is unsafe under concurrent rendering. */
  const state = useRef({ nodes, edges, selectedId, hoveredId, showLabels, statusStyle });
  const nodeIndex = useRef(new Map<string, GraphNode>(nodes.map((n) => [n.id, n])));
  useLayoutEffect(() => {
    state.current = { nodes, edges, selectedId, hoveredId, showLabels, statusStyle };
    nodeIndex.current = new Map(nodes.map((n) => [n.id, n]));
  });

  /* Neighbours of whatever is focused, so the rest can be faded back. */
  const neighbours = useRef(new Set<string>());
  const focusId = hoveredId ?? selectedId;
  useLayoutEffect(() => {
    const next = new Set<string>();
    if (focusId) {
      next.add(focusId);
      for (const edge of edges) {
        if (edge.source === focusId) {
          next.add(edge.target);
        }
        if (edge.target === focusId) {
          next.add(edge.source);
        }
      }
    }
    neighbours.current = next;
  }, [focusId, edges]);

  const requestRender = useCallback(() => {
    if (frame.current !== null) {
      return;
    }
    frame.current = requestAnimationFrame(function step() {
      frame.current = null;
      const cam = camera.current;
      const tgt = target.current;
      const dx = tgt.x - cam.x;
      const dy = tgt.y - cam.y;
      const ds = tgt.scale - cam.scale;
      const moving = Math.abs(dx) > 0.15 || Math.abs(dy) > 0.15 || Math.abs(ds) > 0.0004;
      if (moving) {
        cam.x += dx * 0.18;
        cam.y += dy * 0.18;
        cam.scale += ds * 0.18;
      } else {
        cam.x = tgt.x;
        cam.y = tgt.y;
        cam.scale = tgt.scale;
      }
      draw();
      if (moving) {
        requestRender();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      return;
    }

    const { width, height, dpr } = size.current;
    const cam = camera.current;
    const {
      nodes: ns,
      edges: es,
      selectedId: sel,
      hoveredId: hov,
      showLabels: labels,
      statusStyle: styles,
    } = state.current;
    const focus = hov ?? sel;
    const near = neighbours.current;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, width, height);

    /* Subtle grid so panning feels anchored rather than floating in nothing. */
    const gridStep = 120 * cam.scale;
    if (gridStep > 22) {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      const originX = width / 2 - cam.x * cam.scale;
      const originY = height / 2 - cam.y * cam.scale;
      for (let x = originX % gridStep; x < width; x += gridStep) {
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, height);
      }
      for (let y = originY % gridStep; y < height; y += gridStep) {
        ctx.moveTo(0, Math.round(y) + 0.5);
        ctx.lineTo(width, Math.round(y) + 0.5);
      }
      ctx.stroke();
    }

    const toScreenX = (wx: number): number => width / 2 + (wx - cam.x) * cam.scale;
    const toScreenY = (wy: number): number => height / 2 + (wy - cam.y) * cam.scale;

    /* ---- edges ---- */
    for (const edge of es) {
      const a = nodeIndex.current.get(edge.source);
      const b = nodeIndex.current.get(edge.target);
      if (!a || !b) {
        continue;
      }

      const related = !focus || (near.has(edge.source) && near.has(edge.target));
      const style = styles[edge.status];
      const baseAlpha = (style?.dim ?? 0.8) * 0.5;
      const alpha = focus ? (related ? Math.min(1, baseAlpha * 2.1) : baseAlpha * 0.16) : baseAlpha;

      const x1 = toScreenX(a.x);
      const y1 = toScreenY(a.y);
      const x2 = toScreenX(b.x);
      const y2 = toScreenY(b.y);

      ctx.save();
      ctx.strokeStyle =
        edge.status === 'DISPUTED'
          ? `rgba(255, 90, 90, ${alpha})`
          : `rgba(148, 176, 205, ${alpha})`;
      ctx.lineWidth = related && focus ? 1.8 : 1.1;
      ctx.setLineDash(style?.dash ? [5, 4] : []);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();

      /* Arrowhead, only when there is room for it to read as one. */
      if (cam.scale > 0.35) {
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const back = nodeRadius(b) * cam.scale + 3;
        const tipX = x2 - Math.cos(angle) * back;
        const tipY = y2 - Math.sin(angle) * back;
        const head = 6;
        ctx.fillStyle =
          edge.status === 'DISPUTED'
            ? `rgba(255, 90, 90, ${alpha})`
            : `rgba(148, 176, 205, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(tipX - Math.cos(angle - 0.4) * head, tipY - Math.sin(angle - 0.4) * head);
        ctx.lineTo(tipX - Math.cos(angle + 0.4) * head, tipY - Math.sin(angle + 0.4) * head);
        ctx.closePath();
        ctx.fill();
      }

      /* Edge labels only at close zoom on the focused neighbourhood — otherwise they are noise. */
      if (focus && related && cam.scale > 0.75) {
        const text = edge.label ?? edge.type.toLowerCase().replace(/_/g, ' ');
        ctx.save();
        ctx.font = '10px ui-sans-serif, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(203, 213, 225, 0.85)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        const metrics = ctx.measureText(text);
        ctx.fillStyle = 'rgba(10, 15, 22, 0.8)';
        ctx.fillRect(mx - metrics.width / 2 - 3, my - 7, metrics.width + 6, 14);
        ctx.fillStyle = 'rgba(203, 213, 225, 0.9)';
        ctx.fillText(text, mx, my);
        ctx.restore();
      }
    }

    /* ---- nodes ---- */
    const drawnLabels: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const sorted = [...ns].sort((p, q) => p.degree - q.degree);

    for (const node of sorted) {
      const style = styles[node.status];
      const isFocus = node.id === focus;
      const related = !focus || near.has(node.id);
      const alpha = (style?.dim ?? 0.9) * (related ? 1 : 0.14);

      const sx = toScreenX(node.x);
      const sy = toScreenY(node.y);
      const r = nodeRadius(node) * Math.max(0.55, Math.min(1.6, cam.scale));
      if (sx < -80 || sy < -80 || sx > width + 80 || sy > height + 80) {
        continue;
      }

      /* Selection glow */
      if (node.id === sel) {
        ctx.beginPath();
        ctx.arc(sx, sy, r + 11, 0, Math.PI * 2);
        ctx.fillStyle = withAlpha(node.color, 0.16);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fillStyle = withAlpha(node.color, alpha);
      ctx.fill();

      /* Dashed outline marks anything not solidly established. */
      ctx.save();
      ctx.setLineDash(style?.dash ? [3, 3] : []);
      ctx.lineWidth = node.status === 'CONFIRMED' ? 2 : 1.2;
      ctx.strokeStyle =
        node.status === 'CONFIRMED'
          ? withAlpha('#ffffff', alpha * 0.85)
          : withAlpha('#cbd5e1', alpha * 0.55);
      ctx.stroke();
      ctx.restore();

      /* Provisional: an outer dashed ring. It is a bet, not a fact, and must look like one. */
      if (node.provisional) {
        ctx.save();
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.arc(sx, sy, r + 4.5, 0, Math.PI * 2);
        ctx.strokeStyle = withAlpha('#fbbf24', alpha * 0.8);
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }
      /* Class placeholder: a second concentric ring, suggesting "many of these". */
      if (node.granularity === 'class') {
        ctx.beginPath();
        ctx.arc(sx, sy, r + 2.2, 0, Math.PI * 2);
        ctx.strokeStyle = withAlpha(node.color, alpha * 0.45);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      if (style?.ring) {
        ctx.beginPath();
        ctx.arc(sx, sy, r + 6, 0, Math.PI * 2);
        ctx.strokeStyle = style.ring;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      /* ---- labels, with semantic zoom and overlap culling ---- */
      const important =
        isFocus ||
        node.id === sel ||
        (focus ? near.has(node.id) : false) ||
        cam.scale > 0.95 ||
        (cam.scale > 0.5 && node.degree >= 6) ||
        node.degree >= 12;
      if (!labels || !important) {
        continue;
      }

      const marker = style?.marker ? ` ${style.marker}` : '';
      const text = `${node.label}${marker}${node.provisional ? ' *' : ''}`;
      const clipped = text.length > 42 ? `${text.slice(0, 40)}…` : text;
      ctx.font = `${isFocus || node.id === sel ? '600 ' : ''}11.5px ui-sans-serif, system-ui, sans-serif`;
      const metrics = ctx.measureText(clipped);
      const lx = sx + r + 6;
      const ly = sy;
      const box = { x1: lx - 2, y1: ly - 8, x2: lx + metrics.width + 4, y2: ly + 8 };

      const collides = drawnLabels.some(
        (d) => !(box.x2 < d.x1 || box.x1 > d.x2 || box.y2 < d.y1 || box.y1 > d.y2),
      );
      if (collides && !isFocus && node.id !== sel) {
        continue;
      }
      drawnLabels.push(box);

      ctx.fillStyle = `rgba(10, 15, 22, ${related ? 0.72 : 0.25})`;
      ctx.fillRect(box.x1, box.y1, box.x2 - box.x1, box.y2 - box.y1);
      ctx.fillStyle =
        node.id === sel
          ? '#ffffff'
          : related
            ? 'rgba(226, 232, 240, 0.94)'
            : 'rgba(226, 232, 240, 0.25)';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(clipped, lx, ly);
    }
  }, []);

  const fit = useCallback(() => {
    const ns = state.current.nodes;
    const { width, height } = size.current;
    if (!ns.length || !width) {
      return;
    }
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const n of ns) {
      if (n.x < minX) {
        minX = n.x;
      }
      if (n.x > maxX) {
        maxX = n.x;
      }
      if (n.y < minY) {
        minY = n.y;
      }
      if (n.y > maxY) {
        maxY = n.y;
      }
    }
    const spanX = Math.max(maxX - minX, 1);
    const spanY = Math.max(maxY - minY, 1);
    const scale = Math.min((width - 160) / spanX, (height - 140) / spanY);
    target.current = {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
      scale: Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale)),
    };
    requestRender();
  }, [requestRender]);

  useImperativeHandle(
    ref,
    () => ({
      focusNode: (id: string): void => {
        const node = nodeIndex.current.get(id);
        if (!node) {
          return;
        }
        target.current = {
          x: node.x,
          y: node.y,
          scale: Math.max(target.current.scale, 1.15),
        };
        requestRender();
      },
      fit,
      zoomBy: (factor: number): void => {
        target.current = {
          ...target.current,
          scale: Math.max(MIN_SCALE, Math.min(MAX_SCALE, target.current.scale * factor)),
        };
        requestRender();
      },
    }),
    [fit, requestRender],
  );

  const hitTest = useCallback((clientX: number, clientY: number): GraphNode | null => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return null;
    }
    const rect = canvas.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    const { width, height } = size.current;
    const cam = camera.current;

    let best: GraphNode | null = null;
    let bestDistance = Infinity;
    for (const node of state.current.nodes) {
      const sx = width / 2 + (node.x - cam.x) * cam.scale;
      const sy = height / 2 + (node.y - cam.y) * cam.scale;
      const r = nodeRadius(node) * Math.max(0.55, Math.min(1.6, cam.scale)) + 5;
      const dx = sx - px;
      const dy = sy - py;
      const distance = dx * dx + dy * dy;
      if (distance <= r * r && distance < bestDistance) {
        best = node;
        bestDistance = distance;
      }
    }
    return best;
  }, []);

  /* ---- sizing ---- */
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) {
      return;
    }

    const resize = (): void => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.current = { width: rect.width, height: rect.height, dpr };
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      requestRender();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return (): void => observer.disconnect();
  }, [requestRender]);

  /* Fit once the first set of nodes arrives. */
  const fitted = useRef(false);
  useEffect(() => {
    if (fitted.current || !nodes.length || !size.current.width) {
      return;
    }
    fitted.current = true;
    camera.current.scale = 0.15;
    fit();
  }, [nodes, fit]);

  useEffect(() => {
    requestRender();
  }, [nodes, edges, selectedId, hoveredId, showLabels, requestRender]);

  /* ---- pointer and wheel ---- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const onPointerDown = (event: PointerEvent): void => {
      canvas.setPointerCapture(event.pointerId);
      dragging.current = { active: true, moved: false, x: event.clientX, y: event.clientY };
    };

    const onPointerMove = (event: PointerEvent): void => {
      if (dragging.current.active) {
        const dx = event.clientX - dragging.current.x;
        const dy = event.clientY - dragging.current.y;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
          dragging.current.moved = true;
        }
        dragging.current.x = event.clientX;
        dragging.current.y = event.clientY;
        const scale = camera.current.scale;
        camera.current.x -= dx / scale;
        camera.current.y -= dy / scale;
        target.current.x = camera.current.x;
        target.current.y = camera.current.y;
        requestRender();
        return;
      }
      const hit = hitTest(event.clientX, event.clientY);
      canvas.style.cursor = hit ? 'pointer' : 'grab';
      if ((hit?.id ?? null) !== state.current.hoveredId) {
        onHover(hit?.id ?? null);
      }
    };

    const onPointerUp = (event: PointerEvent): void => {
      const wasDragging = dragging.current.active && dragging.current.moved;
      dragging.current.active = false;
      if (wasDragging) {
        return;
      }
      const hit = hitTest(event.clientX, event.clientY);
      onSelect(hit?.id ?? null);
    };

    const onWheel = (event: WheelEvent): void => {
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      const { width, height } = size.current;
      const cam = camera.current;

      const worldX = cam.x + (px - width / 2) / cam.scale;
      const worldY = cam.y + (py - height / 2) / cam.scale;

      const factor = Math.exp(-event.deltaY * 0.0016);
      const nextScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, cam.scale * factor));

      cam.scale = nextScale;
      cam.x = worldX - (px - width / 2) / nextScale;
      cam.y = worldY - (py - height / 2) / nextScale;
      target.current = { ...cam };
      requestRender();
    };

    const onTouchStart = (event: TouchEvent): void => {
      if (event.touches.length !== 2) {
        return;
      }
      const [a, b] = [event.touches[0], event.touches[1]];
      pinch.current = {
        distance: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
        scale: camera.current.scale,
      };
    };

    const onTouchMove = (event: TouchEvent): void => {
      if (event.touches.length !== 2 || !pinch.current) {
        return;
      }
      event.preventDefault();
      const [a, b] = [event.touches[0], event.touches[1]];
      const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const next = Math.max(
        MIN_SCALE,
        Math.min(MAX_SCALE, pinch.current.scale * (distance / pinch.current.distance)),
      );
      camera.current.scale = next;
      target.current.scale = next;
      requestRender();
    };

    const onTouchEnd = (): void => {
      pinch.current = null;
    };

    const onDoubleClick = (): void => {
      onSelect(null);
      fit();
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', () => onHover(null));
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('dblclick', onDoubleClick);

    return (): void => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('dblclick', onDoubleClick);
    };
  }, [fit, hitTest, onHover, onSelect, requestRender]);

  return (
    /* data-lenis-prevent stops the site-wide smooth scroll from swallowing zoom gestures. */
    <div ref={containerRef} className="absolute inset-0" data-lenis-prevent>
      <canvas ref={canvasRef} className="block h-full w-full touch-none" />
    </div>
  );
});
