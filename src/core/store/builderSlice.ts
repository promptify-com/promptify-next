import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Engine, TemplateStatus, Templates } from "@/core/api/dto/templates";

export interface Props {
  engines: Engine[];
  template: Templates | null;
  isTemplateOwner: boolean;
}

const initialState: Props = {
  engines: [],
  template: null,
  isTemplateOwner: false,
};

export const builderSlice = createSlice({
  name: "builder",
  initialState,
  reducers: {
    setEngines: (state, action: PayloadAction<Engine[]>) => {
      state.engines = action.payload;
    },
    setTemplate: (state, action: PayloadAction<Templates>) => {
      state.template = action.payload;
    },
    setIsTemplateOwner: (state, action: PayloadAction<boolean>) => {
      state.isTemplateOwner = action.payload;
    },
  },
});

export const { setEngines, setTemplate, setIsTemplateOwner } = builderSlice.actions;

export default builderSlice.reducer;
