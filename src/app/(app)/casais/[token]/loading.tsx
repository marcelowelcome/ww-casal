export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8" aria-busy="true">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <div className="hidden lg:block">
          <div className="h-96 animate-pulse rounded-sm bg-paper" />
        </div>
        <div>
          <div className="mb-3 h-3 w-32 animate-pulse rounded-sm bg-sand-200" />
          <div className="mb-10 h-12 w-2/3 animate-pulse rounded-sm bg-sand-200" />
          <div className="space-y-8">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-sm bg-paper" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
