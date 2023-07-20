import { createSlice } from '@reduxjs/toolkit';

interface SelectedEngineState {
  engine: number | null;
}

const initialState: SelectedEngineState = {
  engine: null,
};

export const enginesSlice = createSlice({
  name: 'engines',
  initialState,
  reducers: {
    setSelectedEngine: (state, action) => {
      state.engine = action.payload;
    },
  },
});

export const { setSelectedEngine } = enginesSlice.actions;
export default enginesSlice.reducer;
