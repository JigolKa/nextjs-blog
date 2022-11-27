import { createSlice, Slice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { User } from "@prisma/client";

// Define a type for the slice state
interface UserState {
 user: User | null;
 ip: string | null;
}

// Define the initial state using that type
const initialState: UserState = {
 user: null,
 ip: null,
};

export const userSlice: Slice<UserState> = createSlice({
 name: "user",
 // `createSlice` will infer the state type from the `initialState` argument
 initialState,
 reducers: {
  setUser: (state, action: PayloadAction<User>) => {
   state.user = action.payload;
  },

  resetUser: (state) => {
   state.user = null;
  },

  setIP: (state, action: PayloadAction<string>) => {
   state.ip = action.payload;
  },

  resetIP: (state) => {
   state.ip = null;
  },
 },
});

export const { setUser, resetUser, setIP, resetIP } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.user;

export default userSlice.reducer;
