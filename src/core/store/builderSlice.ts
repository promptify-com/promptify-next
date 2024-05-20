import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Engine, Templates } from "@/core/api/dto/templates";
import { IBuilderSliceState } from "./types";

export const initialState: IBuilderSliceState = {
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
