"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiOutlineArrowLeft, HiOutlinePhoto } from "react-icons/hi2";

import { api, authHeaders, getErrorMessage } from "@/lib/api";
import { getDecodedToken, getToken } from "@/lib/auth";
import Avatar from "@/components/ui/avatar";
import Loader from "@/components/ui/loader";
import useUIStore from "@/stores/ui-store";

export default function EditProfilePage({ username }) {
  const router = useRouter();
  const showAlert = useUIStore((state) => state.showAlert);
  const token = getToken();
  const decodedToken = getDecodedToken(token);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await api.get(`/user/${username}`, {
          headers: authHeaders(token)
        });

        if (!ignore) {
          setUser(response.data);
          setBio(response.data.bio || "");
        }
      } catch (error) {
        if (!ignore) {
          showAlert({
            type: "error",
            title: "Could not load profile",
            message: getErrorMessage(error, "Please try again.")
          });
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      ignore = true;
    };
  }, [router, showAlert, token, username]);

  if (loading) {
    return <Loader label="Loading profile editor..." />;
  }

  if (!user || decodedToken?.id !== user._id) {
    return (
      <div className="surface rounded-2xl px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-slate-900">You can't edit this profile</h2>
        <p className="mt-3 text-slate-500">Only the owner can update this profile.</p>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("bio", bio);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      await api.patch("/user/me", formData, {
        headers: {
          ...authHeaders(token),
          "Content-Type": "multipart/form-data"
        }
      });

      showAlert({
        type: "success",
        title: "Profile updated",
        message: "Your profile changes have been saved."
      });

      router.push(`/profile/${username}`);
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
          href={`/profile/${username}`}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <HiOutlineArrowLeft className="text-base" />
          Back to profile
        </Link>
      </div>

      <div className="surface rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex flex-col items-start gap-4">
            <Avatar
              src={avatar ? URL.createObjectURL(avatar) : user.avatar}
              alt={user.username}
              label={user.username}
              size="h-24 w-24"
            />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              <HiOutlinePhoto className="text-base" />
              Change photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(event) => setAvatar(event.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Edit profile</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-950">u/{user.username}</h1>
            <p className="mt-2 text-sm text-slate-500">
              Update your public bio and profile image.
            </p>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Bio</label>
              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                rows={7}
                className="input-shell resize-y"
                placeholder="Tell people a little about yourself"
              />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Link
                href={`/profile/${username}`}
                className="secondary-button px-4 py-2 text-sm"
              >
                Cancel
              </Link>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="primary-button px-4 py-2 text-sm disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save profile"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
