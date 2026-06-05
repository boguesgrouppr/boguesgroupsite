import Link from "next/link";
import type { ComponentProps } from "react";

type NavLinkProps = ComponentProps<typeof Link>;

/** Avoid RSC prefetch — background prefetches exceed Cloudflare Worker CPU limits. */
export default function NavLink(props: NavLinkProps) {
  return <Link prefetch={false} {...props} />;
}
