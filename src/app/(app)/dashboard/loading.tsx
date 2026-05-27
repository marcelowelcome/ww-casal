export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8" aria-busy="true">
      <div className="mb-3 h-3 w-24 animate-pulse rounded-sm bg-sand-200" />
      <div className="mb-10 h-12 w-2/3 animate-pulse rounded-sm bg-sand-200" />
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-sm bg-paper" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-80 animate-pulse rounded-sm bg-paper" />
        ))}
      </div>
    </div>
  );
}
