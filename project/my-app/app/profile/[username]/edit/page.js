import AppShell from "@/components/layout/app-shell";
import EditProfilePage from "@/components/profile/edit-profile-page";

export default function EditProfileRoute({ params }) {
  return (
    <AppShell>
      <EditProfilePage username={params.username} />
    </AppShell>
  );
}
