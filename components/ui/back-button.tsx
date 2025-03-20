"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const BackButton = () => {
  const router = useRouter()
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.back()}
      className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft className="h-4 w-4" />
      <span>Back</span>
    </Button>
  )
}