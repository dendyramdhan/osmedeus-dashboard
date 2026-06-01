"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EmptyState } from "@/components/shared/empty-state";
import { SortableTableHead } from "@/components/ui/sortable-table-head";
import { truncate, getTechDotColor, getStatusBadgeVariant, cn } from "@/lib/utils";
import type { HttpAsset, AssetSortState, AssetSortField } from "@/lib/types/asset";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import {
  LinkIcon,
  ExternalLinkIcon,
  CopyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchXIcon,
} from "lucide-react";

export type HttpAssetsColumnKey =
  | "id"
  | "workspace"
  | "assetValue"
  | "url"
  | "input"
  | "scheme"
  | "method"
  | "path"
  | "statusCode"
  | "contentType"
  | "contentLength"
  | "title"
  | "words"
  | "lines"
  | "hostIp"
  | "dnsRecords"
  | "tls"
  | "assetType"
  | "technologies"
  | "responseTime"
  | "remarks"
  | "source"
  | "createdAt"
  | "updatedAt"
  | "lastSeenAt";

const defaultVisibleColumns: Record<HttpAssetsColumnKey, boolean> = {
  id: false,
  workspace: false,
  assetValue: true,
  url: false,
  input: false,
  scheme: false,
  method: false,
  path: false,
  statusCode: true,
  contentType: false,
  contentLength: true,
  title: true,
  words: false,
  lines: false,
  hostIp: true,
  dnsRecords: false,
  tls: false,
  assetType: true,
  remarks: true,
  technologies: true,
  responseTime: false,
  source: false,
  createdAt: false,
  updatedAt: false,
  lastSeenAt: false,
};

interface HttpAssetsTableProps {
  assets: HttpAsset[];
  isLoading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  sortState: AssetSortState;
  onSort: (field: AssetSortField) => void;
  onPageChange?: (page: number) => void;
  onSelect?: (asset: HttpAsset) => void;
  hasActiveFilters?: boolean;
  visibleColumns?: Record<HttpAssetsColumnKey, boolean>;
  density?: "comfortable" | "compact";
}

