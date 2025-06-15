
import React from "react";
/**
 * VisuallyHidden: Utility component to hide content visually but keep it for screen readers
 */
export const VisuallyHidden: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span style={{
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0,0,0,0)",
    whiteSpace: "nowrap",
    border: 0,
  }}>
    {children}
  </span>
);
