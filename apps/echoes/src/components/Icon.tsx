const paths = {
    compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z"/>',
    book:'<path d="M4 19V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0 0 4h14M8 8h8m-8 4h6" transform="translate(0 -1)"/>',
    checkList:'<path d="m3 6 2 2 3-4m-5 9 2 2 3-4m-5 9 2 2 3-4M11 6h10m-10 7h10m-10 7h10"/>',
    chart:'<path d="M4 4v16h16M8 16v-4m5 4V8m5 8v-6"/>',
    lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3m-4 4v3"/>',
    unlock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 7.6-1.8M12 14v3"/>',
    pin:'<path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    heart:'<path d="M20.8 8.6c0 4.7-8.8 10.2-8.8 10.2S3.2 13.3 3.2 8.6A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.8 2.2Z"/>',
    chest:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 11h18m-11 0v4h4v-4M6 6v5m12-5v5"/>',
    sword:'<path d="m14.5 17.5-8-8M3 21l5-5m-3-3 6 6m-.5-7L19 4l2-1-1 2-8.5 8.5"/>',
    star:'<path d="m12 3 2.6 5.5 6.1.8-4.4 4.3 1 6.1-5.3-2.9-5.4 2.9 1.1-6.1-4.4-4.3 6.1-.8L12 3Z"/>',
    flask:'<path d="M9 3h6m-5 0v7l-5 7c-1.4 2 .1 4 2 4h10c2 0 3.4-2 2-4l-5-7V3M8 15h8"/>',
    gem:'<path d="M4 9 8 4h8l4 5-8 11L4 9Zm0 0h16M8 4l4 16 4-16"/>',
    scroll:'<path d="M7 4h11a2 2 0 0 1 0 4h-2v10a2 2 0 0 1-2 2H6a2 2 0 0 1 0-4h2V6a2 2 0 0 1 2-2m0 6h4m-4 3h4"/>',
    dice:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 8h.01m8 0h.01m-4 4h.01m-4 4h.01m8 0h.01" stroke-width="2.4"/>',
    shirt:'<path d="m8 4-5 3 2 5 3-1v9h8v-9l3 1 2-5-5-3a4 4 0 0 1-8 0Z"/>',
    down:'<path d="m6 9 6 6 6-6"/>',
    right:'<path d="m9 6 6 6-6 6"/>',
    left:'<path d="m15 6-6 6 6 6"/>',
    arrow:'<path d="M3 12h17m-6-6 6 6-6 6"/>',
    play:'<path d="m8 5 11 7-11 7V5Z"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    x:'<path d="m6 6 12 12M18 6 6 18"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    moon:'<path d="M20.8 14.1A9 9 0 0 1 9.9 3.2a9 9 0 1 0 10.9 10.9Z"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',
    tri:'<path d="M12 3 21 19H3L12 3Z"/><path d="m12 10 3.2 5.5H8.8L12 10Z"/>',
    stamp:'<path d="M9 3h6v6l3 4v2H6v-2l3-4V3ZM5 21h14"/>',
    ribbon:'<circle cx="12" cy="9" r="5"/><path d="m9 13-2 8 5-3 5 3-2-8"/>',
    gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',
    arrowUp:'<path d="M12 20V4m-6 6 6-6 6 6"/>',
    flag:'<path d="M5 21V4m0 1h12l-2 4 2 4H5"/>'
} as const;

export type IconName = keyof typeof paths;

interface IconProps {
  name: IconName;
  className?: string;
}

/** Static, trusted SVG path data; nothing user-controlled reaches innerHTML. */
export function Icon({ name, className = "svg-icon" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: paths[name] }}
    />
  );
}
