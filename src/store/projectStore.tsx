import { createStore } from "solid-js/store";

const [project, setProject] = createStore({
  projectName: "New Project",
});

const updateProjectName = (name: string) => {
  if (import.meta.env.DEV)
    console.log("[projectStore] Setting project name to ", name);
  setProject("projectName", name);
};

const resetProject = () => {
  if (import.meta.env.DEV)
    console.log("[projectStore] Resetting project to default");
  setProject({ projectName: "New Project" });
};

export { project, setProject, updateProjectName, resetProject };
