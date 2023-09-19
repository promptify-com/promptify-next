import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { IParameters } from "@/common/types";
import { INodesData } from "@/common/types/builder";
import { useParameters } from "@/hooks/api/parameters";

interface IModal {
  open: boolean;
  selectedNodeData: INodesData | null;
  onClose: (value: boolean) => void;
  onClick: (param: IParameters) => void;
}

export default function ParametersModal({ open, selectedNodeData, onClose, onClick }: IModal) {
  const [parameters] = useParameters();

  const params = parameters.filter(
    param => !selectedNodeData?.parameters.find(existsParam => existsParam.parameter_id === param.id),
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "white",
          borderRadius: "8px",
          boxShadow: 24,
          p: 4,
          overflow: "scroll",
          height: "80vh",
        }}
      >
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
        {params.length ? (
          params.map(parameter => {
            return (
              <Box
                key={parameter.id}
                onClick={() => onClick(parameter)}
              >
                <Typography
                  sx={{
                    mt: 2,
                    fontFamily: "Space Mono",
                    fontSize: 16,
                    cursor: "pointer",
                    color: "black",
                  }}
                >
                  {parameter.name}
                </Typography>
              </Box>
            );
          })
        ) : (
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: "400",
              color: "grey",
              py: "20svh",
              textAlign: "center",
            }}
          >
            No parameters found
          </Typography>
        )}
      </Box>
    </Modal>
  );
}
