import React from "react";

// Types
interface Props {
  content: string;
}

const AntThinkingComponent = ({ content }: Props) => {
  return (
    <div style={{ backgroundColor: "#fff3cd", padding: "10px", borderRadius: "5px" }}>
      <h4>Thinking Content:</h4>
      <em>{content}</em>
    </div>
  );
};

export default AntThinkingComponent;
