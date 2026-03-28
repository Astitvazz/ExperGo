"use client";

import Link from "next/link";
import {
  HiMiniArrowTrendingUp,
  HiMiniHome,
  HiMiniMagnifyingGlass,
  HiMiniPlus,
  HiMiniEnvelope
} from "react-icons/hi2";

import useUIStore from "@/stores/ui-store";

const navItems = [
  { href: "/", label: "Home", icon: HiMiniHome },
  { href: "/create", label: "Create", icon: HiMiniPlus }
];

const futureItems = [
  { href: "/?sort=mostLiked&window=5d", label: "Trending", icon: HiMiniArrowTrendingUp, type: "link" },
  { href: "/?focusSearch=1", label: "Search", icon: HiMiniMagnifyingGlass, type: "link" },
  { href: "https://astitva-sharma.vercel.app", label: "Contact", icon: HiMiniEnvelope, type: "external" }
];

export default function SideNav({ mode = "both" }) {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const showMobile = mode === "both" || mode === "mobile";
  const showDesktop = mode === "both" || mode === "desktop";

  return (
    <>
      {showMobile && isSidebarOpen ? (
        <div className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm lg:hidden">
          <aside className="h-full w-[18rem] bg-white p-3 shadow-2xl">
            <NavContent closeSidebar={toggleSidebar} />
          </aside>
        </div>
      ) : null}

      {showDesktop ? (
        <aside className="hidden lg:block lg:sticky lg:top-24">
          <NavContent />
        </aside>
      ) : null}
    </>
  );
}

function NavContent({ closeSidebar }) {
  return (
    <div className="surface rounded-2xl p-3">
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={closeSidebar}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <Icon className="text-xl text-slate-500" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 border-t border-slate-200 pt-4">
        <p className="px-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
          Discover
        </p>
        <div className="mt-2 flex flex-col gap-1">
          {futureItems.map((item) => {
            const Icon = item.icon;

            if (item.type === "link") {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeSidebar}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                >
                  <Icon className="text-xl text-slate-500" />
                  {item.label}
                </Link>
              );
            }

            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                onClick={closeSidebar}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                <Icon className="text-xl text-slate-500" />
                {item.label}
              </a>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">Home feed</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Search opens the top bar input and Trending leads to the most liked posts from the last 5 days.
        </p>
      </div>
    </div>
  );
}
