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
  variant?: "primary" | "secondary" | "minimal";
  /** Size of the button */
  size?: "small" | "medium" | "large";
  /** Padding level */
  padding?: "none" | "small" | "medium" | "large";
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
 * <Button variant="icon" size="small" aria-label="Delete item" padding="small">
 *   <DeleteIcon />
 * </Button>
 * ```
 */
const Button: Component<ButtonProps> = (props) => {
  const [local, others] = splitProps(props, [
    'children',
    'onClick',
    'variant',
    'size',
    'padding',
  ]);

  const variant = () => local.variant || "primary";
  const size = () => props.size || "medium";
  const padding = () => local.padding || "medium";

  const handleClick = () => {
    local.onClick?.();
  };

  const button = (
    <button
      class={styles.button}
      classList={{
        [styles[variant()]]: true,
        [styles[size()]]: true,
        [styles[`padding-${padding()}`]]: true,
      }}
      onClick={handleClick}
      type="button"
      aria-label={props['aria-label']}
      {...others}
    >
        {local.children}
    </button>
  );

  return button;
};

export default Button;
