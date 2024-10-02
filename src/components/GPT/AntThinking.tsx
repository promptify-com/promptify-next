import React from "react";
import Container from "@mui/material/Container";

interface Props {
  content: string;
}

const AntThinkingComponent = ({ content }: Props) => {
  return (
    <Container maxWidth={"md"}>
      <div style={{ backgroundColor: "#fff3cd", padding: "10px", borderRadius: "5px" }}>
        <h4>Thinking Content:</h4>
        <em>{content}</em>
      </div>
    </Container>
  );
};

export default AntThinkingComponent;
