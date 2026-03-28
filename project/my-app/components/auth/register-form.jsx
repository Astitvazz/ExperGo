"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  HiOutlineArrowRight,
  HiOutlineAtSymbol,
  HiOutlineIdentification,
  HiOutlineLockClosed
} from "react-icons/hi2";

import AuthShell from "@/components/auth/auth-shell";
import { api, getErrorMessage } from "@/lib/api";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setServerError("");
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.username.trim()) {
      nextErrors.username = "Username is required.";
    } else if (!/^[a-zA-Z0-9_]{3,16}$/.test(form.username)) {
      nextErrors.username = "Use 3-16 letters, numbers, or underscores.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    } else if (!/^\S{9,}$/.test(form.password)) {
      nextErrors.password = "Use at least 9 characters and no spaces.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/auth/register", form);
      router.push("/login");
    } catch (error) {
      const field = error?.response?.data?.field;

      if (field && ["username", "email"].includes(field)) {
        setErrors((current) => ({
          ...current,
          [field]: error.response.data.message
        }));
      } else {
        setServerError(getErrorMessage(error, "Registration failed."));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Join the room"
      title="Create your account and start posting with confidence."
      description="The register page now feels like part of the same product family as the feed, nav, and community surfaces."
      asideTitle="Why this matters"
      asideBody="The new form layout is cleaner, validation is easier to scan, and the overall page now feels much closer to a polished community app."
    >
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-5">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <HiOutlineIdentification className="text-base text-slate-500" />
            Username
          </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="pick_a_handle"
            className="input-shell"
          />
          {errors.username ? <p className="mt-2 text-sm text-red-600">{errors.username}</p> : null}
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <HiOutlineAtSymbol className="text-base text-slate-500" />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="input-shell"
          />
          {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email}</p> : null}
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <HiOutlineLockClosed className="text-base text-slate-500" />
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 9 characters"
            className="input-shell"
          />
          {errors.password ? <p className="mt-2 text-sm text-red-600">{errors.password}</p> : null}
        </div>

        {serverError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="primary-button mt-2 flex items-center gap-2 px-5 py-3.5 text-sm disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Create account"}
          {!submitting ? <HiOutlineArrowRight className="text-base" /> : null}
        </button>

        <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-700">
            Sign in
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
