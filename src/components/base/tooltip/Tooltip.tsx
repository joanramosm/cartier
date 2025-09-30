import { Component, createSignal, JSX } from "solid-js";
import styles from "./Tooltip.module.css";

interface TooltipProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number; // delay in milliseconds before showing tooltip
  children: JSX.Element;
}

const Tooltip: Component<TooltipProps> = (props) => {
  const [isVisible, setIsVisible] = createSignal(false);
  const position = () => props.position || "top";
  const delay = () => props.delay || 0;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const handleMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
    if (delay() === 0) {
      setIsVisible(true);
    } else {
      timeoutId = setTimeout(() => setIsVisible(true), delay());
    }
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  return (
    <div 
      class={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {props.children}
      <div class={`${styles.tooltip} ${styles[position()]}`} classList={{ [styles.visible]: isVisible() }}>
        {props.content}
      </div>
    </div>
  );
};

export default Tooltip;