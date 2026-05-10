"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                   TABLE                                    */
/* -------------------------------------------------------------------------- */

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn(
          "w-full caption-bottom text-sm border-separate border-spacing-0",
          className,
        )}
        {...props}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  HEADER                                    */
/* -------------------------------------------------------------------------- */

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "sticky top-0 z-10 bg-background/80 backdrop-blur border-b",
        className,
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                   BODY                                     */
/* -------------------------------------------------------------------------- */

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                  FOOTER                                   */
/* -------------------------------------------------------------------------- */

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("border-t bg-muted/40 font-medium", className)}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                   ROW                                      */
/* -------------------------------------------------------------------------- */

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        // stable + no layout shift
        "border-b border-border/40",
        "transition-colors duration-150",
        "hover:bg-muted/40",
        "data-[state=selected]:bg-muted/60",
        "data-[dragging=true]:opacity-80 data-[dragging=true]:shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                  HEAD                                      */
/* -------------------------------------------------------------------------- */

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-11 px-3 text-left align-middle font-medium",
        "text-muted-foreground whitespace-nowrap",
        "first:w-[34px] first:px-2", // 👈 DRAG COLUMN FIX
        "[&:has([role=checkbox])]:w-[34px] [&:has([role=checkbox])]:px-2",
        className,
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                  CELL                                      */
/* -------------------------------------------------------------------------- */

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "h-12 px-3 align-middle whitespace-nowrap",
        "text-foreground",
        "first:w-[34px] first:px-2", // 👈 drag col align
        "[&:has([role=checkbox])]:w-[34px] [&:has([role=checkbox])]:px-2",
        className,
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                 CAPTION                                    */
/* -------------------------------------------------------------------------- */

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-3 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
