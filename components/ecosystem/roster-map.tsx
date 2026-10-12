'use client';

import { JSX, useState } from 'react';
import { CERTIFICATION_LABELS, type Centre } from '@/lib/ecosystem/data/roster';
import { formatPeople } from './roster-chart';

/**
 * Series colour as raw hex, because SVG fills cannot take a Tailwind class.
 * Same validated slots as the bars — see `roster-chart.tsx` for the measurements.
 */
const FILL = {
  conventional: '#2a78d6',
  organic: '#eb6834',
  none: '#9ca3af',
} as const;

/**
 * Wider than tall, because the labels run sideways off the rings.
 *
 * The origin is left of centre rather than in the middle of the box: the named
 * nodes are the largest, the ring is sorted descending from the top, so every
 * direct label lands on the right. Centring the rings would leave a band of
 * dead space on the left and crowd the labels against the right edge.
 */
const VIEW_W = 1100;
const VIEW_H = 880;
const CX = 480;
const CY = 440;

/** Ring radii: head office at the origin, then role by distance. */
const RING = { processing: 160, collectors: 290 };

/**
 * The wedge at the top of each ring left empty for that ring's caption.
 *
 * Without it the first node — always the largest, since rings are sorted
 * descending — lands exactly on the caption. The inner ring needs the wider
 * wedge: at half the radius, the same angle buys half the clearance.
 */
const CAPTION_WEDGE = { processing: 96, collectors: 70 };

/** Below this, a node carries its number only; the table and hover name the rest. */
const NAME_LABEL_FLOOR = 150;

const MIN_R = 10;
const MAX_R = 38;

/**
 * Circle area is proportional to headcount, so radius goes as the square root.
 * Sizing by radius instead would make Kpendua's 445 look thirty times Katariga's
 * 14 rather than roughly five times — the classic bubble exaggeration.
 */
const radiusFor = (people: number, maxPeople: number): number =>
  MIN_R + (MAX_R - MIN_R) * Math.sqrt(people / maxPeople);

interface PlacedNode {
  readonly centre: Centre;
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly angle: number;
  readonly ring: number;
}

/**
 * Spreads a set of centres around a ring, largest first, clockwise from the top,
 * leaving `wedgeDegrees` clear at the top for the ring's caption.
 */
function placeRing(
  centres: readonly Centre[],
  ringRadius: number,
  maxPeople: number,
  wedgeDegrees: number,
): PlacedNode[] {
  const sorted = [...centres].sort((a, b) => b.people - a.people);
  const arc = ((360 - wedgeDegrees) * Math.PI) / 180;
  const start = -Math.PI / 2 + (wedgeDegrees * Math.PI) / 360;
  const step = sorted.length > 1 ? arc / (sorted.length - 1) : 0;

  return sorted.map((centre, i) => {
    const angle = sorted.length > 1 ? start + i * step : -Math.PI / 2;
    return {
      centre,
      angle,
      ring: ringRadius,
      x: CX + Math.cos(angle) * ringRadius,
      y: CY + Math.sin(angle) * ringRadius,
      r: radiusFor(centre.people, maxPeople),
    };
  });
}

/** Strips the shared suffix so a direct label is the place, not the sentence. */
const shortName = (name: string): string => name.replace(/\s+shea butter processing centre$/i, '');

interface RosterMapProps {
  readonly centres: readonly Centre[];
  readonly total: number;
}

/**
 * A diagram of how the organisation fits together.
 *
 * What the bars cannot show is shape: that one head office sits behind seven
 * processing centres, which sit behind ten collecting communities. Here that is
 * the whole encoding — distance from the middle is role, size is headcount,
 * colour is certification.
 *
 * Angle carries nothing; it is only spacing. This is not a map of places, and
 * the roster has no coordinates, so nothing here should be read as where a
 * community actually is.
 *
 * Deliberately edgeless: which community supplies which processing centre is not
 * in the data, and a drawn line would assert a route nobody recorded.
 *
 * Only the largest few communities are named on the figure. Eighteen names will
 * not fit around two rings without colliding, so the rest are named on hover and
 * in the table below — which is the accessible reading of this figure anyway.
 */
