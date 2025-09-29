import { Component, JSX, splitProps } from "solid-js";
import styles from "./Input.module.css";

/**
 * Props for the Input component
 */
interface InputProps {
  /** Input value */
  value?: string | number;
  /** Handler for input events (fires on every keystroke) */
  onInput?: (value: string) => void;
  /** Handler for change events (fires on blur) */
  onChange?: (value: string) => void;
  /** Handler for key down events */
  onKeyDown?: (event: KeyboardEvent) => void;
  /** Handler for key up events */
  onKeyUp?: (event: KeyboardEvent) => void;
  /** Handler for click events */
  onClick?: (event: MouseEvent) => void;
  /** Handler for focus events */
  onFocus?: (event: FocusEvent) => void;
  /** Handler for raw input events (advanced usage) */
  onInputEvent?: (event: Event) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Maximum character length */
  maxLength?: number;
  /** Ref callback for accessing the input element */
  ref?: (element: HTMLInputElement) => void;
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** ARIA described by */
  'aria-describedby'?: string;
  /** Whether the input is required */
  required?: boolean;
  /** Additional class names */
  class?: string;
}

/**
 * A flexible input component with multiple variants, types, and accessibility features
 *
 * @example
 * ```tsx
 * <Input
 *   placeholder="Placeholder username"
 *   onInput={(value) => setEmail(value)}
 *   required
 *   aria-label="Username"
 * />
 *
 */
const Input: Component<InputProps> = (props) => {
  const [local, inputProps, others] = splitProps(props, [
    'value',
    'onInput',
    'onChange',
    'onKeyDown',
    'onKeyUp',
    'onClick',
    'onFocus',
    'onInputEvent',
    'placeholder',
    'maxLength',
    'ref',
  ], [
    'aria-label',
    'aria-describedby',
    'required',
  ]);

  const handleInput = (event: Event) => {
    const target = event.currentTarget as HTMLInputElement;
    if (target) {
      local.onInput?.(target.value);
    }
  };

  const handleChange = (event: Event) => {
    const target = event.currentTarget as HTMLInputElement;
    if (target) {
      local.onChange?.(target.value);
    }
  };

  const handleInputEvent = (event: Event) => {
    handleInput(event);
    local.onInputEvent?.(event);
  };

  return (
    <input
      ref={local.ref}
      type="text"
      value={local.value ?? ''}
      onInput={handleInputEvent}
      onChange={handleChange}
      onKeyDown={local.onKeyDown}
      onKeyUp={local.onKeyUp}
      onClick={local.onClick}
      onFocus={local.onFocus}
      placeholder={local.placeholder}
      maxLength={local.maxLength}
      class={props.class ? `${styles.input} ${props.class}` : styles.input}
      {...inputProps}
      {...others}
    />
  );
};

export default Input;
