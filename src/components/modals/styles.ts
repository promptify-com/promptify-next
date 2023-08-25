export const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxHeight: "70vh",
  width: { xs: "90svw", md: "600px" },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { xs: "20px 10px", md: "32px" },
  display: "flex",
  flexDirection: "column",
  overflow: "scroll",
  overscrollBehavior: "contain",
};

export const fieldStyle = {
  width: { xs: "90%", md: "250px" },
  color: "inherit",
  ".MuiOutlinedInput-root": {
    color: "inherit",
  },
  ".MuiOutlinedInput-notchedOutline": {
    borderColor: "grey.600",
  },
  ".Mui-disabled .MuiOutlinedInput-notchedOutline": {
    bgcolor: "action.hover",
  },
  svg: {
    color: "inherit",
  },
  ".MuiChip-root": {
    bgcolor: "grey.400",
    borderColor: "grey.400",
    color: "common.black",
  },
};

export const boxStyle = {
  flexDirection: { md: "row" },
  justifyContent: "space-between",
  gap: 1,
  marginTop: "25px",
};

export const buttonBoxStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: 2,
  margin: "auto",
  marginTop: "50px",
  button: {
    maxWidth: "40%",
  },
  "button:hover": {
    bgcolor: "action.hover",
    color: "inherit",
  },
};

export const typographyStyle = {
  fontSize: "1rem",
  fontWeight: "500",
  color: "inherit",
  opacity: 0.6,
};

export const checkboxStyle = {
  color: "grey.600",
  "label, svg": {
    color: "grey.600",
  },
  label: {
    fontSize: "1rem",
    fontWeight: "400",
    color: "inherit",
  },
};
