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
  
  export const selectStyle = {
    width: '250px',
    color: "inherit",
    ".MuiOutlinedInput-root": {
      color: "inherit",
    },
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: "inherit",
    },
    ".Mui-disabled .MuiOutlinedInput-notchedOutline": {
      bgcolor: "action.hover",
    }
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
  };
  
  export const typographyStyle = {
    fontSize: '20px',
    fontWeight: '400',
    color: "inherit"
  };