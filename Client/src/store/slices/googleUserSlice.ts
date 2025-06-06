import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { GoogleUser } from "@/types";

const initialState: GoogleUser = {
  email: "",
  name: "",
  picture: "",
  // iss: "",
  // azp: "",
  // aud: "",
  // sub: "",
  // email: "",
  // email_verified: false,
  // nbf: 0,
  // name: "",
  // picture: "",
  // given_name: "",
  // family_name: "",
  // iat: 0,
  // exp: 0,
  // jti: "",
};

const googleUserSlice = createSlice({
  name: "googleUser",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<GoogleUser>) => {
      state = action.payload;
      return state;
    },
    clearUser: () => {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = googleUserSlice.actions;
export default googleUserSlice.reducer;
