import AppShell from "@/components/layout/app-shell";
import EditPostPage from "@/components/blog/edit-post-page";

export default function EditPostRoute({ params }) {
  return (
    <AppShell>
      <EditPostPage id={params.id} />
    </AppShell>
  );
}
