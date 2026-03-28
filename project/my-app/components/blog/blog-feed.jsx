"use client";

import Link from "next/link";
import { useMemo, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HiCheck, HiChevronDown, HiOutlineSparkles, HiOutlineSquares2X2 } from "react-icons/hi2";

import { api, getErrorMessage } from "@/lib/api";
import BlogCard from "@/components/blog/blog-card";
import Loader from "@/components/ui/loader";
import useUIStore from "@/stores/ui-store";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "mostLiked", label: "Most liked" }
];

const WINDOW_OPTIONS = [
  { value: "all", label: "All time" },
  { value: "5d", label: "Last 5 days" },
  { value: "10d", label: "Last 10 days" }
];

export default function BlogFeed() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showAlert = useUIStore((state) => state.showAlert);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

  const sort = searchParams.get("sort") || "newest";
  const windowFilter = searchParams.get("window") || "all";
  const search = (searchParams.get("search") || "").trim().toLowerCase();

  useEffect(() => {
    let ignore = false;

    async function fetchBlogs() {
      try {
        const response = await api.get("/blog?draft=false");

        if (!ignore) {
          setBlogs(response.data);
        }
      } catch (error) {
        if (!ignore) {
          showAlert({
            type: "error",
            title: "Could not load stories",
            message: getErrorMessage(
              error,
              "Please confirm the backend API is running."
            )
          });
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchBlogs();

    return () => {
      ignore = true;
    };
  }, [showAlert]);

  const visibleBlogs = useMemo(() => {
    const now = Date.now();

    return [...blogs]
      .filter((blog) => {
        if (windowFilter === "all") {
          return true;
        }

        const days = windowFilter === "5d" ? 5 : 10;
        const createdAt = new Date(blog.createdAt).getTime();
        return now - createdAt <= days * 24 * 60 * 60 * 1000;
      })
      .filter((blog) => {
        if (!search) {
          return true;
        }

        const haystack = [
          blog.title,
          blog.content,
          blog.category,
          blog.author?.username,
          ...(blog.tags || [])
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(search);
      })
      .sort((left, right) => {
        if (sort === "oldest") {
          return new Date(left.createdAt) - new Date(right.createdAt);
        }

        if (sort === "mostLiked") {
          const likeDelta = (right.likes?.length || 0) - (left.likes?.length || 0);
          if (likeDelta !== 0) {
            return likeDelta;
          }
        }

        return new Date(right.createdAt) - new Date(left.createdAt);
      });
  }, [blogs, search, sort, windowFilter]);

  const updateQuery = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`/?${params.toString()}`);
    setOpenMenu(null);
  };

  const handleDelete = (blogId) => {
    setBlogs((current) => current.filter((blog) => blog._id !== blogId));
  };

  const handleUpdate = (updatedBlog) => {
    setBlogs((current) =>
      current.map((blog) => (blog._id === updatedBlog._id ? updatedBlog : blog))
    );
  };

  return (
    <section className="pb-6">
      <div className="surface relative z-30 mb-4 overflow-visible rounded-2xl p-4">
        <div className="fade-up flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                <HiOutlineSparkles className="text-sm" />
                Home
              </div>
              <h1 className="mt-3 text-2xl font-extrabold text-slate-950 sm:text-3xl">
                Modern community stories
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Browse posts, search the feed, and sort content like a Reddit-style stream.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700"
              >
                <HiOutlineSquares2X2 className="text-base" />
                Feed
              </button>
              <Link
                href="/create"
                className="inline-flex h-10 items-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Create
              </Link>
            </div>
          </div>

          <div className="relative z-40 flex flex-col gap-3 sm:flex-row">
            <FilterMenu
              label="Sort"
              value={SORT_OPTIONS.find((option) => option.value === sort)?.label || "Newest"}
              options={SORT_OPTIONS}
              selected={sort}
              open={openMenu === "sort"}
              onToggle={() => setOpenMenu((current) => (current === "sort" ? null : "sort"))}
              onSelect={(value) => updateQuery("sort", value)}
            />
            <FilterMenu
              label="Time range"
              value={WINDOW_OPTIONS.find((option) => option.value === windowFilter)?.label || "All time"}
              options={WINDOW_OPTIONS}
              selected={windowFilter}
              open={openMenu === "window"}
              onToggle={() => setOpenMenu((current) => (current === "window" ? null : "window"))}
              onSelect={(value) => updateQuery("window", value)}
            />
          </div>
        </div>
      </div>

      {loading ? <Loader label="Loading stories..." /> : null}

      {!loading && !visibleBlogs.length ? (
        <div className="surface mt-6 rounded-2xl px-8 py-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900">No stories found</h2>
          <p className="mt-3 text-slate-500">
            Try a different filter, time range, or search term.
          </p>
        </div>
      ) : null}

      <div className="relative z-10 flex flex-col gap-4">
        {visibleBlogs.map((blog) => (
          <BlogCard
            key={blog._id}
            blog={blog}
            onDeleted={handleDelete}
            onUpdated={handleUpdate}
          />
        ))}
      </div>
    </section>
  );
}

function FilterMenu({
  label,
  value,
  options,
  selected,
  open,
  onToggle,
  onSelect
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        onToggle();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [onToggle, open]);

  return (
    <div ref={menuRef} className="relative flex-1">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </span>
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold shadow-sm transition ${
          open
            ? "border-blue-300 bg-blue-50 text-blue-900 shadow-[0_12px_30px_rgba(37,99,235,0.14)]"
            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
        }`}
      >
        <span className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
            {label === "Sort" ? "S" : "T"}
          </span>
          {value}
        </span>
        <HiChevronDown
          className={`transition ${open ? "rotate-180 text-blue-600" : "text-slate-400"}`}
        />
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+0.6rem)] z-[80] w-full overflow-hidden rounded-3xl border border-slate-200 bg-white/98 p-2 shadow-[0_24px_60px_rgba(15,23,42,0.16)] backdrop-blur">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                selected === option.value
                  ? "bg-blue-50 text-blue-900"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="flex flex-col">
                <span>{option.label}</span>
                <span className="text-xs font-medium text-slate-400">
                  {label === "Sort"
                    ? option.value === "newest"
                      ? "Latest conversations first"
                      : option.value === "oldest"
                        ? "Start from the earliest posts"
                        : "Surface the most appreciated posts"
                    : option.value === "all"
                      ? "Show posts from the full archive"
                      : option.value === "5d"
                        ? "Hot posts from the last five days"
                        : "Wider recent window from the last ten days"}
                </span>
              </span>
              {selected === option.value ? <HiCheck className="text-blue-600" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
