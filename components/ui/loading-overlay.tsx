'use client';

import { useLoading } from "@/providers/loading-provider";
import { Loader } from "./loader";
import { AnimatePresence, motion } from "framer-motion";

export function LoadingOverlay() {
  const { isLoading } = useLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <Loader className="w-8 h-8" />
        </motion.div>
      )}
    </AnimatePresence>
  );
} 