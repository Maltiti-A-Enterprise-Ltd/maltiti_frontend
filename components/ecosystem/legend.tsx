'use client';

import { JSX, useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EcosystemGraph } from './types';

const STATUS_ORDER = [
  'CONFIRMED',
  'PARTIALLY_CONFIRMED',
  'INFERRED',
  'UNVERIFIED',
  'UNKNOWN',
  'HISTORICAL',
  'PLANNED',
  'DISPUTED',
] as const;

/**
 * The legend is not decoration. Without it a viewer cannot tell a verified fact from a guess,
 * and the map becomes exactly the persuasive-but-misleading picture the knowledge model exists
 * to prevent. It is open by default for that reason.
 */
export function Legend({
  graph,
  visibleTypes,
}: {
  graph: EcosystemGraph;
  visibleTypes: string[];
}): JSX.Element {
  const [open, setOpen] = useState(true);

  return (
    <div className="pointer-events-auto w-60 overflow-hidden rounded-lg border border-slate-800 bg-slate-950/90 text-slate-300 shadow-xl backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase hover:text-slate-200"
      >
        <span className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5" />
          How to read this
        </span>
        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
      </button>

      {open && (
        <div className="max-h-[52vh] space-y-3 overflow-y-auto border-t border-slate-800 px-3 py-2.5">
          <div>
            <p className="mb-1.5 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Truth status
            </p>
            <ul className="space-y-1">
              {STATUS_ORDER.filter((s) => graph.stats.entityStatus[s]).map((status) => {
                const style = graph.meta.statusStyle[status];
                return (
                  <li key={status} className="flex items-baseline gap-2 text-[11px]">
                    <span
                      className={cn(
                        'inline-block h-2.5 w-2.5 shrink-0 translate-y-0.5 rounded-full border',
                        style?.dash ? 'border-dashed border-slate-400' : 'border-solid',
                        status === 'CONFIRMED'
                          ? 'border-white bg-slate-300'
                          : status === 'DISPUTED'
                            ? 'border-red-400 bg-red-400/40'
                            : 'border-slate-500 bg-slate-500/30',
                      )}
                    />
                    <span className="w-8 shrink-0 font-mono text-[10px] text-slate-500">
                      {style?.marker || '—'}
                    </span>
                    <span className="flex-1">{style?.label ?? status}</span>
                    <span className="font-mono text-[10px] text-slate-600">
                      {graph.stats.entityStatus[status]}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="space-y-1.5 border-t border-slate-800 pt-2.5 text-[11px] leading-relaxed">
            <p>
              <span className="font-mono text-amber-400">*</span> and a dashed outer ring mark a{' '}
              <strong className="font-semibold text-slate-200">provisional</strong> entity —
              suspected, not confirmed.
            </p>
            <p>
              A double ring marks a{' '}
              <strong className="font-semibold text-slate-200">class placeholder</strong> standing
              for many real things not yet identified.
            </p>
            <p>Dotted arrows are inferred or unverified links. Solid arrows are established.</p>
          </div>

          <div className="border-t border-slate-800 pt-2.5">
            <p className="mb-1.5 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Entity type
            </p>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
              {visibleTypes.map((type) => (
                <li key={type} className="flex items-center gap-1.5 text-[10.5px]">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: graph.meta.typeColor[type] ?? '#9aa6b2' }}
                  />
                  <span className="truncate">{graph.meta.typeLabel[type] ?? type}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
