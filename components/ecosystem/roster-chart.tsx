'use client';

import { JSX, useId, useState } from 'react';
import { CERTIFICATION_LABELS, type Centre, type Certification } from '@/lib/ecosystem/data/roster';

/**
 * Series colour, by certification.
 *
 * Two hues, assigned in the documented fixed order — slot 1 blue, slot 2 orange.
 * Both modes were run through the palette validator against this site's own
 * surfaces (#ffffff light, #101828 dark) and pass every check with no warnings:
 * CVD ΔE 24.7 light / 26.8 dark against a target of 8, contrast clear of 3:1.
 *
 * A green-for-organic palette was the intuitive choice and was measured first;
 * it cost a sub-3:1 contrast warning and roughly a third of the CVD separation,
 * so it was dropped. Hue here is identity, not decoration.
 *
 * The head office wears muted ink rather than a third hue: it holds no
 * certification, and a series colour would imply it were a third category.
 */
const SERIES: Record<Certification, string> = {
  conventional: 'bg-[#2a78d6] dark:bg-[#3987e5]',
  organic: 'bg-[#eb6834] dark:bg-[#d95926]',
  none: 'bg-gray-400 dark:bg-gray-500',
};

const formatPeople = (n: number): string => n.toLocaleString('en-GB');

interface BarRowProps {
  readonly label: string;
  readonly sublabel: string;
  readonly people: number;
  readonly certification: Certification;
  readonly max: number;
  readonly total: number;
}

/**
 * One horizontal bar: name, track, value.
 *
 * Horizontal because the names are long — "Zugu Suglo N-boribuni shea butter
 * processing centre" has nowhere to go under a vertical column.
 */
function BarRow({ label, sublabel, people, certification, max, total }: BarRowProps): JSX.Element {
  const [hovered, setHovered] = useState(false);
  const share = ((people / total) * 100).toFixed(1);

  return (
    <li
      className="group relative grid grid-cols-[1fr_auto] items-baseline gap-x-3 py-2 sm:grid-cols-[minmax(0,18rem)_1fr_auto] sm:gap-x-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
    >
      <div className="min-w-0 sm:py-0.5">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100" title={label}>
          {label}
        </p>
        <p className="truncate text-xs text-gray-500 dark:text-gray-400">{sublabel}</p>
      </div>

      {/* Track. Thin mark, rounded only at the data end, anchored at the baseline. */}
      <div className="col-span-2 mt-1 h-2.5 w-full rounded-r-[4px] bg-gray-100 sm:col-span-1 sm:mt-0 dark:bg-gray-800">
        <div
          className={`h-full rounded-r-[4px] transition-[width] duration-500 ease-out ${SERIES[certification]}`}
          style={{ width: `${Math.max((people / max) * 100, 1.5)}%` }}
        />
      </div>

      <p className="text-right text-sm font-semibold text-gray-900 tabular-nums dark:text-gray-100">
        {formatPeople(people)}
      </p>

      {hovered && (
        <div
          role="tooltip"
          className="pointer-events-none absolute -top-1 right-0 z-10 w-max max-w-xs -translate-y-full rounded-md border border-black/10 bg-white px-3 py-2 text-xs shadow-lg dark:border-white/10 dark:bg-[#101828]"
        >
          <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
          <p className="mt-0.5 text-gray-600 dark:text-gray-300">
            {formatPeople(people)} women · {share}% of all certified women
          </p>
          <p className="mt-0.5 text-gray-500 dark:text-gray-400">
            {CERTIFICATION_LABELS[certification]}
          </p>
        </div>
      )}
    </li>
  );
}

interface BarGroupProps {
  readonly title: string;
  readonly caption: string;
  readonly centres: readonly Centre[];
  readonly total: number;
}

/** A titled run of bars, sorted largest first so the eye starts at the top. */
export function BarGroup({ title, caption, centres, total }: BarGroupProps): JSX.Element {
  const sorted = [...centres].sort((a, b) => b.people - a.people);
  const max = sorted[0]?.people ?? 1;
  const headingId = useId();

  return (
    <section aria-labelledby={headingId}>
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-4">
        <h2 id={headingId} className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <p className="text-sm text-gray-500 tabular-nums dark:text-gray-400">
          {formatPeople(sorted.reduce((t, c) => t + c.people, 0))} women
        </p>
      </div>
      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">{caption}</p>

      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {sorted.map((centre) => (
          <BarRow
            key={centre.id}
            label={centre.name}
            sublabel={`${centre.code} · ${centre.activity}`}
            people={centre.people}
            certification={centre.certification}
            max={max}
            total={total}
          />
        ))}
      </ul>
    </section>
  );
}

export { SERIES, formatPeople };
