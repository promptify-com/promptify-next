import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface TemplatesProps {
  executeId: number | null;
}

const initialState: TemplatesProps = {
  executeId: null,
};

export const templatesSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    setExecuteId: (state, action: PayloadAction<number>) => {
      state.executeId = action.payload;
    },
  },
});

export const { setExecuteId } = templatesSlice.actions;

export default templatesSlice.reducer;
