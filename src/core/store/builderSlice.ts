import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Engine } from "@/core/api/dto/templates";

export interface Props {
  engines: Engine[];
}

const initialState: Props = {
  engines: [],
};

export const builderSlice = createSlice({
  name: "builder",
  initialState,
  reducers: {
    setEngines: (state, action: PayloadAction<Engine[]>) => {
      state.engines = action.payload;
    },
  },
});

export const { setEngines } = builderSlice.actions;

export default builderSlice.reducer;
