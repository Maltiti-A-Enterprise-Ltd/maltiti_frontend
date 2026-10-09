'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { MapHandle } from './map-2d';
import type { GraphEdge, GraphNode, StatusStyle, TruthStatus } from './types';

interface Map3DProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  statusStyle: Record<TruthStatus, StatusStyle>;
  selectedId: string | null;
  hoveredId: string | null;
  showLabels: boolean;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
}

const BACKGROUND = 0x0a0f16;
const nodeScale = (node: GraphNode): number => 3 + Math.sqrt(node.degree) * 1.9;

/**
 * Three.js view of the same graph, using the 3D coordinates precomputed by the model build.
 *
 * 3D is genuinely harder to read than 2D — nodes occlude each other and labels compete — so
 * this view leans on restraint: labels appear only for what you are pointing at or have
 * selected, and everything unrelated to the current focus fades back. Depth fog does the work
 * of telling you what is near.
 *
 * Loaded lazily, so the 2D path never pays for three.js.
 */
export const Map3D = forwardRef<MapHandle, Map3DProps>(function Map3D(
  { nodes, edges, statusStyle, selectedId, hoveredId, showLabels, onSelect, onHover },
  ref,
) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);

  const three = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    instances: THREE.InstancedMesh | null;
    lines: THREE.LineSegments | null;
    raycaster: THREE.Raycaster;
    pointer: THREE.Vector2;
    order: GraphNode[];
    frame: number | null;
    flyTo: THREE.Vector3 | null;
  } | null>(null);

  /* Synced in a layout effect, not during render: writing a ref while rendering is unsafe
     under concurrent rendering. The animation loop reads this every frame. */
  const state = useRef({ nodes, edges, selectedId, hoveredId, showLabels, statusStyle });
  useLayoutEffect(() => {
    state.current = { nodes, edges, selectedId, hoveredId, showLabels, statusStyle };
  });

  const neighbours = useRef(new Set<string>());
  const focusId = hoveredId ?? selectedId;
  useEffect(() => {
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

  /** Repaint instance colours to reflect the current focus. Cheap; no geometry rebuild. */
  const paint = useCallback(() => {
    const ctx = three.current;
    if (!ctx?.instances) {
      return;
    }
    const { selectedId: sel, hoveredId: hov, statusStyle: styles } = state.current;
    const focus = hov ?? sel;
    const near = neighbours.current;
    const colour = new THREE.Color();

    ctx.order.forEach((node, i) => {
      const dim = styles[node.status]?.dim ?? 0.9;
      const related = !focus || near.has(node.id);
      colour.set(node.color);
      if (node.id === sel) {
        colour.lerp(new THREE.Color(0xffffff), 0.45);
      } else {
        const factor = dim * (related ? 1 : 0.16);
        colour.multiplyScalar(Math.max(0.08, factor));
      }
      ctx.instances?.setColorAt(i, colour);
    });
    if (ctx.instances.instanceColor) {
      ctx.instances.instanceColor.needsUpdate = true;
    }

    /* Fade edges the same way so the focused neighbourhood stands out. */
    if (ctx.lines) {
      const geometry = ctx.lines.geometry;
      const colours = geometry.getAttribute('color') as THREE.BufferAttribute | undefined;
      if (colours) {
        const { edges: es } = state.current;
        es.forEach((edge, i) => {
          const related = !focus || (near.has(edge.source) && near.has(edge.target));
          const base = edge.status === 'DISPUTED' ? [1, 0.35, 0.35] : [0.58, 0.69, 0.8];
          const k = focus ? (related ? 1 : 0.08) : 0.5;
          for (let v = 0; v < 2; v += 1) {
            colours.setXYZ(i * 2 + v, base[0] * k, base[1] * k, base[2] * k);
          }
        });
        colours.needsUpdate = true;
      }
    }
  }, []);

  /* ---- one-time scene setup ---- */
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return;
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BACKGROUND);
    scene.fog = new THREE.Fog(BACKGROUND, 900, 2600);

    const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 1, 6000);
    camera.position.set(0, 220, 1250);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.rotateSpeed = 0.55;
    controls.zoomSpeed = 0.8;
    controls.minDistance = 90;
    controls.maxDistance = 3200;

    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(400, 700, 600);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x6ba8ff, 0.7);
    rim.position.set(-600, -300, -500);
    scene.add(rim);

    three.current = {
      renderer,
      scene,
      camera,
      controls,
      instances: null,
      lines: null,
      raycaster: new THREE.Raycaster(),
      pointer: new THREE.Vector2(-10, -10),
      order: [],
      frame: null,
      flyTo: null,
    };

    const project = new THREE.Vector3();
    const animate = (): void => {
      const ctx = three.current;
      if (!ctx) {
        return;
      }
      ctx.frame = requestAnimationFrame(animate);

      if (ctx.flyTo) {
        ctx.controls.target.lerp(ctx.flyTo, 0.12);
        if (ctx.controls.target.distanceTo(ctx.flyTo) < 1) {
          ctx.flyTo = null;
        }
      }
      ctx.controls.update();
      ctx.renderer.render(ctx.scene, ctx.camera);

      /* Position the floating label over whatever is focused. */
      const label = labelRef.current;
      if (label) {
        const {
          selectedId: sel,
          hoveredId: hov,
          showLabels: show,
          statusStyle: styles,
        } = state.current;
        const id = hov ?? sel;
        const node = show && id ? ctx.order.find((n) => n.id === id) : undefined;
        if (!node) {
          label.style.opacity = '0';
        } else {
          project.set(node.x3, node.y3, node.z3).project(ctx.camera);
          const w = ctx.renderer.domElement.clientWidth;
          const h = ctx.renderer.domElement.clientHeight;
          const x = (project.x * 0.5 + 0.5) * w;
          const y = (-project.y * 0.5 + 0.5) * h;
          const marker = styles[node.status]?.marker;
          label.textContent = `${node.label}${marker ? ` ${marker}` : ''}${node.provisional ? ' *' : ''}`;
          label.style.transform = `translate(-50%, -140%) translate(${x}px, ${y}px)`;
          label.style.opacity = project.z > 1 ? '0' : '1';
        }
      }
    };
    animate();

    const resize = (): void => {
      const ctx = three.current;
      if (!ctx || !mount.clientWidth) {
        return;
      }
      ctx.camera.aspect = mount.clientWidth / mount.clientHeight;
      ctx.camera.updateProjectionMatrix();
      ctx.renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    return (): void => {
      observer.disconnect();
      const ctx = three.current;
      if (ctx?.frame) {
        cancelAnimationFrame(ctx.frame);
      }
      ctx?.controls.dispose();
      ctx?.instances?.geometry.dispose();
      (ctx?.instances?.material as THREE.Material | undefined)?.dispose();
      ctx?.lines?.geometry.dispose();
      (ctx?.lines?.material as THREE.Material | undefined)?.dispose();
      ctx?.renderer.dispose();
      if (ctx?.renderer.domElement.parentNode === mount) {
        mount.removeChild(ctx.renderer.domElement);
      }
      three.current = null;
    };
  }, []);

  /* ---- rebuild geometry whenever the visible slice changes ---- */
  useEffect(() => {
    const ctx = three.current;
    if (!ctx) {
      return;
    }

    if (ctx.instances) {
      ctx.scene.remove(ctx.instances);
      ctx.instances.geometry.dispose();
      (ctx.instances.material as THREE.Material).dispose();
      ctx.instances = null;
    }
    if (ctx.lines) {
      ctx.scene.remove(ctx.lines);
      ctx.lines.geometry.dispose();
      (ctx.lines.material as THREE.Material).dispose();
      ctx.lines = null;
    }
    if (!nodes.length) {
      return;
    }

    const geometry = new THREE.SphereGeometry(1, 20, 14);
    const material = new THREE.MeshStandardMaterial({
      roughness: 0.42,
      metalness: 0.08,
      transparent: true,
      opacity: 0.97,
    });
    const mesh = new THREE.InstancedMesh(geometry, material, nodes.length);
    const matrix = new THREE.Matrix4();
    nodes.forEach((node, i) => {
      const s = nodeScale(node);
      matrix.makeScale(s, s, s);
      matrix.setPosition(node.x3, node.y3, node.z3);
      mesh.setMatrixAt(i, matrix);
      mesh.setColorAt(i, new THREE.Color(node.color));
    });
    mesh.instanceMatrix.needsUpdate = true;
    ctx.scene.add(mesh);
    ctx.instances = mesh;
    ctx.order = nodes;

    const byId = new Map(nodes.map((n) => [n.id, n]));
    const positions = new Float32Array(edges.length * 6);
    const colours = new Float32Array(edges.length * 6);
    edges.forEach((edge, i) => {
      const a = byId.get(edge.source);
      const b = byId.get(edge.target);
      if (!a || !b) {
        return;
      }
      positions.set([a.x3, a.y3, a.z3, b.x3, b.y3, b.z3], i * 6);
      const base = edge.status === 'DISPUTED' ? [1, 0.35, 0.35] : [0.58, 0.69, 0.8];
      colours.set([...base, ...base], i * 6);
    });
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(colours, 3));
    const lines = new THREE.LineSegments(
      lineGeometry,
      new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.55 }),
    );
    ctx.scene.add(lines);
    ctx.lines = lines;

    paint();
  }, [nodes, edges, paint]);

  useEffect(() => {
    paint();
  }, [selectedId, hoveredId, paint]);

  /* ---- picking ---- */
  useEffect(() => {
    const ctx = three.current;
    const canvas = ctx?.renderer.domElement;
    if (!ctx || !canvas) {
      return;
    }

    let moved = false;

    const pick = (event: PointerEvent): GraphNode | null => {
      const rect = canvas.getBoundingClientRect();
      ctx.pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      if (!ctx.instances) {
        return null;
      }
      ctx.raycaster.setFromCamera(ctx.pointer, ctx.camera);
      const hits = ctx.raycaster.intersectObject(ctx.instances, false);
      const first = hits[0];
      if (!first || first.instanceId === undefined) {
        return null;
      }
      return ctx.order[first.instanceId] ?? null;
    };

    const onPointerDown = (): void => {
      moved = false;
    };
    const onPointerMove = (event: PointerEvent): void => {
      moved = true;
      if (event.buttons !== 0) {
        return;
      }
      const hit = pick(event);
      canvas.style.cursor = hit ? 'pointer' : 'grab';
      if ((hit?.id ?? null) !== state.current.hoveredId) {
        onHover(hit?.id ?? null);
      }
    };
    const onPointerUp = (event: PointerEvent): void => {
      if (moved && event.pointerType === 'mouse' && event.button === 0) {
        /* OrbitControls treats drag as rotate; only treat a still click as a selection. */
      }
      const hit = pick(event);
      if (!moved || hit) {
        onSelect(hit?.id ?? null);
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', () => onHover(null));
    return (): void => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
    };
  }, [onHover, onSelect]);

  useImperativeHandle(
    ref,
    () => ({
      focusNode: (id: string): void => {
        const ctx = three.current;
        const node = ctx?.order.find((n) => n.id === id);
        if (!ctx || !node) {
          return;
        }
        ctx.flyTo = new THREE.Vector3(node.x3, node.y3, node.z3);
      },
      fit: (): void => {
        const ctx = three.current;
        if (!ctx) {
          return;
        }
        ctx.flyTo = new THREE.Vector3(0, 0, 0);
        ctx.camera.position.set(0, 220, 1250);
      },
      zoomBy: (factor: number): void => {
        const ctx = three.current;
        if (!ctx) {
          return;
        }
        const direction = ctx.camera.position.clone().sub(ctx.controls.target);
        direction.multiplyScalar(1 / factor);
        const distance = Math.max(
          ctx.controls.minDistance,
          Math.min(ctx.controls.maxDistance, direction.length()),
        );
        ctx.camera.position.copy(ctx.controls.target).add(direction.setLength(distance));
      },
    }),
    [],
  );

  return (
    <div ref={mountRef} className="absolute inset-0 touch-none" data-lenis-prevent>
      <div
        ref={labelRef}
        className="pointer-events-none absolute top-0 left-0 z-10 rounded-md border border-slate-600/60 bg-slate-950/85 px-2 py-1 text-[11.5px] font-medium text-slate-100 opacity-0 backdrop-blur-sm transition-opacity duration-150"
      />
    </div>
  );
});
