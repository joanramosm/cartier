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
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Maximum character length */
  maxLength?: number;
  /** Input type */
  type?: "text" | "password" | "email" | "search" | "tel" | "url" | "number";
  /** Size variant */
  size?: "small" | "medium" | "large";
  /** Visual variant */
  variant?: "default" | "clean";
  /** Ref callback for accessing the input element */
  ref?: (element: HTMLInputElement) => void;
  /** Additional CSS classes */
  class?: string;
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** ARIA described by */
  'aria-describedby'?: string;
  /** Whether the input is required */
  required?: boolean;
  /** Minimum value (for number inputs) */
  min?: number | string;
  /** Maximum value (for number inputs) */
  max?: number | string;
  /** Step value (for number inputs) */
  step?: number | string;
  /** Pattern for validation */
  pattern?: string;
}

/**
 * A flexible input component with multiple variants, types, and accessibility features
 *
 * @example
 * ```tsx
 * <Input
 *   type="email"
 *   placeholder="Enter your email"
 *   onInput={(value) => setEmail(value)}
 *   required
 *   aria-label="Email address"
 * />
 *
 * <Input
 *   type="number"
 *   min={0}
 *   max={100}
 *   step={5}
 *   onChange={(value) => setQuantity(Number(value))}
 * />
 * ```
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
    'disabled',
    'maxLength',
    'type',
    'size',
    'variant',
    'ref',
    'class'
  ], [
    'aria-label',
    'aria-describedby',
    'required',
    'min',
    'max',
    'step',
    'pattern'
  ]);

  const size = () => local.size || "medium";
  const variant = () => local.variant || "default";
  const type = () => local.type || "text";

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
      type={type()}
      value={local.value ?? ''}
      onInput={handleInputEvent}
      onChange={handleChange}
      onKeyDown={local.onKeyDown}
      onKeyUp={local.onKeyUp}
      onClick={local.onClick}
      onFocus={local.onFocus}
      placeholder={local.placeholder}
      disabled={local.disabled}
      maxLength={local.maxLength}
      class={`${styles.input} ${styles[size()]} ${styles[variant()]} ${local.class || ''}`}
      {...inputProps}
      {...others}
    />
  );
};

export default Input;