import type { Component } from "solid-js";
import { project, updateProjectName } from "~/store/projectStore";
import { EditableText } from "~/components/base/";
import Footer from "~/components/app/footer";
import styles from "./App.module.css";

const App: Component = () => {
  return (
    <>
      <div class={styles.wrapper}>
        <div class={styles.app}>
          <div class={styles.top}>
            <EditableText
              onChange={(newName) => updateProjectName(newName)}
              placeholder="New Project"
              showButtons={true}
              value={() => project.projectName}
              maxLength={60}
              displayTooltip="Click to edit"
              displayTooltipDelay={500}
            />
          </div>
          <div class={styles.bottom}>
          <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
