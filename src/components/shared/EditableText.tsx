import type { Component } from "solid-js";

interface EditableTextProps {
  text?: string;
}

const EditableText: Component<EditableTextProps> = (props) => {
  return (
    <div>
      <p>{props.text}</p>
      <input type="text" value={props.text} />
    </div>
  );
};

export default EditableText;
