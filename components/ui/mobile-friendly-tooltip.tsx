"use client"

import * as React from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface MobileFriendlyTooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  delayDuration?: number
}

export function MobileFriendlyTooltip({
  children,
  content,
  delayDuration = 0
}: MobileFriendlyTooltipProps) {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    // Détecter si on est sur mobile via touch events
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Sur mobile, utiliser Popover (cliquable)
  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          {children}
        </PopoverTrigger>
        <PopoverContent className="max-w-xs text-sm">
          {content}
        </PopoverContent>
      </Popover>
    )
  }

  // Sur desktop, utiliser Tooltip (hover)
  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        {content}
      </TooltipContent>
    </Tooltip>
  )
}
