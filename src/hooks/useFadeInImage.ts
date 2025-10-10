import { useState, useEffect } from 'react';
import { useSpring, SpringValue } from 'react-spring';

/**
 * Configuration options for fade-in animation
 */
interface FadeInConfig {
    // Duration of fade-in in milliseconds (default: 800ms)
    duration?: number;
    // Delay before starting fade-in (default: 0ms)
    delay?: number;
    // Use spring animation (default: true) or simple opacity transition
    useSpring?: boolean;
    // Spring configuration (only used if useSpring is true)
    springConfig?: {
        mass?: number;
        tension?: number;
        friction?: number;
    };
}

/**
 * Return type for useFadeInImage hook
 */
interface FadeInImageResult {
    // Whether the image has finished loading
    isLoaded: boolean;
    // Animated opacity value (can be used with animated.img)
    opacity: SpringValue<number> | number;
    // Handler to attach to img onLoad event
    handleLoad: () => void;
    // Handler to attach to img onError event
    handleError: () => void;
}

/**
 * Custom hook for smooth fade-in image loading animations
 *
 * This hook provides a beautiful fade-in effect for images as they load.
 * It uses react-spring for buttery-smooth animations following Apple's
 * Human Interface Guidelines for seamless visual experiences.
 *
 * Usage:
 * ```tsx
 * const { isLoaded, opacity, handleLoad, handleError } = useFadeInImage();
 *
 * return (
 *   <animated.img
 *     src="/path/to/image.jpg"
 *     style={{ opacity }}
 *     onLoad={handleLoad}
 *     onError={handleError}
 *   />
 * );
 * ```
 *
 * @param config - Configuration options for the fade-in animation
 * @returns Object with animation state and handlers
 */
export const useFadeInImage = (config: FadeInConfig = {}): FadeInImageResult => {
    const {
        delay = 0,
        springConfig = {
            mass: 1,
            tension: 280,
            friction: 26,
        }
    } = config;

    // Track whether the image has loaded
    const [isLoaded, setIsLoaded] = useState(false);

    // Create spring animation for smooth fade-in (Apple-style!)
    // React-spring handles the animation internally, no need for useEffect
    const springAnimation = useSpring({
        opacity: isLoaded ? 1 : 0,
        config: springConfig,
        delay: isLoaded ? delay : 0,
    });

    /**
     * Handler for successful image load
     * Triggers the fade-in animation by updating state
     * The spring animation reacts automatically
     */
    const handleLoad = () => {
        setIsLoaded(true);
    };

    /**
     * Handler for image load errors
     * Prevents broken images from showing
     */
    const handleError = () => {
        console.warn('Image failed to load');
        // Don't set isLoaded to true on error
        // This keeps the image transparent
        setIsLoaded(false);
    };

    return {
        isLoaded,
        opacity: springAnimation.opacity,
        handleLoad,
        handleError,
    };
};

/**
 * Hook variant for images that are preloaded
 * This version immediately shows the image with fade-in if it's already loaded
 *
 * Better approach: Just use the regular useFadeInImage hook and call handleLoad
 * in the component when you know the image is preloaded. This avoids the useEffect.
 *
 * Example:
 * ```tsx
 * const { opacity, handleLoad, handleError } = useFadeInImage();
 * const isPreloaded = useImagePreload(imageSrc, 'immediate');
 *
 * // In your JSX:
 * <animated.img
 *   src={imageSrc}
 *   style={{ opacity }}
 *   onLoad={handleLoad}
 *   onError={handleError}
 * />
 * ```
 *
 * The onLoad handler will fire when the browser loads the image,
 * which happens instantly if it's already cached/preloaded!
 */
