"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  HiOutlineArrowUpTray,
  HiOutlineChatBubbleLeftRight,
  HiOutlineEllipsisHorizontal,
  HiOutlineHeart,
  HiOutlinePencilSquare,
  HiOutlineTrash
} from "react-icons/hi2";
import { HiHeart } from "react-icons/hi";

import { api, authHeaders, getErrorMessage } from "@/lib/api";
import { getDecodedToken, getToken } from "@/lib/auth";
import Avatar from "@/components/ui/avatar";
import ImageCarousel from "@/components/ui/image-carousel";
import useUIStore from "@/stores/ui-store";

export default function BlogCard({
  blog,
  detail = false,
  onUpdated,
  onDeleted
}) {
  const router = useRouter();
  const showAlert = useUIStore((state) => state.showAlert);
  const token = getToken();
  const decodedToken = useMemo(() => getDecodedToken(token), [token]);
  const userId = decodedToken?.id || null;
  const isOwner = Boolean(userId && userId === blog.author?._id);
  const [likes, setLikes] = useState(blog.likes || []);
  const [liked, setLiked] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLikes(blog.likes || []);
    setLiked(Boolean(userId && blog.likes?.includes(userId)));
  }, [blog, userId]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLike = async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await api.patch(
        `/blog/like/${blog._id}`,
        { liked },
        {
          headers: authHeaders(token)
        }
      );

      setLikes(response.data);
      setLiked((current) => !current);
    } catch (error) {
      showAlert({
        type: "error",
        title: "Could not update like",
        message: getErrorMessage(error, "Please try again in a moment.")
      });
    }
  };

  const handleDelete = async () => {
    if (!token || !isOwner) {
      return;
    }

    try {
      await api.delete(`/blog/${blog._id}`, {
        headers: authHeaders(token)
      });

      showAlert({
        type: "success",
        title: "Post deleted",
        message: "Your post has been removed."
      });

      if (onDeleted) {
        onDeleted(blog._id);
      }

      setConfirmDelete(false);

      if (detail) {
        router.push("/");
      }
    } catch (error) {
      showAlert({
        type: "error",
        title: "Delete failed",
        message: getErrorMessage(error, "Please try again.")
      });
    }
  };

  const handleShare = async () => {
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/blog/${blog._id}`
        : `/blog/${blog._id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: blog.title,
          text: blog.content?.slice(0, 120) || "Check out this post",
          url: shareUrl
        });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        showAlert({
          type: "success",
          title: "Link copied",
          message: "The post link is ready to paste."
        });
        return;
      }

      showAlert({
        type: "info",
        title: "Share this post",
        message: shareUrl
      });
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }

      showAlert({
        type: "error",
        title: "Share failed",
        message: "Please try copying the link again."
      });
    }
  };

  return (
    <>
      <article className="surface fade-up overflow-hidden rounded-2xl">
        <div className="min-w-0 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <Link
              href={`/profile/${blog.author?.username || "unknown"}`}
              className="flex min-w-0 items-center gap-3"
            >
              <Avatar
                src={blog.author?.avatar}
                alt={blog.author?.username || "Author"}
                label={blog.author?.username || "Author"}
                size="h-10 w-10"
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="truncate font-semibold text-slate-900">
                    {blog.author?.username || "Unknown author"}
                  </span>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              {isOwner ? (
                <>
                  <Link
                    href={`/blog/${blog._id}/edit`}
                    className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Edit post"
                  >
                    <HiOutlinePencilSquare className="text-xl" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="rounded-full p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete post"
                  >
                    <HiOutlineTrash className="text-xl" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                  <HiOutlineEllipsisHorizontal className="text-xl" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-3">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
                {blog.category || "General"}
              </span>
            </div>
            <Link href={`/blog/${blog._id}`}>
              <h2 className="text-xl font-bold leading-snug text-slate-950 transition hover:text-blue-700 sm:text-2xl">
                {blog.title}
              </h2>
            </Link>
            <p
              className={`mt-3 text-sm leading-7 text-slate-600 ${
                detail ? "" : "clamp-4"
              }`}
            >
              {blog.content}
            </p>
            {blog.link ? (
              <a
                href={blog.link}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex text-sm font-semibold text-blue-700 hover:underline"
              >
                Visit attached link
              </a>
            ) : null}
          </div>

          {blog.images?.length ? (
            <div className="mt-4">
              <ImageCarousel
                images={blog.images}
                compact={!detail}
                variant={detail ? "detail" : "feed"}
              />
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleLike}
              className="secondary-button gap-2 px-4 py-2 text-sm"
            >
              {liked ? (
                <HiHeart className="text-lg text-rose-600" />
              ) : (
                <HiOutlineHeart className="text-lg text-slate-500" />
              )}
              {likes.length}
            </button>

            <Link
              href={`/blog/${blog._id}`}
              className="secondary-button gap-2 px-4 py-2 text-sm"
            >
              <HiOutlineChatBubbleLeftRight className="text-lg text-slate-500" />
              {blog.comments?.length || 0}
            </Link>

            <button
              type="button"
              onClick={handleShare}
              className="secondary-button gap-2 px-4 py-2 text-sm"
            >
              <HiOutlineArrowUpTray className="text-lg text-slate-500" />
              Share
            </button>
          </div>
        </div>
      </article>

      {mounted && confirmDelete
        ? createPortal(
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/45 px-4">
              <div className="surface fade-up w-full max-w-md rounded-3xl p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-500">
                  Confirm deletion
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-slate-950">
                  Delete this post?
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  This action cannot be undone. Your post, likes, and comment
                  thread will no longer be visible.
                </p>
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="secondary-button px-4 py-2 text-sm"
                  >
                    Keep post
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Delete post
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
