import { createSlice } from "@reduxjs/toolkit";

export interface IRemoveDialogSliceState {
  open: boolean;
  title: string;
  content: string;
  loading: boolean;
  onSubmit: () => void;
}

export const initialState: IRemoveDialogSliceState = {
  open: false,
  title: "Remove AI App",
  content: "Are you sure you want to remove this AI App?",
  loading: false,
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
      state.loading = false;
      state.onSubmit = onSubmit;
    },
    handleClose: state => {
      state.open = false;
      state.title = "Remove AI App",
      state.content = "Are you sure you want to remove this AI App?",
      state.loading = false;
      state.onSubmit = () => {};
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { handleOpen, handleClose, setLoading } = removeDialogSlice.actions;

export default removeDialogSlice.reducer;
