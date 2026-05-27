export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10 sm:px-8" aria-busy="true">
      <div className="mb-3 h-3 w-24 animate-pulse rounded-sm bg-sand-200" />
      <div className="mb-10 h-10 w-2/3 animate-pulse rounded-sm bg-sand-200" />
      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-sm bg-paper" />
        ))}
      </div>
    </div>
  );
}
