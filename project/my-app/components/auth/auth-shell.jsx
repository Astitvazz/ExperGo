import Link from "next/link";
import { HiMiniArrowLeft, HiMiniShieldCheck } from "react-icons/hi2";

export default function AuthShell({
  eyebrow,
  title,
  description,
  children,
  asideTitle,
  asideBody
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.08),_transparent_28%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <HiMiniArrowLeft className="text-base" />
            Back to feed
          </Link>
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 sm:inline-flex">
            <HiMiniShieldCheck className="text-base text-emerald-600" />
            Secure access
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="surface rounded-[2rem] p-6 sm:p-8 lg:p-10">
            <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              {eyebrow}
            </div>
            <h1 className="mt-4 max-w-xl text-4xl font-extrabold leading-tight text-slate-950 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-slate-600">
              {description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="surface-soft rounded-2xl p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  Why it feels better
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Cleaner spacing, calmer surfaces, and a tighter hierarchy that matches the new feed.
                </p>
              </div>
              <div className="surface-soft rounded-2xl p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  Flow
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Sign in, land in the feed, and move straight into reading or posting without visual context switching.
                </p>
              </div>
            </div>
          </section>

          <section className="surface rounded-[2rem] p-6 sm:p-8 lg:p-10">
            <div className="border-b border-slate-200 pb-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                {asideTitle}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{asideBody}</p>
            </div>
            <div className="pt-6">{children}</div>
          </section>
        </div>
      </div>
    </div>
  );
}
