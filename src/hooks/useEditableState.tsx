import { createSignal, Accessor, Setter } from "solid-js";

/**
 * Options for the useEditableState hook
 */
interface UseEditableStateOptions {
  /** Initial value for the editable state */
  initialValue: string;
  /** Callback function called when value changes */
  onChange: (newValue: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Function to get the current value (used for resetting) */
  getCurrentValue: () => string;
}

/**
 * Return type for the useEditableState hook
 */
interface UseEditableStateReturn {
  /** Whether the component is in editing mode */
  isEditing: Accessor<boolean>;
  /** Setter for editing mode */
  setIsEditing: Setter<boolean>;
  /** Current initial value (resets when editing starts) */
  initialValue: Accessor<string>;
  /** Reference to the input element */
  inputRef: Accessor<HTMLInputElement | null>;
  /** Setter for the input element reference */
  setInputRef: Setter<HTMLInputElement | null>;
  /** Handler for click events to enter edit mode */
  handleClick: () => void;
  /** Handler for keyboard events */
  handleKeyDown: (e: KeyboardEvent) => void;
  /** Function to approve and save changes */
  approveChanges: (value: string) => void;
  /** Function to cancel changes */
  cancelChanges: () => void;
}

/**
 * Hook that manages the state and logic for editable text components
 * Handles editing mode, value changes, and keyboard interactions
 *
 * @param options - Configuration options
 * @returns Object with state accessors and event handlers
 *
 * @example
 * ```tsx
 * const {
 *   isEditing,
 *   handleClick,
 *   handleKeyDown,
 *   approveChanges,
 *   cancelChanges
 * } = useEditableState({
 *   initialValue: "Hello",
 *   onChange: (value) => setText(value),
 *   getCurrentValue: () => currentValue
 * });
 * ```
 */
export function useEditableState(
  options: UseEditableStateOptions
): UseEditableStateReturn {
  // Validate options
  if (typeof options.onChange !== 'function') {
    throw new Error('[useEditableState] onChange must be a function');
  }
  if (typeof options.getCurrentValue !== 'function') {
    throw new Error('[useEditableState] getCurrentValue must be a function');
  }

  const [isEditing, setIsEditing] = createSignal(false);
  const [initialValue, setInitialValue] = createSignal(options.initialValue);
  const [inputRef, setInputRef] = createSignal<HTMLInputElement | null>(null);

  const handleClick = () => {
    try {
      const currentValue = options.getCurrentValue();
      setInitialValue(currentValue);
      setIsEditing(true);

      // Focus input after render
      requestAnimationFrame(() => {
        const input = inputRef();
        if (input) {
          input.focus();
          // Position cursor at end
          input.setSelectionRange(input.value.length, input.value.length);
        }
      });
    } catch (error) {
      console.error("[useEditableState] Error in handleClick:", error);
    }
  };

  const approveChanges = (value: string) => {
    try {
      const currentInitialValue = initialValue();

      if (currentInitialValue !== value) {
        options.onChange(value);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("[useEditableState] Error in approveChanges:", error);
      // Still exit editing mode even if onChange fails
      setIsEditing(false);
    }
  };

  const cancelChanges = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    try {
      const target = e.currentTarget as HTMLInputElement;

      if (e.key === "Enter") {
        e.preventDefault();
        approveChanges(target.value);
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancelChanges();
      }
    } catch (error) {
      console.error("[useEditableState] Error in handleKeyDown:", error);
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
