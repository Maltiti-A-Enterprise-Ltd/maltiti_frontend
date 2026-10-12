'use client';

import { JSX, useEffect, useState } from 'react';
import { CERTIFICATION_LABELS, type Centre, type RosterBand } from '@/lib/ecosystem/data/roster';
import { BarGroup, SERIES, formatPeople } from './roster-chart';
import { RosterMap } from './roster-map';

interface Totals {
  readonly organicProducers: number;
  readonly conventionalProducers: number;
  readonly producersAndWorkers: number;
  readonly conventionalCollectors: number;
  readonly organicCollectors: number;
  readonly collectors: number;
  readonly certifiedWomen: number;
  readonly centres: number;
}

interface Roster {
  readonly centres: readonly Centre[];
  readonly totals: Totals;
  readonly bands: readonly RosterBand[];
}

/** A headline number. No sparkline, no delta — there is no time series here. */
function StatTile({ value, label }: { value: string; label: string }): JSX.Element {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#101828]">
      <p className="text-2xl font-semibold text-gray-900 tabular-nums dark:text-gray-100">
        {value}
      </p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}

/**
 * The part-to-whole split, as one stacked bar.
 *
 * A 2px surface gap separates the segments so adjacent fills never touch, which
 * is what keeps the boundary readable without a stroke.
 */
function SplitBar({ bands, total }: { bands: readonly RosterBand[]; total: number }): JSX.Element {
  return (
    <div>
      <div className="flex h-4 w-full gap-[2px] overflow-hidden">
        {bands.map((band) => (
          <div
            key={band.id}
            className={`h-full first:rounded-l-[4px] last:rounded-r-[4px] ${SERIES[band.certification]}`}
            style={{ width: `${(band.people / total) * 100}%` }}
            title={`${band.label}: ${formatPeople(band.people)}`}
          />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {bands.map((band) => (
          <li key={band.id} className="flex items-baseline gap-2 text-sm">
            <span
              aria-hidden
              className={`inline-block size-2.5 shrink-0 translate-y-px rounded-[2px] ${SERIES[band.certification]}`}
            />
            <span className="text-gray-700 dark:text-gray-300">{band.label}</span>
            <span className="font-semibold text-gray-900 tabular-nums dark:text-gray-100">
              {formatPeople(band.people)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Identity never rests on colour alone: the legend is always present. */
function Legend(): JSX.Element {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2">
      {(['conventional', 'organic', 'none'] as const).map((certification) => (
        <li key={certification} className="flex items-center gap-2 text-sm">
          <span
            aria-hidden
            className={`inline-block size-2.5 rounded-[2px] ${SERIES[certification]}`}
          />
          <span className="text-gray-700 dark:text-gray-300">
            {CERTIFICATION_LABELS[certification]}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Eighteen named centres is past the point where colour can carry identity, so
 * the table is not a fallback — it is the form that answers "which centre?"
 * It doubles as the accessible view of every bar above.
 */
function RosterTable({ centres }: { centres: readonly Centre[] }): JSX.Element {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-sm">
        <caption className="sr-only">
          Every Maltiti centre and community, with its code, activity and number of certified women
        </caption>
        <thead>
          <tr className="border-b border-gray-200 text-left dark:border-gray-700">
            <th scope="col" className="py-2 pr-4 font-medium text-gray-500 dark:text-gray-400">
              Centre
            </th>
            <th scope="col" className="py-2 pr-4 font-medium text-gray-500 dark:text-gray-400">
              Activity
            </th>
            <th scope="col" className="py-2 pr-4 font-medium text-gray-500 dark:text-gray-400">
              Code
            </th>
            <th
              scope="col"
              className="py-2 text-right font-medium text-gray-500 dark:text-gray-400"
            >
              Women
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {centres.map((centre) => (
            <tr key={centre.id}>
              <td className="py-2 pr-4 text-gray-900 dark:text-gray-100">{centre.name}</td>
              <td className="py-2 pr-4 text-gray-600 dark:text-gray-300">{centre.activity}</td>
              <td className="py-2 pr-4 text-gray-500 tabular-nums dark:text-gray-400">
                {centre.code}
              </td>
              <td className="py-2 text-right font-medium text-gray-900 tabular-nums dark:text-gray-100">
                {formatPeople(centre.people)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RosterExplorer(): JSX.Element {
  const [view, setView] = useState<'bars' | 'map'>('bars');
  const [roster, setRoster] = useState<Roster | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/ecosystem/api/roster')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: Roster) => {
        if (!cancelled) {
          setRoster(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load the roster.');
        }
      });

    return (): void => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p className="py-12 text-center text-sm text-gray-500">{error}</p>;
  }

  if (!roster) {
    return <p className="py-12 text-center text-sm text-gray-500">Loading…</p>;
  }

  const { centres, totals, bands } = roster;
  const processing = centres.filter((c) => c.role !== 'collector-community');
  const collectors = centres.filter((c) => c.role === 'collector-community');

  return (
    <div className="mx-auto max-w-5xl px-5 pb-20">
      <header className="pt-10 pb-8">
        <p className="text-sm font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
          Maltiti A. Enterprise Ltd
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
          The women behind the butter
        </h1>
        {/* The hero figure: the one number this page exists to state. */}
        <p className="mt-6 text-6xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          {formatPeople(totals.certifiedWomen)}
        </p>
        <p className="mt-1 text-base text-gray-600 dark:text-gray-300">
          certified women across {totals.centres} centres and communities
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile value={formatPeople(totals.producersAndWorkers)} label="Producers and workers" />
        <StatTile value={formatPeople(totals.collectors)} label="Collectors" />
        <StatTile value={String(processing.length)} label="Processing centres" />
        <StatTile value={String(collectors.length)} label="Collector communities" />
      </div>

      <section aria-labelledby="split" className="mt-12">
        <h2 id="split" className="text-base font-semibold text-gray-900 dark:text-gray-100">
          How the {formatPeople(totals.certifiedWomen)} divide
        </h2>
        <p className="mt-1 mb-4 text-sm text-gray-500 dark:text-gray-400">
          Collectors outnumber producers almost four to one.
        </p>
        <SplitBar bands={bands} total={totals.certifiedWomen} />
      </section>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
        <Legend />

        {/* Two readings of the same rows: magnitude, or shape. */}
        <div
          role="group"
          aria-label="View"
          className="inline-flex rounded-md border border-black/10 p-0.5 dark:border-white/10"
        >
          {(
            [
              ['bars', 'By size'],
              ['map', 'Diagram'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={view === value}
              onClick={() => setView(value)}
              className={`rounded px-3 py-1 text-sm transition-colors ${
                view === value
                  ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === 'bars' ? (
        <div className="mt-8 space-y-12">
          <BarGroup
            title="Processing centres"
            caption="Where the nuts become butter, soap and packaged product."
            centres={processing}
            total={totals.certifiedWomen}
          />
          <BarGroup
            title="Collector communities"
            caption="Where the shea nuts are gathered."
            centres={collectors}
            total={totals.certifiedWomen}
          />
        </div>
      ) : (
        <div className="mt-8">
          <RosterMap centres={centres} total={totals.certifiedWomen} />
        </div>
      )}

      <section aria-labelledby="table" className="mt-14">
        <h2 id="table" className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">
          Every centre
        </h2>
        <RosterTable centres={centres} />
      </section>
    </div>
  );
}
