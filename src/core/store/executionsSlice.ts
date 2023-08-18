import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Execution, ExecutionTemplatePopupType } from "../api/dto/templates";

interface State {
  filters: {
    template: null | string;
    keyword: string;
  };
  openPopup: boolean;
  popupType: ExecutionTemplatePopupType;
  sparkTitle: string;
  activeExecution: Execution | null;
}

const initialState: State = {
  filters: {
    template: null,
    keyword: "",
  },
  openPopup: false,
  popupType: "update",
  sparkTitle: "",
  activeExecution: null,
};

const executionsSlice = createSlice({
  name: "executions",
  initialState,
  reducers: {
    handleOpenPopup: (state, action: PayloadAction<boolean>) => {
      state.openPopup = action.payload;
    },
    handlePopupType: (state, action: PayloadAction<ExecutionTemplatePopupType>) => {
      state.popupType = action.payload;
    },
    updateSparkTitle: (state, action: PayloadAction<string>) => {
      state.sparkTitle = action.payload;
    },
    setActiveExecution: (state, action: PayloadAction<Execution | null>) => {
      state.activeExecution = action.payload;
    },
  },
});

export const { handleOpenPopup, handlePopupType, updateSparkTitle, setActiveExecution } = executionsSlice.actions;

export default executionsSlice.reducer;
