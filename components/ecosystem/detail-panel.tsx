'use client';

import { JSX, useMemo } from 'react';
import { X, ArrowRight, ArrowLeft, AlertTriangle, Layers, HelpCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { StatusBadge, ConfidenceBar } from './status-badge';
import type { EcosystemGraph, GraphNode } from './types';

interface DetailPanelProps {
  graph: EcosystemGraph;
  node: GraphNode;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '—';
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'boolean') {
    return value ? 'yes' : 'no';
  }
  return String(value);
}

function Section({ title, children }: { title: string; children: React.ReactNode }): JSX.Element {
  return (
    <section className="border-t border-slate-800 px-4 py-3">
      <h3 className="mb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}

/**
 * Everything the model knows about one node, including how much of it is actually believed.
 *
 * This is the reason an interactive map beats a static diagram for this project: the provenance
 * is always one click away, so nobody has to take a box on a chart at face value.
 */
export function DetailPanel({ graph, node, onClose, onNavigate }: DetailPanelProps): JSX.Element {
  const { incoming, outgoing } = useMemo(() => {
    const inc = graph.edges.filter((e) => e.target === node.id);
    const out = graph.edges.filter((e) => e.source === node.id);
    return { incoming: inc, outgoing: out };
  }, [graph.edges, node.id]);

  const nodeName = (id: string): string => graph.nodes.find((n) => n.id === id)?.label ?? id;

  return (
    <aside className="flex h-full w-full flex-col border-l border-slate-800 bg-slate-950/95 backdrop-blur-sm">
      <header className="flex items-start gap-3 px-4 py-3">
        <span
          className="mt-1.5 h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: node.color }}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm leading-snug font-semibold text-slate-100">{node.label}</h2>
          <p className="mt-0.5 font-mono text-[10px] text-slate-500">{node.id}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={node.status} />
            <span className="rounded border border-slate-700 px-1.5 py-0.5 text-[10px] text-slate-400">
              {graph.meta.typeLabel[node.type] ?? node.type}
              {node.subtype ? ` · ${node.subtype.replace(/_/g, ' ')}` : ''}
            </span>
          </div>
          <div className="mt-2">
            <ConfidenceBar value={node.confidence} />
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7 w-7 shrink-0 text-slate-400 hover:text-slate-100"
          aria-label="Close details"
        >
          <X className="h-4 w-4" />
        </Button>
      </header>

      <ScrollArea className="flex-1">
        <div className="pb-8">
          {(node.provisional || node.granularity === 'class') && (
            <div className="mx-4 mb-1 space-y-2">
              {node.provisional && (
                <p className="flex gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-2.5 text-[11.5px] leading-relaxed text-amber-200">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>
                    <strong className="font-semibold">Provisional placeholder.</strong> Created to
                    hold a place for something suspected but not confirmed. It must be confirmed,
                    merged or retired — do not treat it as established.
                  </span>
                </p>
              )}
              {node.granularity === 'class' && (
                <p className="flex gap-2 rounded-md border border-sky-500/30 bg-sky-500/10 p-2.5 text-[11.5px] leading-relaxed text-sky-200">
                  <Layers className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>
                    <strong className="font-semibold">Class placeholder.</strong> Stands for a set
                    of real things that have not been individually identified yet.
                  </span>
                </p>
              )}
            </div>
          )}

          {node.summary && (
            <Section title="Summary">
              <p className="text-[12.5px] leading-relaxed text-slate-300">{node.summary}</p>
            </Section>
          )}

          {node.attributes.length > 0 && (
            <Section title={`Facts (${node.attributes.length})`}>
              <ul className="space-y-3">
                {node.attributes.map((attr) => (
                  <li key={attr.key} className="text-[12px]">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-slate-400">
                        {attr.label ?? attr.key.replace(/_/g, ' ')}
                      </span>
                      <StatusBadge status={attr.status} />
                    </div>
                    <div className="mt-0.5 text-slate-100">
                      {formatValue(attr.value)}
                      {attr.unit ? ` ${attr.unit}` : ''}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-slate-500">
                      <span>as of {attr.asOf}</span>
                      {attr.volatility && <span>changes: {attr.volatility}</span>}
                      <span className="font-mono">{attr.sources.join(' ')}</span>
                    </div>
                    {attr.notes && (
                      <p className="mt-1 border-l-2 border-slate-700 pl-2 text-[11.5px] leading-relaxed text-slate-400 italic">
                        {attr.notes}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {(outgoing.length > 0 || incoming.length > 0) && (
            <Section title={`Connections (${outgoing.length + incoming.length})`}>
              <ul className="space-y-1.5">
                {outgoing.map((edge) => (
                  <li key={edge.id}>
                    <button
                      type="button"
                      onClick={() => onNavigate(edge.target)}
                      className="group flex w-full items-start gap-2 rounded px-1 py-1 text-left text-[12px] hover:bg-slate-800/60"
                    >
                      <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-slate-500" />
                      <span className="min-w-0 flex-1">
                        <span className="text-slate-500">
                          {edge.type.toLowerCase().replace(/_/g, ' ')}{' '}
                        </span>
                        <span className="text-slate-200 group-hover:text-white">
                          {nodeName(edge.target)}
                        </span>
                      </span>
                      <StatusBadge status={edge.status} />
                    </button>
                  </li>
                ))}
                {incoming.map((edge) => (
                  <li key={edge.id}>
                    <button
                      type="button"
                      onClick={() => onNavigate(edge.source)}
                      className="group flex w-full items-start gap-2 rounded px-1 py-1 text-left text-[12px] hover:bg-slate-800/60"
                    >
                      <ArrowLeft className="mt-0.5 h-3 w-3 shrink-0 text-slate-600" />
                      <span className="min-w-0 flex-1">
                        <span className="text-slate-200 group-hover:text-white">
                          {nodeName(edge.source)}
                        </span>
                        <span className="text-slate-500">
                          {' '}
                          {edge.type.toLowerCase().replace(/_/g, ' ')}
                        </span>
                      </span>
                      <StatusBadge status={edge.status} />
                    </button>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <Section title="Where this comes from">
            <ul className="space-y-2">
              {node.sources.map((id) => {
                const source = graph.governance.sources[id];
                if (!source) {
                  return null;
                }
                return (
                  <li key={id} className="text-[12px]">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[10px] text-slate-500">{source.id}</span>
                      <span className="rounded border border-slate-700 px-1 text-[10px] text-slate-400">
                        {source.reliability}/{source.credibility}
                      </span>
                    </div>
                    <div className="text-slate-300">{source.title}</div>
                    {source.usageRule && (
                      <p className="mt-1 text-[11px] leading-relaxed text-amber-300/80 italic">
                        {source.usageRule}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 text-[10.5px] leading-relaxed text-slate-500">
              Reliability is graded A (authoritative) to F (cannot be judged); credibility 1
              (corroborated) to 6 (cannot be judged).
            </p>
          </Section>

          {node.gaps.length > 0 && (
            <Section title={`What we don't know (${node.gaps.length})`}>
              <ul className="space-y-2">
                {node.gaps.map((id) => {
                  const gap = graph.governance.gaps[id];
                  if (!gap) {
                    return null;
                  }
                  return (
                    <li key={id} className="text-[12px]">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-[10px] text-slate-500">{gap.id}</span>
                        <span className="rounded border border-slate-700 px-1 text-[10px] text-slate-400">
                          {gap.priority}
                        </span>
                      </div>
                      <div className="text-slate-300">{gap.title}</div>
                    </li>
                  );
                })}
              </ul>
            </Section>
          )}

          {node.assumptions.length > 0 && (
            <Section title={`Assumptions this rests on (${node.assumptions.length})`}>
              <ul className="space-y-2">
                {node.assumptions.map((id) => {
                  const assumption = graph.governance.assumptions[id];
                  if (!assumption) {
                    return null;
                  }
                  return (
                    <li key={id} className="text-[12px]">
                      <span className="font-mono text-[10px] text-slate-500">{assumption.id}</span>
                      <p className="text-slate-300">{assumption.statement}</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                        <strong className="font-medium text-slate-400">If wrong:</strong>{' '}
                        {assumption.impactIfWrong}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </Section>
          )}

          {node.questions.length > 0 && (
            <Section title={`Questions that would settle this (${node.questions.length})`}>
              <ul className="space-y-2">
                {node.questions.map((id) => {
                  const question = graph.governance.questions[id];
                  if (!question) {
                    return null;
                  }
                  return (
                    <li key={id} className="flex gap-2 text-[12px]">
                      <HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-600" />
                      <div>
                        <p className="text-slate-300">{question.question}</p>
                        <p className="mt-0.5 text-[10.5px] text-slate-500">
                          {question.priority} · {question.batch} · ask of {question.askOf}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Section>
          )}

          <Section title="Record">
            <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11.5px]">
              <dt className="text-slate-500">Last reviewed</dt>
              <dd className="text-slate-300">{node.lastReviewed}</dd>
              {node.reviewDue && (
                <>
                  <dt className="text-slate-500">Review due</dt>
                  <dd className="text-slate-300">{node.reviewDue}</dd>
                </>
              )}
              {node.tags.length > 0 && (
                <>
                  <dt className="text-slate-500">Domains</dt>
                  <dd className="text-slate-300">{node.tags.join(', ')}</dd>
                </>
              )}
              {node.roles.length > 0 && (
                <>
                  <dt className="text-slate-500">Roles</dt>
                  <dd className="text-slate-300">{node.roles.join(', ')}</dd>
                </>
              )}
              {node.aliases.length > 0 && (
                <>
                  <dt className="text-slate-500">Also known as</dt>
                  <dd className="text-slate-300">{node.aliases.join(', ')}</dd>
                </>
              )}
            </dl>
            {node.notes && (
              <p className="mt-2 text-[11.5px] leading-relaxed text-slate-400 italic">
                {node.notes}
              </p>
            )}
          </Section>
        </div>
      </ScrollArea>
    </aside>
  );
}
