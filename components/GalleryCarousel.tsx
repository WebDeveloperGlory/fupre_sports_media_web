'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Camera } from 'lucide-react';

// Gallery images from /public/images/gallery/
const galleryImages = [
    { src: '/images/gallery/Gallery (1).jpg', alt: 'FUPRE Sports Moment 1' },
    { src: '/images/gallery/Gallery (2).jpg', alt: 'FUPRE Sports Moment 2' },
    { src: '/images/gallery/Gallery (3).jpg', alt: 'FUPRE Sports Moment 3' },
    { src: '/images/gallery/Gallery (4).jpg', alt: 'FUPRE Sports Moment 4' },
    { src: '/images/gallery/Gallery (5).jpg', alt: 'FUPRE Sports Moment 5' },
    { src: '/images/gallery/Gallery (6).jpg', alt: 'FUPRE Sports Moment 6' },
    { src: '/images/gallery/Gallery (7).jpg', alt: 'FUPRE Sports Moment 7' },
    { src: '/images/gallery/Gallery (8).jpg', alt: 'FUPRE Sports Moment 8' },
    { src: '/images/gallery/Gallery (9).jpg', alt: 'FUPRE Sports Moment 9' },
    { src: '/images/gallery/Gallery (10).jpg', alt: 'FUPRE Sports Moment 10' },
];

export default function GalleryCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});
    const containerRef = useRef<HTMLDivElement>(null);

    // Parallax scroll effect
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    // Auto-advance carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const handleImageError = (index: number) => {
        setImageError((prev) => ({ ...prev, [index]: true }));
    };

    return (
        <section className="border-t border-border">
            {/* Header */}
            <div className="container mx-auto px-4 py-10 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Gallery</h2>
                <p className="text-muted-foreground text-sm md:text-base">Moments from FUPRE Sports</p>
            </div>

            {/* Parallax Image */}
            <div
                ref={containerRef}
                className="relative h-[50vh] md:h-[70vh] overflow-hidden"
            >
                <motion.div
                    style={{ y }}
                    className="absolute inset-0 scale-110"
                >
                    <AnimatePresence mode="sync">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0"
                        >
                            {imageError[currentIndex] ? (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-secondary text-muted-foreground">
                                    <Camera className="w-16 h-16 mb-4 opacity-20" />
                                    <p className="text-sm">Image not found</p>
                                </div>
                            ) : (
                                <Image
                                    src={galleryImages[currentIndex].src}
                                    alt={galleryImages[currentIndex].alt}
                                    fill
                                    className="object-cover"
                                    onError={() => handleImageError(currentIndex)}
                                    priority
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Dots Indicator - Below Image */}
            <div className="flex justify-center gap-2 py-6 bg-background">
                {galleryImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 rounded-full transition-all ${index === currentIndex
                            ? 'bg-emerald-600 dark:bg-emerald-400 w-8'
                            : 'bg-border w-2 hover:bg-muted-foreground/50'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
