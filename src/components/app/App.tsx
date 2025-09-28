import type { Component } from "solid-js";
import { project, updateProjectName } from "~/store/projectStore";
import EditableText from "~/components/base/editableText/";
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
              maxLength={120}
            />
          </div>
          <div class={styles.bottom}>Bottom</div>
        </div>
      </div>
    </>
  );
};

export default App;
