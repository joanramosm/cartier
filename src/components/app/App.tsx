import type { Component } from "solid-js";
import { project, updateProjectName } from "~/store/projectStore";
import EditableText from "~/components/base/EditableText";

const App: Component = () => {
  return (
    <>
      <EditableText
        onChange={(newName) => updateProjectName(newName)}
        placeholder="New Project"
        showButtons={true}
        value={() => project.projectName}
      />
    </>
  );
};

export default App;
