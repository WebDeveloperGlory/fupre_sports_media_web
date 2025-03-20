"use client"

import React from "react"
import { motion } from "framer-motion"

interface BlurFadeProps {
  children: React.ReactNode
  className?: string
}

export const BlurFade: React.FC<BlurFadeProps> = ({ children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}