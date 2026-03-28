export default function Avatar({
  src,
  alt = "Avatar",
  size = "h-11 w-11",
  label
}) {
  const initials = (label || alt || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

  return (
    <div className={`${size} overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-sm`}>
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-xs font-bold text-white">
          {initials}
        </div>
      )}
    </div>
  );
}
