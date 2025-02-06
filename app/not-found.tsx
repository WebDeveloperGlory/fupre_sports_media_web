export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
      <div className="flex items-center gap-6 text-foreground/90">
        <div className="text-7xl font-light">404</div>
        <div className="h-16 w-px bg-foreground/10" />
        <div className="text-xl">This page could not be found.</div>
      </div>
    </div>
  );
} 