import {
  createEffect,
  onCleanup,
  createSignal,
  Accessor,
  Setter,
} from "solid-js";

interface UseClickOutsideOptions {
  isActive: Accessor<boolean>;
  onClickOutside: () => void;
}

interface UseClickOutsideReturn {
  containerRef: Accessor<HTMLDivElement | null>;
  setContainerRef: Setter<HTMLDivElement | null>;
}

export function useClickOutside(
  options: UseClickOutsideOptions
): UseClickOutsideReturn {
  const [containerRef, setContainerRef] = createSignal<HTMLDivElement | null>(
    null
  );

  createEffect(() => {
    if (import.meta.env.DEV) console.log("[useClickOutside] effect run");
    if (options.isActive()) {
      const handleClickOutside = (e: MouseEvent) => {
        const container = containerRef();
        if (container && !container.contains(e.target as Node)) {
          if (import.meta.env.DEV)
            console.log("[useClickOutside] click outside detected");
          options.onClickOutside();
        }
      };

      document.addEventListener("click", handleClickOutside);
      onCleanup(() => {
        document.removeEventListener("click", handleClickOutside);
        if (import.meta.env.DEV)
          console.log("[useClickOutside] cleanup event listener");
      });
    }
  });

  return { containerRef, setContainerRef };
}
