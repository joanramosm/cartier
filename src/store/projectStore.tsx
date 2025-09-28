import { createStore } from "solid-js/store";

const [project, setProject] = createStore({
  projectName: "New Project",
});

const updateProjectName = (name: string) => {
  setProject("projectName", name);
};

const resetProject = () => {
  setProject({ projectName: "New Project" });
};

export { project, setProject, updateProjectName, resetProject };
