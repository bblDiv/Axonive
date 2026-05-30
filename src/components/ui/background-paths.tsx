"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface FloatingPathsProps {
  position: number;
}

function FloatingPaths({ position }: FloatingPathsProps) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(244,114,182,${0.08 + i * 0.015})`, // Cherry blossom pink (pink-400)
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-pink-400/20 dark:text-pink-500/10"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.08 + path.id * 0.02}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.2, 0.5, 0.2],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

interface BackgroundPathsProps {
  title?: string;
  showContent?: boolean;
  className?: string;
}

export function BackgroundPaths({
  title = "Background Paths",
  showContent = true,
  className = "",
}: BackgroundPathsProps) {
  const words = title.split(" ");

  return (
    <div className={`${showContent ? 'relative min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950 w-full overflow-hidden' : 'absolute inset-0 w-full h-full overflow-hidden pointer-events-none'} ${className}`}>
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      {showContent && (
        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tighter">
              {words.map((word, wordIndex) => (
                <span
                  key={wordIndex}
                  className="inline-block mr-4 last:mr-0"
                >
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={`${wordIndex}-${letterIndex}`}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay:
                          wordIndex * 0.1 +
                          letterIndex * 0.03,
                        type: "spring",
                        stiffness: 150,
                        damping: 25,
                      }}
                      className="inline-block text-transparent bg-clip-text 
                      bg-gradient-to-r from-pink-600 to-rose-500 
                      dark:from-pink-400 dark:to-rose-300"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>

            <div
              className="inline-block group relative bg-gradient-to-b from-pink-500/10 to-rose-500/10 
              p-px rounded-2xl backdrop-blur-lg 
              overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <Button
                variant="ghost"
                className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md 
                bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 
                text-pink-600 dark:text-pink-400 transition-all duration-300 
                group-hover:-translate-y-0.5 border border-pink-500/10
                hover:shadow-md dark:hover:shadow-neutral-800/50"
              >
                <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                  Discover Excellence
                </span>
                <span
                  className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 
                  transition-all duration-300"
                >
                  →
                </span>
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
