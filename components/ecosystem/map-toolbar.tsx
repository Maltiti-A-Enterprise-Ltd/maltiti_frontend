'use client';

import { JSX, useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Tag,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Box,
  Grid2x2,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { EcosystemGraph, GraphNode, TruthStatus } from './types';

interface ToolbarProps {
  graph: EcosystemGraph;
  mode: '2d' | '3d';
  onModeChange: (mode: '2d' | '3d') => void;
  viewId: string;
  onViewChange: (id: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  searchResults: GraphNode[];
  onPickResult: (id: string) => void;
  types: { type: string; count: number }[];
  hiddenTypes: Set<string>;
  onToggleType: (type: string) => void;
  statuses: { status: TruthStatus; count: number }[];
  hiddenStatuses: Set<TruthStatus>;
  onToggleStatus: (status: TruthStatus) => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  onResetFilters: () => void;
  /** Sign-out only exists when the map is behind the password gate. */
  showSignOut: boolean;
  onSignOut: () => void;
}

export function MapToolbar(props: ToolbarProps): JSX.Element {
  const {
    graph,
    mode,
    onModeChange,
    viewId,
    onViewChange,
    search,
    onSearchChange,
    searchResults,
    onPickResult,
    types,
    hiddenTypes,
    onToggleType,
    statuses,
    hiddenStatuses,
    onToggleStatus,
    showLabels,
    onToggleLabels,
    onZoomIn,
    onZoomOut,
    onFit,
    onResetFilters,
    showSignOut,
    onSignOut,
  } = props;

  const [searchOpen, setSearchOpen] = useState(false);
  const filterCount = hiddenTypes.size + hiddenStatuses.size;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-950/90 px-3 py-2 backdrop-blur-sm">
      {/* View preset — the same eleven views the printed diagrams use */}
      <Select value={viewId} onValueChange={onViewChange}>
        <SelectTrigger className="h-8 w-[210px] border-slate-700 bg-slate-900 text-[12px] text-slate-200">
          <SelectValue placeholder="Choose a view" />
        </SelectTrigger>
        <SelectContent className="border-slate-700 bg-slate-900 text-slate-200">
          <SelectItem value="ALL" className="text-[12px]">
            Everything ({graph.nodes.length} entities)
          </SelectItem>
          {graph.views.map((view) => (
            <SelectItem key={view.id} value={view.id} className="text-[12px]">
              {view.title} ({view.nodeIds.length})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
        <Input
          value={search}
          onChange={(event) => {
            onSearchChange(event.target.value);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          onBlur={() => window.setTimeout(() => setSearchOpen(false), 150)}
          placeholder="Search entities…"
          className="h-8 w-[200px] border-slate-700 bg-slate-900 pl-8 text-[12px] text-slate-200 placeholder:text-slate-500"
        />
        {searchOpen && search.trim().length > 0 && (
          <ul className="absolute top-9 left-0 z-50 max-h-72 w-[320px] overflow-y-auto rounded-md border border-slate-700 bg-slate-900 py-1 shadow-xl">
            {searchResults.length === 0 && (
              <li className="px-3 py-2 text-[12px] text-slate-500">No matching entity.</li>
            )}
            {searchResults.map((node) => (
              <li key={node.id}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onPickResult(node.id);
                    setSearchOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] text-slate-200 hover:bg-slate-800"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: node.color }}
                  />
                  <span className="min-w-0 flex-1 truncate">{node.label}</span>
                  <span className="shrink-0 font-mono text-[10px] text-slate-500">{node.type}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Filters */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 border-slate-700 bg-slate-900 text-[12px] text-slate-200 hover:bg-slate-800 hover:text-white"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {filterCount > 0 && (
              <span className="ml-0.5 rounded bg-slate-700 px-1 text-[10px]">{filterCount}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-72 border-slate-700 bg-slate-900 p-3 text-slate-200"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Truth status
            </span>
            <button
              type="button"
              onClick={onResetFilters}
              className="text-[11px] text-slate-400 underline-offset-2 hover:text-slate-100 hover:underline"
            >
              Reset
            </button>
          </div>
          <ul className="mb-3 space-y-1">
            {statuses.map(({ status, count }) => (
              <li key={status}>
                <label className="flex cursor-pointer items-center gap-2 text-[12px]">
                  <input
                    type="checkbox"
                    checked={!hiddenStatuses.has(status)}
                    onChange={() => onToggleStatus(status)}
                    className="h-3.5 w-3.5 accent-emerald-500"
                  />
                  <span className="flex-1 capitalize">
                    {status.replace(/_/g, ' ').toLowerCase()}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">{count}</span>
                </label>
              </li>
            ))}
          </ul>
          <div className="mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Entity type
          </div>
          <ul className="max-h-52 space-y-1 overflow-y-auto">
            {types.map(({ type, count }) => (
              <li key={type}>
                <label className="flex cursor-pointer items-center gap-2 text-[12px]">
                  <input
                    type="checkbox"
                    checked={!hiddenTypes.has(type)}
                    onChange={() => onToggleType(type)}
                    className="h-3.5 w-3.5 accent-emerald-500"
                  />
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: graph.meta.typeColor[type] ?? '#9aa6b2' }}
                  />
                  <span className="flex-1">{graph.meta.typeLabel[type] ?? type}</span>
                  <span className="font-mono text-[10px] text-slate-500">{count}</span>
                </label>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>

      <div className="ml-auto flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleLabels}
          className={cn(
            'h-8 gap-1.5 border-slate-700 bg-slate-900 text-[12px] hover:bg-slate-800 hover:text-white',
            showLabels ? 'text-slate-200' : 'text-slate-500',
          )}
        >
          <Tag className="h-3.5 w-3.5" />
          Labels
        </Button>

        {/* 2D / 3D */}
        <div className="flex overflow-hidden rounded-md border border-slate-700">
          <button
            type="button"
            onClick={() => onModeChange('2d')}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] transition-colors',
              mode === '2d'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200',
            )}
          >
            <Grid2x2 className="h-3.5 w-3.5" />
            2D
          </button>
          <button
            type="button"
            onClick={() => onModeChange('3d')}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] transition-colors',
              mode === '3d'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200',
            )}
          >
            <Box className="h-3.5 w-3.5" />
            3D
          </button>
        </div>

        <div className="flex overflow-hidden rounded-md border border-slate-700">
          <button
            type="button"
            onClick={onZoomOut}
            aria-label="Zoom out"
            className="bg-slate-900 px-2 py-1.5 text-slate-400 hover:text-slate-100"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onZoomIn}
            aria-label="Zoom in"
            className="border-x border-slate-700 bg-slate-900 px-2 py-1.5 text-slate-400 hover:text-slate-100"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onFit}
            aria-label="Fit to screen"
            className="bg-slate-900 px-2 py-1.5 text-slate-400 hover:text-slate-100"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {showSignOut && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            className="h-8 gap-1.5 text-[12px] text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </Button>
        )}
      </div>
    </div>
  );
}
