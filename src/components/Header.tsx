"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import NavLink from "@/components/NavLink";
import { usePathname } from "next/navigation";

interface DropdownItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  dropdown?: DropdownItem[];
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/case-studies" },
  { label: "Insights", href: "/blog" },
  { label: "Speakers", href: "/speaker-roster" },
  { label: "Brand Builder Hub", href: "/small-business-hub" },
  {
    label: "About",
    href: "#",
    dropdown: [
      { label: "About Us", href: "/about" },
      { label: "Meet the Founder", href: "/meet-the-founder" },
      { label: "Press Room", href: "/press-room" },
      { label: "Testimonials", href: "/testimonials" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

function DesktopDropdown({
  item,
  isOpen,
  isActive,
  isPathActive,
  onToggle,
  onClose,
}: {
  item: NavItem;
  isOpen: boolean;
  isActive: boolean;
  isPathActive: (href: string) => boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        if (isOpen) onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`flex items-center gap-1 transition-colors text-sm font-medium tracking-wide uppercase ${
          isActive ? "text-gold" : "text-white/90 hover:text-gold"
        }`}
      >
        {item.label}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`absolute top-full left-0 mt-2 w-52 bg-white rounded shadow-lg border border-gray-100 py-2 z-50 transition-all duration-200 origin-top ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
        }`}
      >
        {item.dropdown!.map((sub) => (
          <NavLink
            key={sub.href}
            href={sub.href}
            className={`block px-4 py-2.5 text-sm transition-colors ${
              isPathActive(sub.href)
                ? "bg-navy/5 text-navy font-semibold"
                : "text-body hover:bg-navy/5 hover:text-navy"
            }`}
            onClick={() => onClose()}
            tabIndex={isOpen ? 0 : -1}
          >
            {sub.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const isPathActive = useCallback(
    (href: string) => {
      if (!href || href === "#") return false;
      if (href === "/") return pathname === "/";
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname]
  );

  const isItemActive = useCallback(
    (item: NavItem) => {
      if (item.dropdown?.length) {
        return item.dropdown.some((sub) => isPathActive(sub.href));
      }
      return isPathActive(item.href);
    },
    [isPathActive]
  );

  const toggleDropdown = useCallback((label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  }, []);

  const closeDropdown = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  function toggleMobileExpanded(label: string) {
    setMobileExpanded(mobileExpanded === label ? null : label);
  }

  // Close mobile menu on Escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileOpen]);

  return (
    <header className="bg-navy sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <NavLink href="/" className="shrink-0">
            <img
              src="/logo.png"
              alt="Bogues Group"
              className="h-14 w-auto"
            />
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map((item) =>
              item.dropdown ? (
                <DesktopDropdown
                  key={item.label}
                  item={item}
                  isOpen={openDropdown === item.label}
                  isActive={isItemActive(item)}
                  isPathActive={isPathActive}
                  onToggle={() => toggleDropdown(item.label)}
                  onClose={closeDropdown}
                />
              ) : (
                <NavLink
                  key={item.label}
                  href={item.href}
                  className={`transition-colors text-sm font-medium tracking-wide uppercase ${
                    isItemActive(item) ? "text-gold" : "text-white/90 hover:text-gold"
                  }`}
                >
                  {item.label}
                </NavLink>
              )
            )}
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-white p-2 -mr-2"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden bg-navy-dark border-t border-white/10 overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className={`transition-all duration-300 ease-out ${
                mobileOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`}
            >
              {item.dropdown ? (
                <>
                  <button
                    onClick={() => toggleMobileExpanded(item.label)}
                    aria-expanded={mobileExpanded === item.label}
                    className={`flex items-center justify-between w-full py-3 text-sm font-medium tracking-wide uppercase ${
                      isItemActive(item) ? "text-gold" : "text-white/90"
                    }`}
                  >
                    {item.label}
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        mobileExpanded === item.label ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div
                    className={`pl-4 space-y-1 overflow-hidden transition-all duration-200 ease-in-out ${
                      mobileExpanded === item.label
                        ? "max-h-60 opacity-100 pb-2"
                        : "max-h-0 opacity-0 pb-0"
                    }`}
                  >
                    {item.dropdown.map((sub) => (
                      <NavLink
                        key={sub.href}
                        href={sub.href}
                        className={`block py-2 text-sm transition-colors ${
                          isPathActive(sub.href)
                            ? "text-gold font-semibold"
                            : "text-gold-light hover:text-gold"
                        }`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                </>
              ) : (
                <NavLink
                  href={item.href}
                  className={`block py-3 text-sm font-medium tracking-wide uppercase ${
                    isItemActive(item) ? "text-gold" : "text-white/90"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </NavLink>
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}
