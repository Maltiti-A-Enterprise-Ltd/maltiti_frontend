'use client';

import { JSX } from 'react';
import { cn } from '@/lib/utils';
import type { TruthStatus } from './types';

const TONE: Record<TruthStatus, string> = {
  CONFIRMED: 'border-emerald-500/40 bg-emerald-500/12 text-emerald-300',
  PARTIALLY_CONFIRMED: 'border-sky-500/40 bg-sky-500/12 text-sky-300',
  INFERRED: 'border-violet-500/40 bg-violet-500/12 text-violet-300',
  UNVERIFIED: 'border-amber-500/40 bg-amber-500/12 text-amber-300',
  UNKNOWN: 'border-slate-500/40 bg-slate-500/12 text-slate-300',
  HISTORICAL: 'border-stone-500/40 bg-stone-500/12 text-stone-300',
  PLANNED: 'border-teal-500/40 bg-teal-500/12 text-teal-300',
  DISPUTED: 'border-red-500/50 bg-red-500/15 text-red-300',
};

export function StatusBadge({
  status,
  className,
}: {
  status: TruthStatus;
  className?: string;
}): JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded border px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase',
        TONE[status] ?? TONE.UNKNOWN,
        className,
      )}
    >
      {status.replace(/_/g, ' ').toLowerCase()}
    </span>
  );
}

export function ConfidenceBar({ value }: { value: number }): JSX.Element {
  const pct = Math.round(value * 100);
  const tone = value >= 0.7 ? 'bg-emerald-400' : value >= 0.4 ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-700">
        <div className={cn('h-full rounded-full', tone)} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-[11px] text-slate-400">{value.toFixed(2)}</span>
    </div>
  );
}
