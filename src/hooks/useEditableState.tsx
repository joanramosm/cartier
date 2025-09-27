import { createSignal, Accessor, Setter } from "solid-js";

interface UseEditableStateOptions {
  initialValue: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  getCurrentValue: () => string; // Add this to get current value
}

interface UseEditableStateReturn {
  isEditing: Accessor<boolean>;
  setIsEditing: Setter<boolean>;
  initialValue: Accessor<string>;
  inputRef: Accessor<HTMLInputElement | null>;
  setInputRef: Setter<HTMLInputElement | null>;
  handleClick: () => void;
  handleKeyDown: (e: KeyboardEvent) => void;
  approveChanges: (value: string) => void;
  cancelChanges: () => void;
}

export function useEditableState(
  options: UseEditableStateOptions
): UseEditableStateReturn {
  const [isEditing, setIsEditing] = createSignal(false);
  const [initialValue, setInitialValue] = createSignal(options.initialValue);
  const [inputRef, setInputRef] = createSignal<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (import.meta.env.DEV) console.log("[useEditableState] handleClick");
    setInitialValue(options.getCurrentValue()); // Use current value instead of initial
    setIsEditing(true);
    // Focus after render
    requestAnimationFrame(() => inputRef()?.focus());
  };

  const approveChanges = (value: string) => {
    if (import.meta.env.DEV)
      console.log("[useEditableState] approveChanges", value);
    if (initialValue() !== value) {
      options.onChange(value);
      if (import.meta.env.DEV)
        console.log("[useEditableState] value changed, onChange called");
    } else {
      if (import.meta.env.DEV)
        console.log("[useEditableState] value unchanged, onChange not called");
    }
    setIsEditing(false);
  };

  const cancelChanges = () => {
    if (import.meta.env.DEV) console.log("[useEditableState] cancelChanges");
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const target = e.currentTarget as HTMLInputElement;
      approveChanges(target.value);

      if (import.meta.env.DEV)
        console.log("[useEditableState] Enter key pressed, changes approved");
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelChanges();

      if (import.meta.env.DEV)
        console.log("[useEditableState] Escape key pressed, changes canceled");
    }
  };

  return {
    isEditing,
    setIsEditing,
    initialValue,
    inputRef,
    setInputRef,
    handleClick,
    handleKeyDown,
    approveChanges,
    cancelChanges,
  };
}
