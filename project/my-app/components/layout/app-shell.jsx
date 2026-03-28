"use client";

import { useEffect } from "react";
import { HiMiniEnvelope } from "react-icons/hi2";
import { FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

import useAuthStore from "@/stores/auth-store";
import useUIStore from "@/stores/ui-store";
import AlertBanner from "@/components/ui/alert-banner";
import RightRail from "@/components/layout/right-rail";
import SideNav from "@/components/layout/side-nav";
import TopNav from "@/components/layout/top-nav";

export default function AppShell({ children }) {
  const initialize = useAuthStore((state) => state.initialize);
  const closeProfileMenu = useUIStore((state) => state.closeProfileMenu);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="min-h-screen">
      <AlertBanner />
      <TopNav />
      <SideNav mode="mobile" />

      <main className="px-3 pb-10 pt-4 sm:px-4 lg:px-6" onClick={closeProfileMenu}>
        <div className="mx-auto max-w-[90rem]">
          <div className="reddit-layout">
            <SideNav mode="desktop" />
            <div className="feed-column">{children}</div>
            <RightRail />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white/80 px-3 py-6 backdrop-blur sm:px-4 lg:px-6">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-slate-700">BubbleBlog</p>
            <p className="mt-1">A modern community feed built with Next.js.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://astitva-sharma.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:text-blue-700"
              aria-label="Contact"
              title="Contact"
            >
              <HiMiniEnvelope className="text-lg" />
            </a>
            <a
              href="https://x.com/astitvazz"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:text-blue-700"
              aria-label="X"
              title="X"
            >
              <FaXTwitter className="text-base" />
            </a>
            <a
              href="https://www.linkedin.com/in/astitva-sharma-012b4b252/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:text-blue-700"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <FaLinkedinIn className="text-base" />
            </a>
            <span>© 2026 BubbleBlog</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
