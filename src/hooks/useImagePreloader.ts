import { useState, useEffect, useRef } from 'react';

/**
 * Priority levels for image preloading
 * - immediate: Load right away (critical images like background, profile)
 * - high: Load after initial render (first images of current view)
 * - medium: Load in background (first images of other views)
 * - low: Load on demand (gallery images, expanded views)
 */
export type PreloadPriority = 'immediate' | 'high' | 'medium' | 'low';

/**
 * Image preload item with priority
 */
interface PreloadItem {
    url: string;
    priority: PreloadPriority;
}

/**
 * Preload state for tracking individual images
 */
interface PreloadState {
    [url: string]: boolean;
}

/**
 * Custom hook to preload images with priority-based loading
 *
 * This hook intelligently preloads images based on their priority level:
 * - Immediate priority images load synchronously on mount
 * - High priority images load after a short delay
 * - Medium priority images load in the background
 * - Low priority images are tracked but not preloaded (lazy loaded)
 *
 * @param images - Array of image URLs or PreloadItem objects to preload
 * @returns Object containing loaded state for each image URL
 */
export const useImagePreloader = (images: (string | PreloadItem)[]): PreloadState => {
    const [loadedImages, setLoadedImages] = useState<PreloadState>({});
    const preloadedRefs = useRef<Set<string>>(new Set());
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        // Create abort controller for cleanup
        abortControllerRef.current = new AbortController();

        // Normalize images to PreloadItem format
        const normalizedImages: PreloadItem[] = images.map(img =>
            typeof img === 'string' ? { url: img, priority: 'medium' } : img
        );

        // Filter out already preloaded images to avoid duplicate work
        const newImages = normalizedImages.filter(
            item => !preloadedRefs.current.has(item.url)
        );

        // Group images by priority
        const immediateImages = newImages.filter(item => item.priority === 'immediate');
        const highImages = newImages.filter(item => item.priority === 'high');
        const mediumImages = newImages.filter(item => item.priority === 'medium');

        /**
         * Preload a single image and update state
         */
        const preloadImage = (url: string): Promise<void> => {
            return new Promise((resolve, reject) => {
                // Skip if already preloaded
                if (preloadedRefs.current.has(url)) {
                    resolve();
                    return;
                }

                const img = new Image();

                // Handle successful load
                img.onload = () => {
                    if (abortControllerRef.current?.signal.aborted) {
                        reject(new Error('Aborted'));
                        return;
                    }

                    preloadedRefs.current.add(url);
                    setLoadedImages(prev => ({ ...prev, [url]: true }));
                    resolve();
                };

                // Handle load errors gracefully
                img.onerror = () => {
                    console.warn(`Failed to preload image: ${url}`);
                    // Still mark as "loaded" to prevent retries
                    preloadedRefs.current.add(url);
                    setLoadedImages(prev => ({ ...prev, [url]: false }));
                    resolve(); // Resolve instead of reject to continue loading other images
                };

                // Start loading the image
                img.src = url;
            });
        };

        /**
         * Batch preload multiple images with optional delay
         */
        const batchPreload = async (items: PreloadItem[], delay: number = 0) => {
            if (delay > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }

            // Check if component is still mounted
            if (abortControllerRef.current?.signal.aborted) {
                return;
            }

            // Preload all images in parallel for better performance
            await Promise.all(items.map(item => preloadImage(item.url)));
        };

        // Execute preloading with priority-based delays
        const executePreloading = async () => {
            try {
                // Load immediate priority images right away (background, profile pic)
                await batchPreload(immediateImages, 0);

                // Load high priority images after a tiny delay (current view images)
                await batchPreload(highImages, 100);

                // Load medium priority images in background (other views)
                await batchPreload(mediumImages, 500);
            } catch (error) {
                if (error instanceof Error && error.message !== 'Aborted') {
                    console.error('Error during image preloading:', error);
                }
            }
        };

        executePreloading();

        // Cleanup function to abort any pending loads on unmount
        return () => {
            abortControllerRef.current?.abort();
        };
    }, [images]);

    return loadedImages;
};

/**
 * Hook to preload a single image
 * Simpler version for single image use cases
 *
 * @param url - Image URL to preload
 * @param priority - Priority level for loading
 * @returns Boolean indicating if image is loaded
 */
export const useImagePreload = (
    url: string | null,
    priority: PreloadPriority = 'medium'
): boolean => {
    const loadedImages = useImagePreloader(
        url ? [{ url, priority }] : []
    );

    return url ? (loadedImages[url] ?? false) : false;
};
