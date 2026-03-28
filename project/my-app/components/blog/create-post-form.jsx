"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineDocumentText,
  HiOutlineLink,
  HiOutlinePhoto
} from "react-icons/hi2";

import { api, authHeaders, getErrorMessage } from "@/lib/api";
import { getToken } from "@/lib/auth";
import ImageCarousel from "@/components/ui/image-carousel";
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

const tabs = [
  { key: "content", label: "Story", icon: HiOutlineDocumentText },
  { key: "images", label: "Media", icon: HiOutlinePhoto },
  { key: "link", label: "Link", icon: HiOutlineLink }
];

export default function CreatePostForm() {
  const router = useRouter();
  const showAlert = useUIStore((state) => state.showAlert);
  const [activeTab, setActiveTab] = useState("content");
  const [submitting, setSubmitting] = useState(false);
  const [text, setText] = useState({
    title: "",
    content: "",
    link: "",
    category: "General"
  });
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const token = getToken();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [router, token]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const readyToPublish = useMemo(
    () => Boolean(text.title.trim() && text.content.trim()),
    [text.content, text.title]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setText((current) => ({
      ...current,
      [name]: value
    }));

    setErrors((current) => ({
      ...current,
      [name]: ""
    }));
  };

  const handleFileUpload = (event) => {
    const nextFiles = Array.from(event.target.files || []);
    const nextPreviewUrls = nextFiles.map((file) => URL.createObjectURL(file));

    setFiles((current) => [...current, ...nextFiles]);
    setPreviewUrls((current) => [...current, ...nextPreviewUrls]);
  };

  const validate = () => {
    const nextErrors = {};

    if (!text.title.trim()) {
      nextErrors.title =
        "A title helps people understand what your story is about.";
    }

    if (!text.content.trim()) {
      nextErrors.content = "Add some body copy before publishing.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (draft) => {
    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", text.title);
      formData.append("content", text.content);
      formData.append("link", text.link);
      formData.append("category", text.category);
      formData.append("draft", String(draft));

      files.forEach((file) => {
        formData.append("images", file);
      });

      await api.post("/blog", formData, {
        headers: {
          ...authHeaders(token),
          "Content-Type": "multipart/form-data"
        }
      });

      showAlert({
        type: "success",
        title: draft ? "Draft saved" : "Story published",
        message: draft
          ? "Your draft is in the system and ready for later edits."
          : "Your story is live on the feed."
      });

      router.push("/");
      router.refresh();
    } catch (error) {
      showAlert({
        type: "error",
        title: "Publish failed",
        message: getErrorMessage(
          error,
          "Check the backend upload configuration and try again."
        )
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="panel overflow-hidden rounded-[2.25rem] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
          Compose
        </p>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-heading text-4xl text-slate-950 md:text-5xl">
              Shape a story people want to finish.
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
              The new composer is cleaner, less cramped, and easier to expand
              with richer publishing controls later.
            </p>
          </div>
          <div className="panel-strong rounded-[1.5rem] px-5 py-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              Status
            </p>
            <p
              className={`mt-2 text-sm font-semibold ${
                readyToPublish ? "text-emerald-700" : "text-amber-700"
              }`}
            >
              {readyToPublish
                ? "Ready to publish"
                : "Add a title and body to continue"}
            </p>
          </div>
        </div>
      </div>

      <div className="panel-strong overflow-hidden rounded-[2rem]">
        <div className="flex flex-wrap gap-2 border-b border-stone-200 p-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition ${
                  activeTab === tab.key
                    ? "bg-teal-600 text-white"
                    : "bg-stone-100 text-slate-600 hover:bg-stone-200"
                }`}
              >
                <Icon className="text-lg" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.3fr_0.7fr] lg:p-8">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Title
              </label>
              <input
                name="title"
                value={text.title}
                onChange={handleChange}
                placeholder="A title with some gravity"
                className="input-shell"
              />
              {errors.title ? (
                <p className="mt-2 text-sm text-red-600">{errors.title}</p>
              ) : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Category
              </label>
              <select
                name="category"
                value={text.category}
                onChange={handleChange}
                className="input-shell"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {activeTab === "content" ? (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Story
                </label>
                <textarea
                  name="content"
                  value={text.content}
                  onChange={handleChange}
                  rows={14}
                  placeholder="Write what happened, what you learned, or what deserves attention."
                  className="input-shell min-h-[18rem] resize-y"
                />
                {errors.content ? (
                  <p className="mt-2 text-sm text-red-600">{errors.content}</p>
                ) : null}
              </div>
            ) : null}

            {activeTab === "images" ? (
              <div className="space-y-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Media
                </label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-stone-300 bg-stone-50 px-6 py-14 text-center transition hover:border-teal-500 hover:bg-teal-50/50">
                  <span className="rounded-full bg-white p-4 shadow-sm">
                    <HiOutlinePhoto className="text-2xl text-teal-700" />
                  </span>
                  <span className="mt-4 text-lg font-semibold text-slate-900">
                    Upload images for the story
                  </span>
                  <span className="mt-2 text-sm text-slate-500">
                    Click to browse and we'll show the preview instantly.
                  </span>
                  <input type="file" multiple hidden onChange={handleFileUpload} />
                </label>

                {previewUrls.length ? (
                  <ImageCarousel images={previewUrls} variant="detail" />
                ) : null}
              </div>
            ) : null}

            {activeTab === "link" ? (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  External link
                </label>
                <input
                  name="link"
                  type="url"
                  value={text.link}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="input-shell"
                />
                <p className="mt-2 text-sm text-slate-500">
                  Attach a reference, article, video, or source material.
                </p>
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.75rem] bg-stone-50 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Writing cues
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>Lead with the moment that matters most.</li>
                <li>Keep paragraphs shorter for better mobile reading.</li>
                <li>
                  Use the link tab when a source adds trust or context.
                </li>
              </ul>
            </div>

            <div className="rounded-[1.75rem] bg-teal-950 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.24em] text-teal-200">
                Publishing flow
              </p>
              <p className="mt-3 text-sm leading-7 text-teal-50">
                Drafts stay private. Published stories land immediately in the
                public feed that now runs through Next.js.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-stone-200 p-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={submitting}
            className="secondary-button px-5 py-3 text-sm disabled:opacity-60"
          >
            Save draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={!readyToPublish || submitting}
            className="primary-button px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Publishing..." : "Publish story"}
          </button>
        </div>
      </div>
    </section>
  );
}
