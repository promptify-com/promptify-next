import { createSlice, PayloadAction } from "@reduxjs/toolkit";
//
import { Engine, Templates } from "@/core/api/dto/templates";
// Types
export interface IBuilderSliceState {
  engines: Engine[];
  template: Templates | null;
  isTemplateOwner: boolean;
}
//
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
