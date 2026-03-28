"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import useAuthStore from "@/stores/auth-store";
import useUIStore from "@/stores/ui-store";

export default function ProfileMenu({ username }) {
  const router = useRouter();
  const isOpen = useUIStore((state) => state.isProfileMenuOpen);
  const closeProfileMenu = useUIStore((state) => state.closeProfileMenu);
  const logout = useAuthStore((state) => state.logout);

  if (!isOpen) {
    return null;
  }

  const handleLogout = () => {
    logout();
    closeProfileMenu();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-56 fade-up">
      <div className="surface rounded-2xl p-2">
        <Link
          href={username ? `/profile/${username}` : "/"}
          onClick={closeProfileMenu}
          className="flex items-center rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          View profile
        </Link>
        {username ? (
          <Link
            href={`/profile/${username}/edit`}
            onClick={closeProfileMenu}
            className="flex items-center rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Edit profile
          </Link>
        ) : null}
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
