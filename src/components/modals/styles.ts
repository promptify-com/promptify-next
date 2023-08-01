export const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxHeight: '70vh',
  width: '600px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'scroll',
  overscrollBehavior: 'contain',
};
  
export const fieldStyle = {
  width: '250px',
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
  "svg": {
    color: "inherit",
  },
  ".MuiChip-root": {
    bgcolor: "grey.400",
    borderColor: "grey.400",
    color: "common.black",
  },
};

export const boxStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '100px',
  marginTop: '25px',
};

export const buttonBoxStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignSelf: 'center',
  width: '250px',
  margin: 'auto',
  marginTop: '50px',
  "button:hover": {
    bgcolor: "action.hover",
    color: "inherit"
  },
};

export const typographyStyle = {
  fontSize: '1rem',
  fontWeight: '500',
  color: "inherit",
  opacity: .6
};

export const checkboxStyle = {
  color: "grey.600",
  "label, svg": {
    color: "grey.600",
  },
  "label": {
    fontSize: '1rem',
    fontWeight: '400',
    color: "inherit"
  }
};