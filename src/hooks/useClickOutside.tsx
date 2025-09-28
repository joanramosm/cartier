import {
  createEffect,
  onCleanup,
  createSignal,
  Accessor,
  Setter,
} from "solid-js";

/**
 * Options for the useClickOutside hook
 */
interface UseClickOutsideOptions {
  /** Whether the click outside detection is active */
  isActive: Accessor<boolean>;
  /** Callback function called when clicking outside the container */
  onClickOutside: () => void;
  /** Event types to listen for (defaults to ['click', 'touchstart']) */
  events?: string[];
}

/**
 * Return type for the useClickOutside hook
 */
interface UseClickOutsideReturn {
  /** Accessor for the container element reference */
  containerRef: Accessor<HTMLElement | null>;
  /** Setter for the container element reference */
  setContainerRef: Setter<HTMLElement | null>;
}

/**
 * Hook that detects clicks outside of a specified container element
 *
 * @param options - Configuration options
 * @returns Object with containerRef and setContainerRef
 *
 * @example
 * ```tsx
 * const { setContainerRef } = useClickOutside({
 *   isActive: () => isModalOpen(),
 *   onClickOutside: () => setIsModalOpen(false)
 * });
 *
 * return <div ref={setContainerRef}>Modal content</div>;
 * ```
 */
export function useClickOutside(
  options: UseClickOutsideOptions
): UseClickOutsideReturn {
  const [containerRef, setContainerRef] = createSignal<HTMLElement | null>(
    null
  );

  const { events = ["click", "touchstart"] } = options;

  createEffect(() => {
    if (import.meta.env.DEV) console.log("[useClickOutside] effect run");

    if (options.isActive()) {
      const handleClickOutside = (e: Event) => {
        const container = containerRef();
        const target = e.target as Node;

        // Check if target is outside the container
        if (container && !container.contains(target)) {
          // Additional check for Shadow DOM
          if (!container.shadowRoot || !container.shadowRoot.contains(target)) {
            if (import.meta.env.DEV) {
              console.log("[useClickOutside] click outside detected");
            }
            options.onClickOutside();
          }
        }
      };

      // Add event listeners for all specified events
      events.forEach(eventType => {
        document.addEventListener(eventType, handleClickOutside, true);
      });

      onCleanup(() => {
        events.forEach(eventType => {
          document.removeEventListener(eventType, handleClickOutside, true);
        });
        if (import.meta.env.DEV) {
          console.log("[useClickOutside] cleanup event listener");
        }
      });
    }
  });

  return { containerRef, setContainerRef };
}
