import { Component, JSX } from "solid-js";
import styles from "./Button.module.css";

interface ButtonProps {
  children: JSX.Element;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "icon";
  size?: "extraSmall" | "small" | "medium" | "large";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button: Component<ButtonProps> = (props) => {
  const variant = () => props.variant || "primary";
  const size = () => props.size || "medium";

  return (
    <button
      class={`${styles.button} ${styles[variant()]} ${styles[size()]}`}
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type || "button"}
    >
      {props.children}
    </button>
  );
};

export default Button;
