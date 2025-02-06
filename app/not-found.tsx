import { BlurFade } from "@/components/ui/blur-fade"

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4">
      <BlurFade delay={0.1}>
        <div className="flex flex-col items-center">
          <h1 className="text-7xl/none font-medium tracking-tight">
            FUPRE SPORTS
          </h1>
          <h1 className="text-7xl/none font-medium tracking-tight">
            MEDIA
          </h1>
        </div>
      </BlurFade>
    </div>
  );
} 