export function RosterMap({ centres, total }: RosterMapProps): JSX.Element {
  const [active, setActive] = useState<PlacedNode | null>(null);

  const head = centres.find((c) => c.role === 'head-office');
  const processing = centres.filter((c) => c.role === 'processing-centre');
  const collectors = centres.filter((c) => c.role === 'collector-community');

  const maxPeople = Math.max(...centres.map((c) => c.people));
  const nodes = [
    ...placeRing(processing, RING.processing, maxPeople, CAPTION_WEDGE.processing),
    ...placeRing(collectors, RING.collectors, maxPeople, CAPTION_WEDGE.collectors),
  ];

  const headR = head ? radiusFor(head.people, maxPeople) : 0;

  return (
    <div>
      {/* The figure has a floor below which its labels stop being legible, so on a
          narrow screen it scrolls sideways rather than shrinking into nothing. */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="mx-auto w-full max-w-[760px] min-w-[720px]"
          role="img"
          aria-label={`Diagram of ${centres.length} Maltiti centres and communities, grouped by role. The table below lists every one with its headcount.`}
        >
          {/* Recessive guide rings — they carry the role grouping, nothing more. */}
          {Object.values(RING).map((r) => (
            <circle
              key={r}
              cx={CX}
              cy={CY}
              r={r}
              fill="none"
              className="stroke-gray-200 dark:stroke-gray-700"
              strokeWidth={1.5}
              strokeDasharray="4 7"
            />
          ))}

          {/* Captions sit just above their own ring, inside the wedge kept clear
              for them, so neither one is ever struck through by a node. */}
          <text
            x={CX}
            y={CY - RING.collectors - 12}
            textAnchor="middle"
            className="fill-gray-500 text-[17px] dark:fill-gray-400"
          >
            collector communities
          </text>
          <text
            x={CX}
            y={CY - RING.processing - 12}
            textAnchor="middle"
            className="fill-gray-500 text-[17px] dark:fill-gray-400"
          >
            processing centres
          </text>

          {head && (
            <g>
              <circle cx={CX} cy={CY} r={headR} fill={FILL.none} />
              <text
                x={CX}
                y={CY + headR + 22}
                textAnchor="middle"
                className="fill-gray-900 text-[19px] font-semibold dark:fill-gray-100"
              >
                Head office
              </text>
              <text
                x={CX}
                y={CY + headR + 42}
                textAnchor="middle"
                className="fill-gray-500 text-[17px] tabular-nums dark:fill-gray-400"
              >
                {head.people}
              </text>
            </g>
          )}

          {nodes.map((node) => {
            const isActive = active?.centre.id === node.centre.id;
            const named = node.centre.people >= NAME_LABEL_FLOOR;

            /* Labels are pushed outward along the node's own angle, so a ring of
               them reads away from the middle instead of piling into it. */
            const labelRadius = node.ring + node.r + 14;
            const labelX = CX + Math.cos(node.angle) * labelRadius;
            const labelY = CY + Math.sin(node.angle) * labelRadius;
            const anchor =
              Math.abs(Math.cos(node.angle)) < 0.3
                ? 'middle'
                : Math.cos(node.angle) > 0
                  ? 'start'
                  : 'end';

            return (
              <g
                key={node.centre.id}
                onMouseEnter={() => setActive(node)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(node)}
                onBlur={() => setActive(null)}
                tabIndex={0}
                className="cursor-pointer focus:outline-none"
              >
                {/* Focus and hover get a visible ring, since the SVG outline is off. */}
                {isActive && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.r + 5}
                    fill="none"
                    className="stroke-gray-900 dark:stroke-gray-100"
                    strokeWidth={2}
                  />
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r}
                  fill={FILL[node.centre.certification]}
                  /* A 2px surface ring keeps overlapping marks separable. */
                  className="stroke-white dark:stroke-[#101828]"
                  strokeWidth={2}
                  opacity={active && !isActive ? 0.4 : 1}
                />
                {named && (
                  <text
                    x={labelX}
                    y={labelY - 8}
                    textAnchor={anchor}
                    className="fill-gray-900 text-[18px] font-semibold dark:fill-gray-100"
                  >
                    {shortName(node.centre.name)}
                  </text>
                )}
                <text
                  x={labelX}
                  y={named ? labelY + 12 : labelY}
                  textAnchor={anchor}
                  dominantBaseline={named ? 'auto' : 'middle'}
                  className="fill-gray-500 text-[16px] tabular-nums dark:fill-gray-400"
                >
                  {node.centre.people}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* The hover readout sits below the figure rather than floating over it:
          a tooltip near the rim of a circle layout covers its neighbours. */}
      <div className="mt-2 min-h-14 rounded-lg border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-[#101828]">
        {active ? (
          <>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {active.centre.name}
            </p>
            <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">
              {formatPeople(active.centre.people)} women ·{' '}
              {((active.centre.people / total) * 100).toFixed(1)}% of all certified women ·{' '}
              {CERTIFICATION_LABELS[active.centre.certification]} · {active.centre.code}
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Hover or focus a circle to read the centre. Size shows how many women; colour shows
            certification; distance from the middle shows role.
          </p>
        )}
      </div>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        A diagram of how the organisation fits together — distance from the middle is role, size is
        how many women, colour is certification. Angle is spacing only, and no line is drawn between
        a community and a centre because the roster does not record which supplies which.
      </p>
    </div>
  );
}
