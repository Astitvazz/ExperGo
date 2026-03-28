"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { api, authHeaders, getErrorMessage } from "@/lib/api";
import { getToken } from "@/lib/auth";
import BlogCard from "@/components/blog/blog-card";
import CommentCard from "@/components/blog/comment-card";
import Loader from "@/components/ui/loader";
import useUIStore from "@/stores/ui-store";

export default function BlogDetail({ id }) {
  const router = useRouter();
  const showAlert = useUIStore((state) => state.showAlert);
  const [blog, setBlog] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const token = getToken();

  useEffect(() => {
    let ignore = false;

    async function fetchBlog() {
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await api.get(`/blog/${id}`, {
          headers: authHeaders(token)
        });

        if (!ignore) {
          setBlog(response.data);
        }
      } catch (error) {
        if (!ignore) {
          showAlert({
            type: "error",
            title: "Could not open this story",
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

    fetchBlog();

    return () => {
      ignore = true;
    };
  }, [id, router, showAlert, token]);

  const commentTree = useMemo(() => {
    const byParent = new Map();
    const comments = blog?.comments || [];

    comments.forEach((comment) => {
      const parentId = comment.parentComment?._id || comment.parentComment || "root";
      const bucket = byParent.get(parentId) || [];
      bucket.push({ ...comment, children: [] });
      byParent.set(parentId, bucket);
    });

    const attachChildren = (items) =>
      items.map((item) => ({
        ...item,
        children: attachChildren(byParent.get(item._id) || [])
      }));

    return attachChildren(byParent.get("root") || []);
  }, [blog]);

  const refreshBlog = async () => {
    const refreshedBlog = await api.get(`/blog/${id}`, {
      headers: authHeaders(token)
    });

    setBlog(refreshedBlog.data);
  };

  const handleSubmit = async (parentComment = null, nextContent = content) => {
    if (!nextContent.trim()) {
      return;
    }

    try {
      await api.post(
        `/blog/comment/${id}`,
        { content: nextContent, parentComment },
        {
          headers: authHeaders(token)
        }
      );

      if (!parentComment) {
        setContent("");
      }

      showAlert({
        type: "success",
        title: parentComment ? "Reply posted" : "Comment posted",
        message: "Your reply has been added to the conversation."
      });

      await refreshBlog();
    } catch (error) {
      showAlert({
        type: "error",
        title: "Comment failed",
        message: getErrorMessage(error, "Please try again.")
      });
    }
  };

  if (loading) {
    return <Loader label="Opening story..." />;
  }

  if (!blog) {
    return (
      <div className="surface rounded-2xl px-8 py-12 text-center">
        <h2 className="text-3xl font-bold text-slate-900">Story unavailable</h2>
        <p className="mt-3 text-slate-500">
          We could not load this post from the API.
        </p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <BlogCard
        blog={blog}
        detail
        onUpdated={(updatedBlog) => setBlog((current) => ({
          ...current,
          ...updatedBlog
        }))}
        onDeleted={() => router.push("/")}
      />

      <div className="surface rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Discussion
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">Comments</h2>
          </div>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
            {blog.comments?.length || 0} replies
          </span>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={4}
            placeholder="Write a thoughtful reply..."
            className="input-shell min-h-32 resize-none border-0 bg-white"
          />
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!content.trim()}
              className="primary-button px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Post comment
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {commentTree.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              childrenComments={comment.children}
              onReply={handleSubmit}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
