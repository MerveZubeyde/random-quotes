export default function Loading() {
  return (
    <main
      className="flex min-h-[50vh] w-full items-center justify-center"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="size-8 animate-spin rounded-full border-4 border-muted border-t-foreground"
        role="status"
        aria-label="Loading"
      />
    </main>
  );
}