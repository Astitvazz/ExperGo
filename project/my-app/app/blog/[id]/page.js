import AppShell from "@/components/layout/app-shell";
import BlogDetail from "@/components/blog/blog-detail";

export default async function BlogDetailPage({ params }) {
  const { id } = params;

  return (
    <AppShell>
      <BlogDetail id={id} />
    </AppShell>
  );
}
