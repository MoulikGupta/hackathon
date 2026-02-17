import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform } from 'framer-motion';

const FeatureSequence = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [images, setImages] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Scroll progress for this specific section
    // We expect the parent to be a sticky container with large height
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, 299]); // 300 frames (0-299)

    // Preload Images
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages = [];

            // Generate paths: /join/000.jpg ... /join/299.jpg
            const promises = Array.from({ length: 300 }, (_, i) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    const paddedIndex = String(i).padStart(3, '0');
                    img.src = `/join/${paddedIndex}.jpg`;
                    img.onload = () => {
                        loadedImages[i] = img;
                        resolve();
                    };
                    img.onerror = (e) => {
                        console.error(`Failed to load join/${paddedIndex}.jpg`, e);
                        // Resolve anyway to prevent blocking
                        resolve();
                    };
                });
            });

            await Promise.all(promises);
            setImages(loadedImages);
            setIsLoaded(true);
        };

        loadImages();
    }, []);

    // Draw parameters
    const renderFrame = (index) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const img = images[index];

        if (!canvas || !ctx || !img) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Resize canvas to match window
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Object-fit: cover logic
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio); // Cover to fill screen

        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;

        ctx.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            centerShift_x,
            centerShift_y,
            img.width * ratio,
            img.height * ratio
        );
    };

    // Animation Loop
    useEffect(() => {
        if (!isLoaded || images.length === 0) return;

        const unsubscribe = frameIndex.on("change", (latest) => {
            // Clamp index
            const index = Math.min(Math.max(Math.floor(latest), 0), 299);
            requestAnimationFrame(() => renderFrame(index));
        });

        // Initial draw
        renderFrame(0);

        return () => unsubscribe();
    }, [isLoaded, images, frameIndex]);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full">
            <canvas
                ref={canvasRef}
                className="block w-full h-full object-cover"
            />
        </div>
    );
};

export default FeatureSequence;
