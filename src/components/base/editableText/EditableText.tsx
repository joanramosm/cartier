import { Component, createSignal, createMemo, onMount, onCleanup } from "solid-js";
import { useEditableState } from "~/hooks/useEditableState";
import { useClickOutside } from "~/hooks/useClickOutside";
import { useDynamicButtonPosition } from "~/hooks/useDynamicButtonPosition";
import { Button, Input } from "~/components/base";
import CancelIcon from "~/icons/cancelIcon";
import CheckIcon from "~/icons/checkIcon";
import styles from "./EditableText.module.css";

/**
 * Props for the EditableText component
 */
interface EditableTextProps {
  /** Function that returns the current value to display */
  value: () => string;
  /** Callback function called when the value changes */
  onChange: (newValue: string) => void;
  /** Placeholder text shown when value is empty */
  placeholder?: string;
  /** Whether to show the action buttons (default: true) */
  showButtons?: boolean;
  /** Maximum character length for input */
  maxLength?: number;
  /** Additional CSS classes */
  class?: string;
}

/**
 * An inline editable text component with dynamic button positioning
 * Allows users to click text to edit it inline with save/cancel buttons
 *
 * @example
 * ```tsx
 * <EditableText
 *   value={() => userName()}
 *   onChange={setUserName}
 *   placeholder="Enter name"
 *   maxLength={50}
 * />
 * ```
 */
const EditableText: Component<EditableTextProps> = (props) => {
  let containerRef: HTMLElement | undefined;
  let textMeasureElement: HTMLSpanElement | undefined;

  const {
    isEditing,
    initialValue,
    inputRef,
    setInputRef,
    handleClick,
    handleKeyDown,
    approveChanges,
    cancelChanges,
  } = useEditableState({
    initialValue: props.value(),
    onChange: props.onChange,
    placeholder: props.placeholder,
    getCurrentValue: props.value,
  });

  const { setContainerRef } = useClickOutside({
    isActive: isEditing,
    onClickOutside: cancelChanges,
  });

  // Create a memoized text width calculator for performance
  const getTextWidth = createMemo(() => {
    return () => {
      const input = inputRef();
      if (!input) return 0;

      // Use a cached measurement element for better performance
      if (!textMeasureElement) {
        textMeasureElement = document.createElement('span');
        textMeasureElement.style.position = 'absolute';
        textMeasureElement.style.visibility = 'hidden';
        textMeasureElement.style.whiteSpace = 'pre';
        textMeasureElement.style.font = 'inherit';
        document.body.appendChild(textMeasureElement);
      }

      const text = input.value;
      textMeasureElement.textContent = text;
      textMeasureElement.style.font = window.getComputedStyle(input).font;

      const width = textMeasureElement.getBoundingClientRect().width;
      return width;
    };
  });

  const { buttonX, updatePosition } = useDynamicButtonPosition({
    getTextWidth: getTextWidth(),
    containerRef: () => containerRef,
  });

  const handleApprove = () => {
    const inputValue = inputRef()?.value;
    const currentValue = inputValue ?? "";
    approveChanges(currentValue);
  };

  // Cleanup measurement element on unmount
  onCleanup(() => {
    if (textMeasureElement && textMeasureElement.parentNode) {
      textMeasureElement.parentNode.removeChild(textMeasureElement);
    }
  });

  return (
    <div
      ref={(el) => {
        containerRef = el;
        setContainerRef(el);
      }}
      class={`${styles.container} ${props.class || ''}`}
    >
      {isEditing() ? (
        <>
          <Input
            ref={setInputRef}
            value={initialValue()}
            onKeyDown={handleKeyDown}
            onKeyUp={updatePosition}
            onClick={updatePosition}
            onFocus={updatePosition}
            onInput={updatePosition}
            placeholder={props.placeholder}
            maxLength={props.maxLength}
            variant="clean"
            aria-label={`Edit ${props.placeholder || 'text'}`}
          />
          {props.showButtons !== false && (
            <div
              class={styles.buttons}
              style={{ left: `${buttonX()}px` }}
              role="toolbar"
              aria-label="Edit actions"
            >
              <Button
                onClick={handleApprove}
                variant="icon"
                size="extraSmall"
                aria-label="Save changes"
              >
                <CheckIcon />
              </Button>
              <Button
                onClick={cancelChanges}
                variant="icon"
                size="extraSmall"
                aria-label="Cancel changes"
              >
                <CancelIcon />
              </Button>
            </div>
          )}
        </>
      ) : (
        <p
          onclick={handleClick}
          class="truncate-text"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
          aria-label={`Click to edit ${props.placeholder || 'text'}`}
        >
          {props.value() || props.placeholder}
        </p>
      )}
    </div>
  );
};

export default EditableText;
