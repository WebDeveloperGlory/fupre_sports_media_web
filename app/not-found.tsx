import { BlurFade } from "@/components/ui/blur-fade"

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4">
      <BlurFade delay={0.1}>
        <div className="flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-medium tracking-tight text-center">
            FUPRE SPORTS
          </h1>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-medium tracking-tight text-center">
            MEDIA
          </h1>
        </div>
      </BlurFade>
    </div>
  );
} 