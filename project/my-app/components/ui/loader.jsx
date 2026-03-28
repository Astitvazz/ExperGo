export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[240px] w-full flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}
