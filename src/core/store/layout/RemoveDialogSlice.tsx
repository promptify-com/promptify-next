import { createSlice } from "@reduxjs/toolkit";

export interface IRemoveDialogSliceState {
  open: boolean;
  title: string;
  content: string;
  onSubmit: () => void;
}

export const initialState: IRemoveDialogSliceState = {
  open: false,
  title: "",
  content: "",
  onSubmit: () => {},
};

export const removeDialogSlice = createSlice({
  name: "remove_dialog",
  initialState,
  reducers: {
    handleOpen: (state, action) => {
      const { content, title, onSubmit } = action.payload;
      state.open = true;
      state.title = title;
      state.content = content;
      state.onSubmit = onSubmit;
    },
    handleClose: state => {
      state.open = false;
      state.title = "";
      state.content = "";
      state.onSubmit = () => {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { handleOpen, handleClose } = removeDialogSlice.actions;

export default removeDialogSlice.reducer;
