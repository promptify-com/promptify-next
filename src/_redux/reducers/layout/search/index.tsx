import { createSlice } from "@reduxjs/toolkit";

// Types
export interface ISearchSliceState {
  open: boolean;
  search: string;
}

// initial state
export const initialState: ISearchSliceState = {
  open: true,
  search: "",
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    handleOpen: state => {
      state.open = true;
      state.search = "";
    },
    handleClose: state => {
      state.open = false;
      state.search = "";
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { handleOpen, handleClose, setSearch } = searchSlice.actions;

export default searchSlice.reducer;
