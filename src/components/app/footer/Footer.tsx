import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import CaretUpIcon from "~/icons/caretUpIcon";
import CaretDownIcon from "~/icons/caretDownIcon";
import styles from "./Footer.module.css";

const Footer: Component = () => {
  const [isFooterCollapsed, setIsFooterCollapsed] = createSignal(false);

  return (
    <div class={styles.menu}>
      <div class={styles.handle} role="button" onClick={() => setIsFooterCollapsed(!isFooterCollapsed())}>
        <div class={styles.icon}>{isFooterCollapsed() ? <CaretUpIcon /> : <CaretDownIcon />}</div>
      </div>
      <div class={styles.content} classList={{ [styles.hidden]: isFooterCollapsed() }}>
        Hello world!
      </div>
    </div>
  );
};

export default Footer;
