import { IEditPrompts } from "@/common/types/builder";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Engine } from "../api/dto/templates";

interface InitilaValues {
  prompts: IEditPrompts[];
  engines: Engine[];
}

const initialState: InitilaValues = {
  prompts: [],
  engines: [],
};

const builderSlice = createSlice({
  name: "builder",
  initialState,
  reducers: {
    handlePrompts: (state, action: PayloadAction<IEditPrompts[]>) => {
      state.prompts = action.payload;
    },
    handleEngines: (state, action: PayloadAction<Engine[]>) => {
      state.engines = action.payload;
    },
  },
});

export const { handlePrompts, handleEngines } = builderSlice.actions;

export default builderSlice.reducer;
