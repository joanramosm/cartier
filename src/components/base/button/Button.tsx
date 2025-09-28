import { Component, JSX, splitProps } from "solid-js";
import styles from "./Button.module.css";

/**
 * Props for the Button component
 */
interface ButtonProps {
  /** Button content */
  children: JSX.Element;
  /** Click handler */
  onClick?: () => void;
  /** Visual variant of the button */
  variant?: "primary" | "secondary" | "icon";
  /** Size of the button */
  size?: "extraSmall" | "small" | "medium" | "large";
  /** Whether the button is disabled */
  disabled?: boolean;
  /** HTML button type */
  type?: "button" | "submit" | "reset";
  /** Loading state */
  loading?: boolean;
  /** Additional CSS classes */
  class?: string;
  /** ARIA label for accessibility */
  'aria-label'?: string;
}

/**
 * A flexible button component with multiple variants and sizes
 * Supports loading states, keyboard navigation, and accessibility features
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="medium" onClick={handleClick}>
 *   Click me
 * </Button>
 *
 * <Button variant="icon" size="small" aria-label="Delete item">
 *   <DeleteIcon />
 * </Button>
 *
 * <Button loading={true} disabled>
 *   Processing...
 * </Button>
 * ```
 */
const Button: Component<ButtonProps> = (props) => {
  const [local, others] = splitProps(props, [
    'children',
    'onClick',
    'variant',
    'size',
    'disabled',
    'type',
    'loading',
    'class'
  ]);

  const variant = () => local.variant || "primary";
  const size = () => local.size || "medium";
  const isDisabled = () => local.disabled || local.loading;

  const handleClick = () => {
    if (!isDisabled() && local.onClick) {
      local.onClick();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // Handle keyboard activation for accessibility
    if ((e.key === 'Enter' || e.key === ' ') && !isDisabled()) {
      e.preventDefault();
      local.onClick?.();
    }
  };

  return (
    <button
      class={`${styles.button} ${styles[variant()]} ${styles[size()]} ${local.class || ''} ${local.loading ? styles.loading : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={isDisabled()}
      type={local.type || "button"}
      aria-label={props['aria-label']}
      {...others}
    >
      {local.loading && (
        <span class={styles.loadingSpinner} aria-hidden="true">
          ⟳
        </span>
      )}
      <span class={local.loading ? styles.loadingContent : ''}>
        {local.children}
      </span>
    </button>
  );
};

export default Button;
