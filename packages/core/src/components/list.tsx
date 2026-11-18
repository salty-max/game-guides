import { Children, type ReactNode } from "react";

/** A labelled list of rows. With no rows it shows `empty` in their place. */
export function ItemList({ label, empty, children }: { label: string; empty?: string; children?: ReactNode }) {
  if (Children.toArray(children).length === 0) return empty ? <p className="my-2.5 text-14/sm text-muted">{empty}</p> : null;
  // role="list": Safari stops announcing a list as one once its bullets are removed, and the rows have none.
  return (
    <ul role="list" aria-label={label} className="m-0 grid list-none gap-2 p-0">
      {children}
    </ul>
  );
}

interface ItemRowProps {
  title: string;
  /** A second, quieter line: when it was linked, what it is. */
  detail?: string;
  /** Actions for this row, as buttons. Name each by what it acts on ("Unlink Max's iPhone"), since a list has many of them. */
  children?: ReactNode;
}

/** One row of an ItemList: what it is, and its actions at the end. */
export function ItemRow({ title, detail, children }: ItemRowProps) {
  return (
    <li className="flex items-center gap-3 rounded-control border border-line bg-surface px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <div className="text-14/sm font-bold wrap-break-word">{title}</div>
        {detail && <div className="text-13 font-semibold text-muted">{detail}</div>}
      </div>
      {children && <div className="flex shrink-0 flex-wrap justify-end gap-2">{children}</div>}
    </li>
  );
}
