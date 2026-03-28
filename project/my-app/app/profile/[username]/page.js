import AppShell from "@/components/layout/app-shell";
import ProfilePageClient from "@/components/profile/profile-page";

export default async function ProfilePage({ params }) {
  const { username } = params;

  return (
    <AppShell>
      <ProfilePageClient username={username} />
    </AppShell>
  );
}
