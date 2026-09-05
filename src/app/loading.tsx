export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6" role="status" aria-live="polite">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-center gap-3 text-sm font-medium text-slate-600">
          <span className="h-3 w-3 animate-pulse rounded-full bg-orange-500" />
          Loading portfolio content...
        </div>
        <div className="grid gap-4 sm:grid-cols-3" aria-hidden="true">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white/60" />
          ))}
        </div>
      </div>
    </div>
  );
}
