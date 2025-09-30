import { Component } from 'solid-js';

const UploadIcon: Component = () => {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
      width="16"
      height="16"
    >
      <path d="M16 16l-4-4-4 4"/>
      <path d="M12 12v9"/>
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
      <polyline points="16,16 12,12 8,16"/>
    </svg>
  );
}

export default UploadIcon;
