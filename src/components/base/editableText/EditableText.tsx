import { Component } from "solid-js";
import styles from "./EditableText.module.css";
import CancelIcon from "~/icons/cancelIcon";
import CheckIcon from "~/icons/checkIcon";
import { useEditableState } from "~/hooks/useEditableState"; // Adjust path as needed
import { useClickOutside } from "~/hooks/useClickOutside";

interface EditableTextProps {
  value: () => string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  showButtons?: boolean;
}

const EditableText: Component<EditableTextProps> = (props) => {
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

  const handleApprove = () => {
    const inputValue = inputRef()?.value;
    const currentValue = inputValue || "";
    approveChanges(currentValue);
  };

  return (
    <div ref={setContainerRef} class={styles.container}>
      {isEditing() ? (
        <>
          <input
            ref={setInputRef}
            type="text"
            value={initialValue()}
            onKeyDown={handleKeyDown}
            placeholder={props.placeholder}
            class="clean-text-input"
          />
          {props.showButtons !== false && (
            <div class={styles.buttons}>
              <button onClick={handleApprove} type="button">
                <CheckIcon />
              </button>
              <button onClick={cancelChanges} type="button">
                <CancelIcon />
              </button>
            </div>
          )}
        </>
      ) : (
        <p onclick={handleClick} class="truncate-text">
          {props.value() || props.placeholder}
        </p>
      )}
    </div>
  );
};

export default EditableText;
