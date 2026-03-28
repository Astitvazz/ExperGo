"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  HiBars3BottomLeft,
  HiMagnifyingGlass,
  HiOutlinePlus,
  HiOutlineSparkles
} from "react-icons/hi2";

import { api, authHeaders } from "@/lib/api";
import useAuthStore from "@/stores/auth-store";
import useUIStore from "@/stores/ui-store";
import Avatar from "@/components/ui/avatar";
import ProfileMenu from "@/components/layout/profile-menu";

export default function TopNav() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchInputRef = useRef(null);
  const token = useAuthStore((state) => state.token);
  const hydrated = useAuthStore((state) => state.hydrated);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const toggleProfileMenu = useUIStore((state) => state.toggleProfileMenu);
  const closeProfileMenu = useUIStore((state) => state.closeProfileMenu);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setSearchValue(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const trimmed = searchValue.trim();
    const currentSearch = searchParams.get("search") || "";

    if (trimmed === currentSearch) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      const nextParams = new URLSearchParams(searchParams.toString());

      if (trimmed) {
        nextParams.set("search", trimmed);
      } else {
        nextParams.delete("search");
      }

      router.replace(nextParams.toString() ? `/?${nextParams.toString()}` : "/", {
        scroll: false
      });
    }, 220);

    return () => clearTimeout(timeoutId);
  }, [router, searchParams, searchValue]);

  useEffect(() => {
    if (searchParams.get("focusSearch") === "1" && searchInputRef.current) {
      searchInputRef.current.focus();
      const params = new URLSearchParams(searchParams.toString());
      params.delete("focusSearch");
      router.replace(params.toString() ? `/?${params.toString()}` : "/", { scroll: false });
    }
  }, [router, searchParams]);

  useEffect(() => {
    let ignore = false;

    async function fetchCurrentUser() {
      if (!token) {
        setCurrentUser(null);
        return;
      }

      try {
        const response = await api.get("/user/me", {
          headers: authHeaders(token)
        });

        if (!ignore) {
          setCurrentUser(response.data);
        }
      } catch {
        if (!ignore) {
          setCurrentUser(null);
        }
      }
    }

    fetchCurrentUser();

    return () => {
      ignore = true;
    };
  }, [token]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextParams = new URLSearchParams(searchParams.toString());

    if (searchValue.trim()) {
      nextParams.set("search", searchValue.trim());
    } else {
      nextParams.delete("search");
    }

    router.push(nextParams.toString() ? `/?${nextParams.toString()}` : "/");
  };

  return (
    <header className="top-shell sticky top-0 z-40">
      <div className="mx-auto flex max-w-[90rem] items-center gap-3 px-3 py-3 sm:px-4 lg:px-6">
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <HiBars3BottomLeft className="text-xl" />
        </button>

        <Link href="/" className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-black text-white">
              b
            </div>
            <div>
              <p className="text-xl font-extrabold leading-none text-slate-900">BubbleBlog</p>
              <p className="text-xs text-slate-500">Community feed</p>
            </div>
          </div>
        </Link>

        <form onSubmit={handleSubmit} className="hidden flex-1 md:block">
          <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-full border border-slate-200 bg-slate-100 px-4 py-2.5">
            <HiMagnifyingGlass className="text-lg text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search posts, writers, and topics"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
              aria-label="Search"
            >
              <HiOutlineSparkles className="text-lg" />
            </button>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/?focusSearch=1")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 md:hidden"
            aria-label="Search"
          >
            <HiMagnifyingGlass className="text-xl" />
          </button>
          <Link
            href="/create"
            className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:inline-flex"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
              <HiOutlinePlus className="text-base" />
            </span>
            New post
          </Link>

          <div className="relative">
            {hydrated && token ? (
              <button
                type="button"
                onClick={toggleProfileMenu}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:bg-slate-50"
                aria-label="Open profile menu"
              >
                <div className="relative">
                  <Avatar
                    src={currentUser?.avatar}
                    alt={currentUser?.username || "Profile"}
                    label={currentUser?.username || "User"}
                    size="h-8 w-8"
                  />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white bg-emerald-500" />
                </div>
              </button>
            ) : (
              <Link
                href="/login"
                onClick={closeProfileMenu}
                className="primary-button px-5 py-3 text-sm"
              >
                Sign in
              </Link>
            )}

            <ProfileMenu username={currentUser?.username} />
          </div>
        </div>
      </div>
    </header>
  );
}
