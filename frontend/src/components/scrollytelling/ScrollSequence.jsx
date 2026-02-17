import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useSpring } from 'framer-motion';

const TOTAL_FRAMES = 192;

const ScrollSequence = () => {
    const canvasRef = useRef(null);
    const [images, setImages] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);

    // Scroll progress for the entire page container
    const { scrollYProgress } = useScroll();

    // Smooth out the scroll progress for a "heavy" feel
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Map 0-1 scroll progress to frame index 1-192
    const frameIndex = useTransform(smoothProgress, [0, 1], [1, TOTAL_FRAMES]);

    // Preload images (Parallel)
    useEffect(() => {
        const imgArray = new Array(TOTAL_FRAMES).fill(null);
        let loadedCount = 0;

        const loadImages = async () => {
            const promises = [];

            for (let i = 1; i <= TOTAL_FRAMES; i++) {
                const promise = new Promise((resolve) => {
                    const img = new Image();
                    const filename = String(i).padStart(3, '0') + '.jpg';
                    img.src = `/books/${filename}`;

                    img.onload = () => {
                        loadedCount++;
                        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
                        imgArray[i - 1] = img; // Store in correct index
                        resolve();
                    };

                    img.onerror = () => {
                        console.warn(`Failed to load frame: ${filename}`);
                        loadedCount++;
                        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
                        imgArray[i - 1] = null; // Mark as missing
                        resolve();
                    };
                });
                promises.push(promise);
            }

            await Promise.all(promises);
            setImages(imgArray);
            setIsLoaded(true);
        };

        loadImages();
    }, []);

    // Render loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isLoaded || images.length === 0) return;

        const ctx = canvas.getContext('2d');

        // DEFINE renderFrame FIRST to avoid TDZ
        const renderFrame = (index) => {
            if (!ctx || !canvas) return;

            // Clamp index
            const safeIndex = Math.max(1, Math.min(Math.round(index), TOTAL_FRAMES));
            const img = images[safeIndex - 1]; // 0-based array access

            // SAFETY CHECK: Only draw if image is loaded and valid
            if (!img || !img.complete || img.naturalWidth === 0) return;

            // Object-fit: cover logic with slight zoom to crop watermark
            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.max(hRatio, vRatio) * 1.1; // 1.1x Zoom to crop edges

            const centerShift_x = (canvas.width - img.width * ratio) / 2;
            const centerShift_y = (canvas.height - img.height * ratio) / 2;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
                img,
                0, 0, img.width, img.height,
                centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
            );
        };

        // NOW define handleResize which calls renderFrame
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const currentIndex = frameIndex.get();
            if (currentIndex) renderFrame(currentIndex);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial size

        const unsubscribe = frameIndex.on("change", (latest) => {
            requestAnimationFrame(() => renderFrame(latest));
        });

        // Initial render
        renderFrame(frameIndex.get() || 1);

        return () => {
            window.removeEventListener('resize', handleResize);
            unsubscribe();
        };
    }, [isLoaded, images, frameIndex]);

    if (!isLoaded) {
        return null; // Silent load as requested
    }

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full object-contain pointer-events-none z-0"
        />
    );
};

export default ScrollSequence;
