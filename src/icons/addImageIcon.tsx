import { Component } from "solid-js";

const AddImageIcon: Component = () => {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
      width="16"
      height="16"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <g transform="translate(15,15)">
        <line x1="0" y1="-3" x2="0" y2="3" />
        <line x1="-3" y1="0" x2="3" y2="0" />
      </g>
    </svg>
  );
};

export default AddImageIcon;