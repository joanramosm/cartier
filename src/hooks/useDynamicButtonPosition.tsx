import { createSignal, createMemo } from "solid-js";

/**
 * Options for the useDynamicButtonPosition hook
 */
interface UseDynamicButtonPositionOptions {
  /** Function that returns the width of the text to position relative to */
  getTextWidth: () => number;
  /** Function that returns the container element reference */
  containerRef: () => HTMLElement | undefined;
  /** Button width in rem units (default: 4) */
  buttonWidthRem?: number;
  /** Offset from text end in rem units (default: 1.25) */
  offsetRem?: number;
}

/**
 * Return type for the useDynamicButtonPosition hook
 */
interface UseDynamicButtonPositionReturn {
  /** Accessor for the calculated X position in pixels */
  buttonX: () => number;
  /** Function to manually update the position calculation */
  updatePosition: () => void;
}

/**
 * Hook that calculates dynamic positioning for buttons based on text width
 * Uses rem units for responsive design and handles container overflow
 *
 * @param options - Configuration options
 * @returns Object with buttonX accessor and updatePosition function
 *
 * @example
 * ```tsx
 * const { buttonX, updatePosition } = useDynamicButtonPosition({
 *   getTextWidth: () => measureTextWidth(inputElement),
 *   containerRef: () => containerElement,
 *   buttonWidthRem: 4,
 *   offsetRem: 1.25
 * });
 *
 * return <div style={{ left: `${buttonX()}px` }}>Buttons</div>;
 * ```
 */
export const useDynamicButtonPosition = (
  options: UseDynamicButtonPositionOptions
): UseDynamicButtonPositionReturn => {
  const [buttonX, setButtonX] = createSignal(0);

  const {
    getTextWidth,
    containerRef,
    buttonWidthRem = 4,
    offsetRem = 1.25
  } = options;

  // Memoize font size calculation for performance
  const rootFontSize = createMemo(() => {
    try {
      const fontSize = window.getComputedStyle(document.documentElement).fontSize;
      const parsed = parseFloat(fontSize);
      return isNaN(parsed) ? 16 : parsed; // Fallback to 16px
    } catch (error) {
      console.warn("[useDynamicButtonPosition] Failed to get font size:", error);
      return 16;
    }
  });

  const updatePosition = () => {
    const textWidth = getTextWidth();
    const container = containerRef();

    if (!container) {
      if (import.meta.env.DEV) {
        console.warn("[useDynamicButtonPosition] Container ref is undefined");
      }
      return;
    }

    const fontSize = rootFontSize();

    // Convert rem to pixels
    const buttonWidth = buttonWidthRem * fontSize;
    const offset = offsetRem * fontSize;

    const containerWidth = container.offsetWidth;
    let newX = textWidth + offset;

    // Ensure buttons don't overflow the container
    if (newX + buttonWidth > containerWidth) {
      newX = Math.max(0, containerWidth - buttonWidth);
    }

    // Ensure position is not negative
    newX = Math.max(0, newX);

    setButtonX(newX);
  };

  return {
    buttonX,
    updatePosition
  };
};