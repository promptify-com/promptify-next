import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Execution } from "../api/dto/templates";

interface State {
  filters: {
    template: null | string;
    keyword: string;
  };
  openRenameDropdown: boolean;
  anchorElement: string | null;
  openDeleteDropdown: boolean;
  activeExecution: Execution | null;
}

const initialState: State = {
  filters: {
    template: null,
    keyword: "",
  },
  openRenameDropdown: false,
  anchorElement: null,
  openDeleteDropdown: false,
  activeExecution: null,
};

const executionsSlice = createSlice({
  name: "executions",
  initialState,
  reducers: {
    setOpenRenameDropdow: (state, action: PayloadAction<boolean>) => {
      state.openRenameDropdown = action.payload;
    },
    setAnchorElement: (state, action: PayloadAction<string | null>) => {
      state.anchorElement = action.payload;
    },
    setActiveExecution: (state, action: PayloadAction<Execution | null>) => {
      state.activeExecution = action.payload;
    },
  },
});

export const { setOpenRenameDropdow, setAnchorElement, setActiveExecution } = executionsSlice.actions;

export default executionsSlice.reducer;
