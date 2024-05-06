import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { IParameters } from "@/common/types";
import { IEditPrompts } from "@/common/types/builder";
import { useGetParametersQuery } from "@/core/api/parameters";
import { Button, ListItemButton } from "@mui/material";

interface IModal {
  open: boolean;
  selectedNodeData: IEditPrompts | null;
  onClose: (value: boolean) => void;
  onClick: (param: IParameters) => void;
}

export default function ParametersModal({ open, selectedNodeData, onClose, onClick }: IModal) {
  const { data: parameters } = useGetParametersQuery();

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
            fontFamily: "var(--font-mono)",
            fontSize: 22,
            fontWeight: "600",
            alignSelf: "center",
          }}
        >
          Click on parameter to add
        </Typography>
        {parameters?.length ? (
          parameters.map(parameter => {
            return (
              <ListItemButton
                key={parameter.id}
                onClick={() => onClick(parameter)}
                disabled={selectedNodeData?.parameters.some(prompt => prompt.parameter_id === parameter.id)}
                sx={{
                  mt: 2,
                  fontFamily: "var(--font-mono)",
                  fontSize: 16,
                  cursor: "pointer",
                  color: "black",
                  width: "100%",
                  textAlign: "start",
                }}
              >
                {parameter.name}
              </ListItemButton>
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
