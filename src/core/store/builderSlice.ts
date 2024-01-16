import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Engine, TemplateStatus } from "@/core/api/dto/templates";

export interface Props {
  engines: Engine[];
  isTemplateOwner: boolean;
  templateStatus: TemplateStatus | null;
}

const initialState: Props = {
  engines: [],
  isTemplateOwner: false,
  templateStatus: null,
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
    setIsTemplateStatus: (state, action: PayloadAction<boolean>) => {
      state.isTemplateOwner = action.payload;
    },
    setTemplateStatus: (state, action: PayloadAction<TemplateStatus>) => {
      state.templateStatus = action.payload;
    },
  },
});

export const { setEngines, setIsTemplateOwner, setTemplateStatus } = builderSlice.actions;

export default builderSlice.reducer;
