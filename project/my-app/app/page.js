import AppShell from "@/components/layout/app-shell";
import BlogFeed from "@/components/blog/blog-feed";

export default function HomePage() {
  return (
    <AppShell>
      <BlogFeed />
    </AppShell>
  );
}
