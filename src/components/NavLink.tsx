import Link, { type LinkProps } from "next/link";

/** Avoid RSC prefetch — background prefetches exceed Cloudflare Worker CPU limits. */
export default function NavLink(props: LinkProps) {
  return <Link prefetch={false} {...props} />;
}
