import Typography from "@mui/material/Typography";
import { theme } from "@/theme";
import { useState } from "react";

import IconButton from "@mui/material/IconButton";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

interface IProps {
  input: [string, string];
}

export const InputsItem = ({ input }: IProps) => {
  const [isShowVariables, setIsShowVariables] = useState(false);

  return (
    <Box
      display="flex"
      alignItems="center"
    >
      <Typography
        key={input[0]}
        fontSize={14}
        fontWeight={500}
        color={"secondary.main"}
        sx={inputStyle}
      >
        {input[0]}: {isShowVariables ? <span className="val">{input[1]}</span> : null}
      </Typography>
      {!isShowVariables && (
        <Box
          component="div"
          display="flex"
          onClick={() => setIsShowVariables(true)}
          sx={{ cursor: "pointer" }}
        >
          <VisibilityOutlined />
        </Box>
      )}
    </Box>
  );
};

const inputStyle = {
  p: "12px 16px",
  wordBreak: "break-all",
  maxHeight: "120px",
  overflow: "auto",
  "::-webkit-scrollbar": {
    display: "none",
  },
  ".val": { fontWeight: 400, flexWrap: "wrap" },
  ":not(:last-of-type)": { borderBottom: `1px solid ${theme.palette.surfaceContainerHigh}` },
};
