import { paths } from "../icon-paths";

export type IconName = keyof typeof paths;

interface IconProps {
  name: IconName;
  /** Core's own classes for it: its size (20px when none is given) and colour. What holds an icon can size it too, by its svg. */
  className?: string;
}

/** Static, trusted SVG path data; nothing user-controlled reaches innerHTML. */
export function Icon({ name, className = "size-5" }: IconProps) {
  return (
    <svg
      className={`block flex-none ${className}`}
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
