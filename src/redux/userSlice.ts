import { Gender } from "@/types/gender";
import { Role } from "@/types/role";
import { User } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState: User = {
  id: "",
  lastName: "",
  firstName: "",
  dob: "",
  gender: Gender.MALE,
  email: "",
  phone: "",
  role: Role.USER,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      const { id, dob, email, gender, firstName, lastName, phone, role } =
        action.payload;
      state.id = id;
      state.dob = dob;
      state.email = email;
      state.gender = gender;
      state.firstName = firstName;
      state.lastName = lastName;
      state.role = role;
      state.phone = phone;
    },
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
