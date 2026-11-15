import { Collapsible } from "@base-ui/react/collapsible";
import { Link } from "react-router";
import { Icon } from "./Icon";

type Item = [label: string, url: string];

export function ExternalLink({ label, url }: { label: string; url: string }) {
  return url.startsWith("/") ? (
    <Link to={url}>{label}</Link>
  ) : (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}

export function SourceLinks({ items }: { items: Item[] }) {
  return (
    <Collapsible.Root className="mt-[23px] text-[13px] text-muted">
      <Collapsible.Trigger className="group/trigger flex min-h-8 w-max cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-sans text-[13px] font-extrabold text-primary">
        <Icon name="right" className="svg-icon size-3.5 group-data-panel-open/trigger:rotate-90" />
        Sources and maps
      </Collapsible.Trigger>
      <Collapsible.Panel hiddenUntilFound>
        <ul className="my-[1em] pl-[18px]">
          {items.map(([label, url]) => (
            <li key={url} className="[&_a]:text-inherit [&_a]:underline [&_a]:underline-offset-2">
              <ExternalLink label={label} url={url} />
            </li>
          ))}
        </ul>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
