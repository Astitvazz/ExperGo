"use client";

import Link from "next/link";
import {
  HiMiniFire,
  HiMiniNewspaper,
  HiMiniPlusSmall,
  HiMiniShieldCheck
} from "react-icons/hi2";

const topics = ["Engineering", "Design", "Startups", "Product", "AI", "Remote"];

export default function RightRail() {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 flex flex-col gap-4">
        <section className="surface rounded-2xl p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <HiMiniFire className="text-lg text-orange-500" />
            Trending
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {topics.map((topic) => (
              <button
                key={topic}
                type="button"
                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                {topic}
              </button>
            ))}
          </div>
        </section>

        <section className="surface rounded-2xl p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <HiMiniNewspaper className="text-lg text-blue-600" />
            Posting tips
          </div>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>Use direct titles instead of vague headlines.</li>
            <li>Break large paragraphs into shorter readable chunks.</li>
            <li>Attach images only when they strengthen the story.</li>
          </ul>
        </section>

        <section className="surface rounded-2xl p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <HiMiniShieldCheck className="text-lg text-emerald-600" />
            Community
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Thoughtful writing, useful links, and strong discussion beats noise.
          </p>
          <Link
            href="/create"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <HiMiniPlusSmall className="text-lg" />
            Create post
          </Link>
        </section>
      </div>
    </aside>
  );
}
