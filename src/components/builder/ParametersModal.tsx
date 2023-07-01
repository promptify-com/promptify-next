import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { IParameters } from "@/common/types";
import { INodesData } from "@/common/types/builder";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflow: "scroll",
  height: "80vh",
};

interface IModal {
  parameters: IParameters[];
  open: boolean;
  handleClose: (value: boolean) => void;
  handleClick: (value: number) => void;
  selectedNodeData: INodesData | null;
}

export default function ParametersModal({
  parameters,
  open,
  handleClose,
  handleClick,
  selectedNodeData,
}: IModal) {
  const checkAreChoosen = (id: number) => {
    const areIdAreAdded = selectedNodeData?.parameters?.find((prompt) => {
      return prompt.parameter_id === id;
    });
    if (areIdAreAdded) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography
          sx={{
            display: "flex",
            fontFamily: "Space Mono",
            fontSize: 22,
            fontWeight: "600",
            alignSelf: "center",
          }}
        >
          Click on parameter to add
        </Typography>
        {parameters.map((parameter) => {
          return (
            <Box
              key={parameter.id}
              onClick={() => {
                if (!checkAreChoosen(parameter.id)) {
                  handleClick(parameter.id);
                }
              }}
            >
              <Typography
                sx={{
                  mt: 2,
                  fontFamily: "Space Mono",
                  fontSize: 16,
                  cursor: checkAreChoosen(parameter.id)
                    ? "not-allowed"
                    : "pointer",
                  color: checkAreChoosen(parameter.id) ? "grey" : "black",
                }}
              >
                {parameter.name}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Modal>
  );
}
