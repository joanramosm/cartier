import type { Component } from "solid-js";
import EditableText from "./components/shared/EditableText";

const App: Component = () => {
  return (
    <>
      <EditableText text="Hello world!" />
    </>
  );
};

export default App;
