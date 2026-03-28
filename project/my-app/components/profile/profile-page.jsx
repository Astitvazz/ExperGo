"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineDocumentText,
  HiOutlinePencilSquare,
  HiOutlineSparkles,
  HiOutlineUserGroup
} from "react-icons/hi2";

import { api, authHeaders, getErrorMessage } from "@/lib/api";
import { getDecodedToken, getToken } from "@/lib/auth";
import BlogCard from "@/components/blog/blog-card";
import Avatar from "@/components/ui/avatar";
import Loader from "@/components/ui/loader";
import useUIStore from "@/stores/ui-store";

export default function ProfilePageClient({ username }) {
  const router = useRouter();
  const showAlert = useUIStore((state) => state.showAlert);
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState("published");
  const [loading, setLoading] = useState(true);
  const token = getToken();
  const decodedToken = getDecodedToken(token);

  useEffect(() => {
    let ignore = false;

    async function fetchProfile() {
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const userResponse = await api.get(`/user/${username}`, {
          headers: authHeaders(token)
        });

        const fetchedUser = userResponse.data;

        if (!ignore) {
          setUser(fetchedUser);
        }

        const blogsResponse = await api.get(`/blog/user/${fetchedUser._id}`, {
          headers: authHeaders(token)
        });

        if (!ignore) {
          setBlogs(blogsResponse.data);
        }
      } catch (error) {
        if (!ignore) {
          showAlert({
            type: "error",
            title: "Could not load profile",
            message: getErrorMessage(
              error,
              "You may need to sign in again."
            )
          });
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      ignore = true;
    };
  }, [router, showAlert, token, username]);

  const isOwner = Boolean(decodedToken?.id && decodedToken.id === user?._id);

  const publishedBlogs = useMemo(
    () => blogs.filter((blog) => !blog.draft),
    [blogs]
  );
  const draftBlogs = useMemo(
    () => blogs.filter((blog) => blog.draft),
    [blogs]
  );
  const visibleBlogs = activeTab === "published" ? publishedBlogs : draftBlogs;

  const handleDelete = (blogId) => {
    setBlogs((current) => current.filter((blog) => blog._id !== blogId));
  };

  const handleUpdate = (updatedBlog) => {
    setBlogs((current) =>
      current.map((blog) => (blog._id === updatedBlog._id ? updatedBlog : blog))
    );
  };

  if (loading) {
    return <Loader label="Loading profile..." />;
  }

  if (!user) {
    return (
      <div className="surface rounded-2xl px-8 py-12 text-center">
        <h2 className="text-3xl font-bold text-slate-900">Profile unavailable</h2>
        <p className="mt-3 text-slate-500">
          We could not fetch this user from the API.
        </p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="surface overflow-hidden rounded-2xl">
        <div className="h-28 bg-[linear-gradient(135deg,#2563eb_0%,#3b82f6_45%,#f97316_100%)] sm:h-36" />

        <div className="px-4 pb-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="-mt-10 sm:-mt-12">
                <Avatar
                  src={user.avatar}
                  alt={user.username}
                  label={user.username}
                  size="h-20 w-20 sm:h-24 sm:w-24"
                />
              </div>

              <div className="sm:pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-slate-950 sm:text-3xl">
                    u/{user.username}
                  </h1>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
                    Creator
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                  {user.bio ||
                    "No bio yet. This profile now follows the same cleaner community layout as the main feed."}
                </p>
              </div>
            </div>

            {isOwner ? (
              <Link
                href={`/profile/${username}/edit`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <HiOutlinePencilSquare className="text-base" />
                Edit profile
              </Link>
            ) : null}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <StatCard
              icon={<HiOutlineDocumentText className="text-base text-blue-600" />}
              label="Total posts"
              value={blogs.length}
            />
            <StatCard
              icon={<HiOutlineSparkles className="text-base text-emerald-600" />}
              label="Published"
              value={publishedBlogs.length}
            />
            <StatCard
              icon={<HiOutlineUserGroup className="text-base text-orange-500" />}
              label="Drafts"
              value={draftBlogs.length}
            />
          </div>
        </div>
      </div>

      <div className="surface rounded-2xl p-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("published")}
            className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              activeTab === "published"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Published
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("drafts")}
            className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              activeTab === "drafts"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Drafts
          </button>
        </div>
      </div>

      {!visibleBlogs.length ? (
        <div className="surface rounded-2xl px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            {activeTab === "published"
              ? "No published posts yet"
              : "No drafts yet"}
          </h2>
          <p className="mt-3 text-slate-500">
            {activeTab === "published"
              ? "Publishing from the composer will bring this profile to life."
              : "Saved drafts will show up here once they are created."}
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        {visibleBlogs.map((blog) => (
          <BlogCard
            key={blog._id}
            blog={{
              ...blog,
              author:
                typeof blog.author === "object" && blog.author !== null
                  ? blog.author
                  : user
            }}
            onDeleted={handleDelete}
            onUpdated={handleUpdate}
          />
        ))}
      </div>
    </section>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="surface-soft rounded-2xl px-4 py-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-2xl font-extrabold text-slate-950">{value}</p>
    </div>
  );
}
