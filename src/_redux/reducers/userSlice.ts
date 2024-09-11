import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/core/api/dto/user";
import { LocalStorage } from "@/common/storage";

// Types
export interface IUserSliceState {
  currentUser: User | null;
}
//
const initialState: IUserSliceState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload ? Object.freeze(action.payload) : null;

      LocalStorage.set("currentUser", JSON.stringify(action.payload ?? {}));
    },
  },
});

export const isValidUserFn = ({ user }: { user: IUserSliceState }) =>
  Boolean(user.currentUser?.id && user.currentUser?.username);

export const isAdminFn = ({ user }: { user: IUserSliceState }) =>
  Boolean(user.currentUser && user.currentUser?.is_admin);

export const { updateUser } = userSlice.actions;

export default userSlice.reducer;
