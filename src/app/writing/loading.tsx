export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6" role="status" aria-live="polite">
      <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-5 py-3 text-sm text-slate-600 shadow-sm">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-orange-500" />
        Loading writing...
      </div>
    </div>
  );
}
