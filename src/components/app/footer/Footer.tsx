import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import CaretUpIcon from "~/icons/caretUpIcon";
import CaretDownIcon from "~/icons/caretDownIcon";
import AddImageIcon from "~/icons/addImageIcon";
import styles from "./Footer.module.css";
import { Button, Tooltip } from "~/components/base";

const Footer: Component = () => {
  const [isFooterCollapsed, setIsFooterCollapsed] = createSignal(false);

  return (
    <div class={styles.menu}>
      <div
        class={styles.handle}
        role="button"
        onClick={() => setIsFooterCollapsed(!isFooterCollapsed())}
      >
        <div class={styles.icon}>
          {isFooterCollapsed() ? <CaretUpIcon /> : <CaretDownIcon />}
        </div>
      </div>
      <div
        class={styles.content}
        classList={{ [styles.hidden]: isFooterCollapsed() }}
      >
        <div class={styles.toolbar}>
          <Button
            variant="minimal"
            size="large"
            onClick={() => alert("Button 1 clicked")}
            aria-label="Add image"
            padding="medium"
          >
            <Tooltip content="Add image" position="top" delay={500}>
              <AddImageIcon />
            </Tooltip>
          </Button>
        </div>
        <div class={styles.gallery}>Cool images</div>
      </div>
    </div>
  );
};

export default Footer;
