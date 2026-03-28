"use client";

import { useEffect } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle
} from "react-icons/hi";

import useUIStore from "@/stores/ui-store";

const iconMap = {
  info: HiOutlineInformationCircle,
  success: HiOutlineCheckCircle,
  error: HiOutlineExclamationCircle
};

export default function AlertBanner() {
  const alert = useUIStore((state) => state.alert);
  const hideAlert = useUIStore((state) => state.hideAlert);

  useEffect(() => {
    if (!alert) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      hideAlert();
    }, alert.duration || 2800);

    return () => window.clearTimeout(timeout);
  }, [alert, hideAlert]);

  if (!alert) {
    return null;
  }

  const Icon = iconMap[alert.type] || HiOutlineInformationCircle;

  return (
    <div className="fixed right-4 top-4 z-[60] fade-up">
      <div className="panel-strong flex max-w-sm items-start gap-3 rounded-3xl px-4 py-4">
        <div className="mt-0.5 rounded-full bg-teal-50 p-2 text-teal-700">
          <Icon className="text-xl" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
          {alert.message ? (
            <p className="mt-1 text-sm text-slate-600">{alert.message}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={hideAlert}
          className="rounded-full px-2 py-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Dismiss alert"
        >
          x
        </button>
      </div>
    </div>
  );
}
