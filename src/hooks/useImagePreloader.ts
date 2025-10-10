import { useState, useMemo } from 'react';

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
 * Global cache to track preloaded images across all components
 * This prevents duplicate preloading and improves performance
 */
const globalPreloadCache = new Set<string>();

/**
 * Custom hook to preload images with priority-based loading
 *
 * This hook intelligently preloads images based on their priority level:
 * - Immediate priority images load synchronously on mount
 * - High priority images load after a short delay
 * - Medium priority images load in the background
 * - Low priority images are tracked but not preloaded (lazy loaded)
 *
 * Optimized to avoid useEffect - uses useMemo for side effects during render
 * which is acceptable for image preloading (non-critical side effect)
 *
 * @param images - Array of image URLs or PreloadItem objects to preload
 * @returns Object containing loaded state for each image URL
 */
export const useImagePreloader = (images: (string | PreloadItem)[]): PreloadState => {
    const [loadedImages, setLoadedImages] = useState<PreloadState>({});

    // Use useMemo to kick off preloading - runs once when images change
    // This is acceptable for preloading since it's a background operation
    useMemo(() => {
        // Normalize images to PreloadItem format
        const normalizedImages: PreloadItem[] = images.map(img =>
            typeof img === 'string' ? { url: img, priority: 'medium' } : img
        );

        // Filter out already preloaded images to avoid duplicate work
        const newImages = normalizedImages.filter(
            item => !globalPreloadCache.has(item.url)
        );

        // Early return if nothing to preload
        if (newImages.length === 0) return;

        // Group images by priority
        const immediateImages = newImages.filter(item => item.priority === 'immediate');
        const highImages = newImages.filter(item => item.priority === 'high');
        const mediumImages = newImages.filter(item => item.priority === 'medium');

        /**
         * Preload a single image and update state
         */
        const preloadImage = (url: string, delay: number = 0): void => {
            // Skip if already cached globally
            if (globalPreloadCache.has(url)) return;

            // Add to global cache immediately to prevent duplicates
            globalPreloadCache.add(url);

            // Create preload function
            const load = () => {
                const img = new Image();

                img.onload = () => {
                    setLoadedImages(prev => ({ ...prev, [url]: true }));
                };

                img.onerror = () => {
                    console.warn(`Failed to preload image: ${url}`);
                    setLoadedImages(prev => ({ ...prev, [url]: false }));
                };

                img.src = url;
            };

            // Execute immediately or with delay
            if (delay > 0) {
                setTimeout(load, delay);
            } else {
                load();
            }
        };

        // Preload images with priority-based delays
        // Immediate: no delay
        immediateImages.forEach(item => preloadImage(item.url, 0));

        // High priority: tiny delay to not block render
        highImages.forEach(item => preloadImage(item.url, 100));

        // Medium priority: background loading
        mediumImages.forEach(item => preloadImage(item.url, 500));

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