function TableSkeleton({
  rows = 10,
  visibleColumns,
}: {
  rows?: number;
  visibleColumns: Record<HttpAssetsColumnKey, boolean>;
}) {
  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow>
          {visibleColumns.id && (
            <TableHead className="w-[80px]"><Skeleton className="h-4 w-8" /></TableHead>
          )}
          {visibleColumns.workspace && (
            <TableHead className="w-[140px]"><Skeleton className="h-4 w-14" /></TableHead>
          )}
          {visibleColumns.assetValue && (
            <TableHead className="w-[280px]"><Skeleton className="h-4 w-12" /></TableHead>
          )}
          {visibleColumns.url && (
            <TableHead className="w-[260px]"><Skeleton className="h-4 w-10" /></TableHead>
          )}
          {visibleColumns.input && (
            <TableHead className="w-[180px]"><Skeleton className="h-4 w-10" /></TableHead>
          )}
          {visibleColumns.scheme && (
            <TableHead className="w-[90px]"><Skeleton className="h-4 w-10" /></TableHead>
          )}
          {visibleColumns.method && (
            <TableHead className="w-[90px]"><Skeleton className="h-4 w-10" /></TableHead>
          )}
          {visibleColumns.path && (
            <TableHead className="w-[160px]"><Skeleton className="h-4 w-10" /></TableHead>
          )}
          {visibleColumns.statusCode && (
            <TableHead className="w-[80px]"><Skeleton className="h-4 w-12" /></TableHead>
          )}
          {visibleColumns.contentType && (
            <TableHead className="w-[180px]"><Skeleton className="h-4 w-12" /></TableHead>
          )}
          {visibleColumns.contentLength && (
            <TableHead className="w-[80px]"><Skeleton className="h-4 w-10" /></TableHead>
          )}
          {visibleColumns.title && (
            <TableHead className="w-[160px]"><Skeleton className="h-4 w-10" /></TableHead>
          )}
          {visibleColumns.words && (
            <TableHead className="w-[90px]"><Skeleton className="h-4 w-10" /></TableHead>
          )}
          {visibleColumns.lines && (
            <TableHead className="w-[90px]"><Skeleton className="h-4 w-10" /></TableHead>
          )}
          {visibleColumns.hostIp && (
            <TableHead className="w-[110px]"><Skeleton className="h-4 w-14" /></TableHead>
          )}
          {visibleColumns.dnsRecords && (
            <TableHead className="w-[160px]"><Skeleton className="h-4 w-12" /></TableHead>
          )}
          {visibleColumns.tls && (
            <TableHead className="w-[110px]"><Skeleton className="h-4 w-12" /></TableHead>
          )}
          {visibleColumns.assetType && (
            <TableHead className="w-[110px]"><Skeleton className="h-4 w-12" /></TableHead>
          )}
          {visibleColumns.remarks && (
            <TableHead className="w-[160px]"><Skeleton className="h-4 w-12" /></TableHead>
          )}
          {visibleColumns.technologies && (
            <TableHead className="w-[150px]"><Skeleton className="h-4 w-10" /></TableHead>
          )}
          {visibleColumns.responseTime && (
            <TableHead className="w-[120px]"><Skeleton className="h-4 w-10" /></TableHead>
          )}
          {visibleColumns.source && (
            <TableHead className="w-[120px]"><Skeleton className="h-4 w-10" /></TableHead>
          )}
          {visibleColumns.createdAt && (
            <TableHead className="w-[150px]"><Skeleton className="h-4 w-12" /></TableHead>
          )}
          {visibleColumns.updatedAt && (
            <TableHead className="w-[150px]"><Skeleton className="h-4 w-12" /></TableHead>
          )}
          {visibleColumns.lastSeenAt && (
            <TableHead className="w-[150px]"><Skeleton className="h-4 w-12" /></TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRow key={i}>
            {visibleColumns.id && <TableCell><Skeleton className="h-4 w-10" /></TableCell>}
            {visibleColumns.workspace && <TableCell><Skeleton className="h-4 w-20" /></TableCell>}
            {visibleColumns.assetValue && <TableCell><Skeleton className="h-4 w-52" /></TableCell>}
            {visibleColumns.url && <TableCell><Skeleton className="h-4 w-44" /></TableCell>}
            {visibleColumns.input && <TableCell><Skeleton className="h-4 w-36" /></TableCell>}
            {visibleColumns.scheme && <TableCell><Skeleton className="h-4 w-12" /></TableCell>}
            {visibleColumns.method && <TableCell><Skeleton className="h-4 w-12" /></TableCell>}
            {visibleColumns.path && <TableCell><Skeleton className="h-4 w-24" /></TableCell>}
            {visibleColumns.statusCode && <TableCell><Skeleton className="h-6 w-12 rounded-md" /></TableCell>}
            {visibleColumns.contentType && <TableCell><Skeleton className="h-4 w-28" /></TableCell>}
            {visibleColumns.contentLength && <TableCell><Skeleton className="h-4 w-14" /></TableCell>}
            {visibleColumns.title && <TableCell><Skeleton className="h-4 w-28" /></TableCell>}
            {visibleColumns.words && <TableCell><Skeleton className="h-4 w-12" /></TableCell>}
            {visibleColumns.lines && <TableCell><Skeleton className="h-4 w-12" /></TableCell>}
            {visibleColumns.hostIp && <TableCell><Skeleton className="h-4 w-24" /></TableCell>}
            {visibleColumns.dnsRecords && <TableCell><Skeleton className="h-4 w-24" /></TableCell>}
            {visibleColumns.tls && <TableCell><Skeleton className="h-4 w-16" /></TableCell>}
            {visibleColumns.assetType && <TableCell><Skeleton className="h-4 w-16" /></TableCell>}
            {visibleColumns.remarks && (
              <TableCell>
                <div className="flex gap-1">
                  <Skeleton className="h-5 w-16 rounded-md" />
                  <Skeleton className="h-5 w-12 rounded-md" />
                </div>
              </TableCell>
            )}
            {visibleColumns.technologies && (
              <TableCell>
                <div className="flex gap-1">
                  <Skeleton className="h-5 w-14 rounded-md" />
                  <Skeleton className="h-5 w-14 rounded-md" />
                </div>
              </TableCell>
            )}
            {visibleColumns.responseTime && <TableCell><Skeleton className="h-4 w-16" /></TableCell>}
            {visibleColumns.source && <TableCell><Skeleton className="h-4 w-16" /></TableCell>}
            {visibleColumns.createdAt && <TableCell><Skeleton className="h-4 w-24" /></TableCell>}
            {visibleColumns.updatedAt && <TableCell><Skeleton className="h-4 w-24" /></TableCell>}
            {visibleColumns.lastSeenAt && <TableCell><Skeleton className="h-4 w-24" /></TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function HttpAssetsTable({
  assets,
  isLoading,
  pagination,
  sortState,
  onSort,
  onPageChange,
  onSelect,
  hasActiveFilters,
  visibleColumns,
  density = "comfortable",
}: HttpAssetsTableProps) {
  const resolvedVisibleColumns = React.useMemo(() => {
    return {
      ...defaultVisibleColumns,
      ...(visibleColumns ?? {}),
    };
  }, [visibleColumns]);

  // Show skeleton when initially loading
  if (isLoading && assets.length === 0) {
    return (
      <div className="relative min-h-[400px]">
        <TableSkeleton rows={10} visibleColumns={resolvedVisibleColumns} />
      </div>
    );
  }

  // Show empty state
  if (assets.length === 0) {
    return (
      <div className="relative min-h-[360px] flex items-center justify-center">
        <EmptyState
          icon={hasActiveFilters ? SearchXIcon : LinkIcon}
          title={hasActiveFilters ? "No matching assets" : "No assets found"}
          description={
            hasActiveFilters
              ? "No HTTP assets match your current filters. Try adjusting your search criteria or clearing some filters."
              : "No HTTP assets have been discovered yet. Run a scan to start discovering assets."
          }
        />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4 relative">
        {/* Refreshing overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 z-20 flex items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background px-3 py-2 rounded-md shadow-sm border">
              <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Refreshing...
            </div>
          </div>
        )}

        <div
          className={cn(
            "overflow-x-auto",
            density === "compact" && "[&_td]:py-1 [&_th]:h-8"
          )}
        >
          <Table className="table-fixed">
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                {resolvedVisibleColumns.id && (
                  <TableHead className="w-[80px]">ID</TableHead>
                )}
                {resolvedVisibleColumns.workspace && (
                  <TableHead className="w-[160px]">Workspace</TableHead>
                )}
                {resolvedVisibleColumns.assetValue && (
                  <SortableTableHead
                    field="url"
                    currentSort={sortState}
                    onSort={(f) => onSort(f as AssetSortField)}
                    className="w-[280px]"
                  >
                    Asset Value
                  </SortableTableHead>
                )}
                {resolvedVisibleColumns.url && (
                  <TableHead className="w-[260px]">URL</TableHead>
                )}
                {resolvedVisibleColumns.input && (
                  <TableHead className="w-[180px]">Input</TableHead>
                )}
                {resolvedVisibleColumns.scheme && (
                  <TableHead className="w-[100px]">Scheme</TableHead>
                )}
                {resolvedVisibleColumns.method && (
                  <TableHead className="w-[100px]">Method</TableHead>
                )}
                {resolvedVisibleColumns.path && (
                  <TableHead className="w-[160px]">Path</TableHead>
                )}
                {resolvedVisibleColumns.statusCode && (
                  <SortableTableHead
                    field="statusCode"
                    currentSort={sortState}
                    onSort={(f) => onSort(f as AssetSortField)}
                    className="w-[80px]"
                  >
                    Status Code
                  </SortableTableHead>
                )}
                {resolvedVisibleColumns.contentType && (
                  <TableHead className="w-[190px]">Content Type</TableHead>
                )}
                {resolvedVisibleColumns.contentLength && (
                  <SortableTableHead
                    field="contentLength"
                    currentSort={sortState}
                    onSort={(f) => onSort(f as AssetSortField)}
                    className="w-[110px]"
                  >
                    Content Length
                  </SortableTableHead>
                )}
                {resolvedVisibleColumns.title && (
                  <SortableTableHead
                    field="title"
                    currentSort={sortState}
                    onSort={(f) => onSort(f as AssetSortField)}
                    className="w-[160px]"
                  >
                    Title
                  </SortableTableHead>
                )}
                {resolvedVisibleColumns.words && (
                  <TableHead className="w-[90px]">Words</TableHead>
                )}
                {resolvedVisibleColumns.lines && (
                  <TableHead className="w-[90px]">Lines</TableHead>
                )}
                {resolvedVisibleColumns.hostIp && (
                  <SortableTableHead
                    field="hostIp"
                    currentSort={sortState}
                    onSort={(f) => onSort(f as AssetSortField)}
                    className="w-[110px]"
                  >
                    Host IP
                  </SortableTableHead>
                )}
                {resolvedVisibleColumns.dnsRecords && (
                  <TableHead className="w-[170px]">DNS Records</TableHead>
                )}
                {resolvedVisibleColumns.tls && (
                  <TableHead className="w-[110px]">TLS</TableHead>
                )}
                {resolvedVisibleColumns.assetType && (
                  <TableHead className="w-[110px]">Asset Type</TableHead>
                )}
                {resolvedVisibleColumns.remarks && (
                  <TableHead className="w-[170px]">Remarks</TableHead>
                )}
                {resolvedVisibleColumns.technologies && (
                  <SortableTableHead
                    field="technologies"
                    currentSort={sortState}
                    onSort={(f) => onSort(f as AssetSortField)}
                    className="w-[150px]"
                  >
                    Tech
                  </SortableTableHead>
                )}
                {resolvedVisibleColumns.responseTime && (
                  <SortableTableHead
                    field="responseTime"
                    currentSort={sortState}
                    onSort={(f) => onSort(f as AssetSortField)}
                    className="w-[120px]"
                  >
                    Time
                  </SortableTableHead>
                )}
                {resolvedVisibleColumns.source && (
                  <TableHead className="w-[120px]">Source</TableHead>
                )}
                {resolvedVisibleColumns.createdAt && (
                  <TableHead className="w-[160px]">Created At</TableHead>
                )}
                {resolvedVisibleColumns.updatedAt && (
                  <TableHead className="w-[160px]">Updated At</TableHead>
                )}
                {resolvedVisibleColumns.lastSeenAt && (
                  <TableHead className="w-[160px]">Last Seen At</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence initial={false} mode="popLayout">
                {assets.map((asset) => (
                  <motion.tr
                    key={asset.id}
                    data-slot="table-row"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="group border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
                    onClick={() => onSelect?.(asset)}
                  >
                  {resolvedVisibleColumns.id && (
                    <TableCell className="text-xs font-mono">{asset.id}</TableCell>
                  )}
                  {resolvedVisibleColumns.workspace && (
                    <TableCell className="text-sm">{asset.workspace || "-"}</TableCell>
                  )}
                  {resolvedVisibleColumns.assetValue && (
                    <TableCell>
                      {(() => {
                        const assetValue = asset.assetValue || asset.url;
                        const isUrlValue = /^https?:\/\//i.test(assetValue);
                        const urlToOpen = asset.url || (isUrlValue ? assetValue : "");

                        const openAction = urlToOpen ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-7" asChild>
                                <a
                                  href={urlToOpen}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLinkIcon className="size-4" />
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Open URL</TooltipContent>
                          </Tooltip>
                        ) : null;

                        const copyAction = isUrlValue ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    await navigator.clipboard.writeText(assetValue);
                                    toast.success("Copied URL");
                                  } catch {
                                    toast.error("Failed to copy URL");
                                  }
                                }}
                              >
                                <CopyIcon className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Copy URL</TooltipContent>
                          </Tooltip>
                        ) : null;

                        const label = !assetValue ? (
                          <span className="text-muted-foreground">-</span>
                        ) : isUrlValue ? (
                          <a
                            href={urlToOpen || assetValue}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-sm hover:underline text-primary truncate max-w-[240px]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {truncate(assetValue, 38)}
                          </a>
                        ) : (
                          <span className="font-mono text-sm text-foreground truncate max-w-[240px] block">
                            {truncate(assetValue, 38)}
                          </span>
                        );

                        return (
                          <div className="flex items-center gap-1.5 min-w-0">
                            {label}
                            {(copyAction || openAction) && (
                              <span className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                                {copyAction}
                                {openAction}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </TableCell>
                  )}
                  {resolvedVisibleColumns.url && (
                    <TableCell className="text-sm">
                      {asset.url ? (
                        <a
                          href={asset.url.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs text-primary hover:underline truncate block max-w-[220px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {truncate(asset.url.trim(), 38)}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  {resolvedVisibleColumns.input && (
                    <TableCell className="text-sm">
                      {asset.input ? (
                        <span className="font-mono text-xs">{asset.input}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  {resolvedVisibleColumns.scheme && (
                    <TableCell className="text-sm">
                      {asset.scheme ? (
                        <span className="font-mono text-xs">{asset.scheme}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  {resolvedVisibleColumns.method && (
                    <TableCell className="text-sm">
                      {asset.method ? (
                        <Badge variant="outline" className="text-xs">
                          {asset.method}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  {resolvedVisibleColumns.path && (
                    <TableCell className="text-sm">
                      <span className="font-mono text-xs">
                        {asset.path || "-"}
                      </span>
                    </TableCell>
                  )}
                  {resolvedVisibleColumns.statusCode && (
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(asset.statusCode)}>
                        {asset.statusCode}
                      </Badge>
                    </TableCell>
                  )}
                  {resolvedVisibleColumns.contentType && (
                    <TableCell className="text-xs">
                      {asset.contentType || "-"}
                    </TableCell>
                  )}
                  {resolvedVisibleColumns.contentLength && (
                    <TableCell className="text-sm text-muted-foreground">
                      {asset.contentLength.toLocaleString()}
                    </TableCell>
                  )}
                  {resolvedVisibleColumns.title && (
                    <TableCell className="text-sm">
                      {asset.title ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="truncate block max-w-[140px] cursor-default">
                              {asset.title}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[300px]">
                            {asset.title}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  {resolvedVisibleColumns.words && (
                    <TableCell className="text-sm">
                      {asset.words?.toLocaleString?.() ?? "-"}
                    </TableCell>
                  )}
                  {resolvedVisibleColumns.lines && (
                    <TableCell className="text-sm">
                      {asset.lines?.toLocaleString?.() ?? "-"}
                    </TableCell>
                  )}
                  {resolvedVisibleColumns.hostIp && (
                    <TableCell className="text-sm">
                      {asset.hostIp ? (
                        <span className="font-mono text-xs">{asset.hostIp}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  {resolvedVisibleColumns.dnsRecords && (
                    <TableCell className="text-sm">
                      {asset.aRecords.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {asset.aRecords.slice(0, 2).map((record, i) => (
                            <Badge
                              key={`${asset.id}-dns-${i}`}
                              variant="outline"
                              className="text-xs font-mono"
                            >
                              {record}
                            </Badge>
                          ))}
                          {asset.aRecords.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{asset.aRecords.length - 2}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  {resolvedVisibleColumns.tls && (
                    <TableCell className="text-sm">
                      {asset.tls || <span className="text-muted-foreground">-</span>}
                    </TableCell>
                  )}
                  {resolvedVisibleColumns.assetType && (
                    <TableCell className="text-sm">
                      {asset.assetType ? (
                        <Badge variant="secondary" className="text-xs font-mono">
                          {asset.assetType}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  {resolvedVisibleColumns.remarks && (
                    <TableCell className="text-sm">
                      {(() => {
                        const remarks = Array.isArray(asset.remarks)
                          ? asset.remarks
                          : asset.remarks
                            ? [asset.remarks]
                            : [];
                        if (remarks.length === 0) return <span className="text-muted-foreground">-</span>;
                        if (remarks.length <= 2) {
                          return (
                            <div className="flex flex-wrap gap-1">
                              {remarks.map((remark, i) => (
                                <Badge key={`${asset.id}-remark-${i}`} variant="outline" className="text-xs">
                                  {remark}
                                </Badge>
                              ))}
                            </div>
                          );
                        }
                        return (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex flex-wrap gap-1">
                                {remarks.slice(0, 2).map((remark, i) => (
                                  <Badge key={`${asset.id}-remark-${i}`} variant="outline" className="text-xs">
                                    {remark}
                                  </Badge>
                                ))}
                                <Badge variant="secondary" className="text-xs">
                                  +{remarks.length - 2}
                                </Badge>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-[300px]">
                              <div className="flex flex-wrap gap-1">
                                {remarks.map((remark, i) => (
                                  <Badge key={`${asset.id}-remark-all-${i}`} variant="outline" className="text-xs">
                                    {remark}
                                  </Badge>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })()}
                    </TableCell>
                  )}
                  {resolvedVisibleColumns.technologies && (
                    <TableCell className="text-sm">
                      {(() => {
                        const techs = asset.technologies
                          .map((t) => t.trim())
                          .filter(Boolean);
                        if (techs.length === 0) {
                          return <span className="text-muted-foreground">-</span>;
                        }
                        const visible = techs.slice(0, 2);
                        const overflow = techs.length - visible.length;
                        const chips = (
                          <div className="flex flex-wrap items-center gap-1">
                            {visible.map((tech, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="gap-1.5 text-xs font-medium"
                              >
                                <span
                                  className={cn(
                                    "size-1.5 shrink-0 rounded-full",
                                    getTechDotColor(tech)
                                  )}
                                />
                                <span className="block max-w-[140px] truncate">
                                  {tech.split("/")[0]}
                                </span>
                              </Badge>
                            ))}
                            {overflow > 0 && (
                              <Badge variant="outline" className="text-xs text-muted-foreground">
                                +{overflow}
                              </Badge>
                            )}
                          </div>
                        );
                        if (overflow === 0) return chips;
                        return (
                          <Tooltip>
                            <TooltipTrigger asChild>{chips}</TooltipTrigger>
                            <TooltipContent side="top" className="max-w-[280px] p-2">
                              <p className="mb-1.5 px-0.5 text-[11px] font-medium text-background/60">
                                {techs.length} technologies
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {techs.map((tech, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center gap-1.5 rounded-md bg-background/10 px-2 py-1 text-xs font-medium text-background"
                                  >
                                    <span
                                      className={cn(
                                        "size-1.5 shrink-0 rounded-full",
                                        getTechDotColor(tech)
                                      )}
                                    />
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })()}
                    </TableCell>
                  )}
                  {resolvedVisibleColumns.responseTime && (
                    <TableCell className="text-sm">
                      {asset.responseTime || "-"}
                    </TableCell>
                  )}
                  {resolvedVisibleColumns.source && (
                    <TableCell className="text-sm">
                      {asset.source || "-"}
                    </TableCell>
                  )}
                  {resolvedVisibleColumns.createdAt && (
                    <TableCell className="text-xs">
                      {asset.createdAt?.toLocaleString?.() ?? "-"}
                    </TableCell>
                  )}
                  {resolvedVisibleColumns.updatedAt && (
                    <TableCell className="text-xs">
                      {asset.updatedAt?.toLocaleString?.() ?? "-"}
                    </TableCell>
                  )}
                  {resolvedVisibleColumns.lastSeenAt && (
                    <TableCell className="text-xs">
                      {asset.lastSeenAt?.toLocaleString?.() ?? "-"}
                    </TableCell>
                  )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-2 pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {(pagination.page - 1) * pagination.pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                {Math.min(
                  pagination.page * pagination.pageSize,
                  pagination.totalItems
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {pagination.totalItems.toLocaleString()}
              </span>{" "}
              results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                <ChevronLeftIcon className="size-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    let pageNum: number;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          pagination.page === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        className="w-9"
                        onClick={() => onPageChange?.(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
                <ChevronRightIcon className="size-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
