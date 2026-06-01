import * as React from "react";
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionCardHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ElementType;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Canonical header for a content section Card: a tinted, bordered band with a
 * compact (text-base) title, optional muted icon + description, and right-aligned
 * actions. Use this for every page-level section so headers stay consistent.
 */
export function SectionCardHeader({
  title,
  description,
  icon: Icon,
  actions,
  className,
}: SectionCardHeaderProps) {
  return (
    <CardHeader className={cn("border-b bg-muted/30 py-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-0.5">
          <CardTitle className="flex items-center gap-2 text-base">
            {Icon ? <Icon className="size-4 text-muted-foreground" /> : null}
            {title}
          </CardTitle>
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
    </CardHeader>
  );
}
