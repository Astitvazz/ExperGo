"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiOutlineArrowLeft } from "react-icons/hi2";

import { api, authHeaders, getErrorMessage } from "@/lib/api";
import { getDecodedToken, getToken } from "@/lib/auth";
import Loader from "@/components/ui/loader";
import useUIStore from "@/stores/ui-store";

const categories = [
  "General",
  "Technology",
  "Design",
  "Programming",
  "Startups",
  "Productivity",
  "Lifestyle",
  "News"
];

export default function EditPostPage({ id }) {
  const router = useRouter();
  const showAlert = useUIStore((state) => state.showAlert);
  const token = getToken();
  const decodedToken = getDecodedToken(token);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    link: "",
    category: "General"
  });

  useEffect(() => {
    let ignore = false;

    async function loadPost() {
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await api.get(`/blog/${id}`, {
          headers: authHeaders(token)
        });

        if (!ignore) {
          setPost(response.data);
          setForm({
            title: response.data.title || "",
            content: response.data.content || "",
            link: response.data.link || "",
            category: response.data.category || "General"
          });
        }
      } catch (error) {
        if (!ignore) {
          showAlert({
            type: "error",
            title: "Could not load post",
            message: getErrorMessage(error, "Please try again.")
          });
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadPost();

    return () => {
      ignore = true;
    };
  }, [id, router, showAlert, token]);

  if (loading) {
    return <Loader label="Loading post editor..." />;
  }

  if (!post || decodedToken?.id !== post.author?._id) {
    return (
      <div className="surface rounded-2xl px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-slate-900">You can't edit this post</h2>
        <p className="mt-3 text-slate-500">Only the author can edit this post.</p>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);

    try {
      await api.patch(`/blog/${id}`, form, {
        headers: authHeaders(token)
      });

      showAlert({
        type: "success",
        title: "Post updated",
        message: "Your changes are now live."
      });

      router.push(`/blog/${id}`);
      router.refresh();
    } catch (error) {
      showAlert({
        type: "error",
        title: "Save failed",
        message: getErrorMessage(error, "Please try again.")
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Link
          href={`/blog/${id}`}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <HiOutlineArrowLeft className="text-base" />
          Back to post
        </Link>
      </div>

      <div className="surface rounded-2xl p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Edit post</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-950">Refine your post</h1>
        <p className="mt-2 text-sm text-slate-500">
          Update the title, content, or link for this post.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Category</label>
            <select
              value={form.category}
              onChange={(event) =>
                setForm((current) => ({ ...current, category: event.target.value }))
              }
              className="input-shell"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Title</label>
            <input
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              className="input-shell"
              placeholder="Title"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Content</label>
            <textarea
              value={form.content}
              onChange={(event) =>
                setForm((current) => ({ ...current, content: event.target.value }))
              }
              rows={10}
              className="input-shell resize-y"
              placeholder="Update your post"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Link</label>
            <input
              value={form.link}
              onChange={(event) =>
                setForm((current) => ({ ...current, link: event.target.value }))
              }
              className="input-shell"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Link href={`/blog/${id}`} className="secondary-button px-4 py-2 text-sm">
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="primary-button px-4 py-2 text-sm disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save post"}
          </button>
        </div>
      </div>
    </section>
  );
}
