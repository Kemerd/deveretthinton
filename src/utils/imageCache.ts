/**
 * Global image cache utility
 *
 * This module provides a centralized cache for tracking which images
 * have been loaded/preloaded to prevent duplicate requests and optimize
 * memory usage across the application.
 *
 * The cache is persisted across component re-renders and uses a Set
 * for O(1) lookup performance.
 */

/**
 * Global cache of loaded image URLs
 * Using a Set for fast O(1) lookups
 */
const imageCache = new Set<string>();

/**
 * Image cache manager with utility methods
 */
export const ImageCache = {
    /**
     * Check if an image has been cached
     * @param url - Image URL to check
     * @returns true if image is in cache
     */
    has(url: string): boolean {
        return imageCache.has(url);
    },

    /**
     * Add an image URL to the cache
     * @param url - Image URL to cache
     */
    add(url: string): void {
        imageCache.add(url);
    },

    /**
     * Add multiple image URLs to the cache
     * @param urls - Array of image URLs to cache
     */
    addMany(urls: string[]): void {
        urls.forEach(url => imageCache.add(url));
    },

    /**
     * Remove an image URL from the cache
     * Useful for invalidation scenarios
     * @param url - Image URL to remove
     */
    remove(url: string): void {
        imageCache.delete(url);
    },

    /**
     * Clear the entire image cache
     * Use with caution - this will force all images to reload
     */
    clear(): void {
        imageCache.clear();
    },

    /**
     * Get the current size of the cache
     * @returns Number of cached images
     */
    size(): number {
        return imageCache.size;
    },

    /**
     * Get all cached image URLs
     * @returns Array of cached URLs
     */
    getAll(): string[] {
        return Array.from(imageCache);
    },

    /**
     * Filter URLs to only those not in cache
     * Useful for optimizing preload operations
     * @param urls - Array of URLs to check
     * @returns Array of URLs not in cache
     */
    filterUncached(urls: string[]): string[] {
        return urls.filter(url => !imageCache.has(url));
    },

    /**
     * Check if multiple images are all cached
     * @param urls - Array of URLs to check
     * @returns true if all URLs are cached
     */
    hasAll(urls: string[]): boolean {
        return urls.every(url => imageCache.has(url));
    },

    /**
     * Check if any of the provided images are cached
     * @param urls - Array of URLs to check
     * @returns true if at least one URL is cached
     */
    hasAny(urls: string[]): boolean {
        return urls.some(url => imageCache.has(url));
    },
};

/**
 * Helper function to get all images from grid data
 * Extracts image URLs from common grid item structure
 *
 * @param items - Array of grid items with images property
 * @returns Flat array of all image URLs
 */
export const extractImagesFromGridItems = (
    items: Array<{ images: string[] }>
): string[] => {
    return items.flatMap(item => item.images);
};

/**
 * Helper function to get first image from each grid item
 * Useful for priority loading of visible images
 *
 * @param items - Array of grid items with images property
 * @returns Array of first image URLs from each item
 */
export const extractFirstImagesFromGridItems = (
    items: Array<{ images: string[] }>
): string[] => {
    return items.map(item => item.images[0]).filter(Boolean);
};
