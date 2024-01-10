import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Engine } from "@/core/api/dto/templates";

export interface Props {
  engines: Engine[];
  isTemplateOwner: boolean;
}

const initialState: Props = {
  engines: [],
  isTemplateOwner: false,
};

export const builderSlice = createSlice({
  name: "builder",
  initialState,
  reducers: {
    setEngines: (state, action: PayloadAction<Engine[]>) => {
      state.engines = action.payload;
    },
    setIsTemplateOwner: (state, action: PayloadAction<boolean>) => {
      state.isTemplateOwner = action.payload;
    },
  },
});

export const { setEngines, setIsTemplateOwner } = builderSlice.actions;

export default builderSlice.reducer;
