import { createSlice } from "@reduxjs/toolkit";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const savedUser = JSON.parse(localStorage.getItem('sipm_user') || 'null');
const savedToken = localStorage.getItem('sipm_token') || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser,
    token: savedToken,
    isAuthenticated: !!savedToken,
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem('sipm_token', action.payload);
      }
    },
    setError(state, action) {
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('sipm_user');
      localStorage.removeItem('sipm_token');
    },
  },
});

export const { setUser, setToken, setError, logout } = authSlice.actions;

export const initializeAuthListener = () => (dispatch) => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      }));
      dispatch(setToken(user.accessToken || localStorage.getItem('sipm_token')));
    } else {
      dispatch(logout());
    }
  });
};

export default authSlice.reducer;
