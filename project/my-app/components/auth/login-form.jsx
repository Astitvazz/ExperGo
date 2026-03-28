"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlineArrowRight, HiOutlineIdentification, HiOutlineLockClosed } from "react-icons/hi2";

import AuthShell from "@/components/auth/auth-shell";
import { api, getErrorMessage } from "@/lib/api";
import useAuthStore from "@/stores/auth-store";

export default function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const initialize = useAuthStore((state) => state.initialize);
  const token = useAuthStore((state) => state.token);
  const [form, setForm] = useState({
    username: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [router, token]);

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
      const response = await api.post("/auth/login", form);
      login(response.data.token);
      router.push("/");
      router.refresh();
    } catch (error) {
      setServerError(getErrorMessage(error, "Login failed."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in and jump back into the conversation."
      description="The auth experience now uses the same modern product language as the feed instead of feeling like a separate app."
      asideTitle="What changed"
      asideBody="This login screen now matches the new shell, uses clearer form grouping, and keeps the transition back to the feed feeling smooth."
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
            placeholder="your_name"
            className="input-shell"
          />
          {errors.username ? <p className="mt-2 text-sm text-red-600">{errors.username}</p> : null}
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
          {submitting ? "Signing in..." : "Sign in"}
          {!submitting ? <HiOutlineArrowRight className="text-base" /> : null}
        </button>

        <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
          Need an account?{" "}
          <Link href="/register" className="font-semibold text-blue-700">
            Create one
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
