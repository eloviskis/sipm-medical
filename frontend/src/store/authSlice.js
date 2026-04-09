import { createSlice } from "@reduxjs/toolkit";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "./axiosInterceptors";

const savedUser = JSON.parse(localStorage.getItem('sipm_user') || 'null');
const savedToken = localStorage.getItem('sipm_token') || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser,
    token: savedToken,
    isAuthenticated: !!savedToken,
    loading: true,
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        localStorage.setItem('sipm_user', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('sipm_user');
      }
    },
    setToken(state, action) {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem('sipm_token', action.payload);
      } else {
        localStorage.removeItem('sipm_token');
      }
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
      localStorage.removeItem('sipm_user');
      localStorage.removeItem('sipm_token');
    },
  },
});

export const { setUser, setToken, setLoading, setError, logout } = authSlice.actions;

export const initializeAuthListener = () => (dispatch) => {
  const auth = getAuth();
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const token = await firebaseUser.getIdToken();
      dispatch(setToken(token));

      // Fetch user profile from backend to get role/permissions
      try {
        const res = await axios.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profile = res.data;
        dispatch(setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || profile.name,
          role: profile.role || "paciente",
          permissions: profile.permissions || [],
          clinicId: profile.clinicId || null,
        }));
      } catch {
        // Backend not reachable — use Firebase-only data
        dispatch(setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          role: "paciente",
          permissions: [],
          clinicId: null,
        }));
      }
    } else {
      dispatch(logout());
    }
    dispatch(setLoading(false));
  });
};

export default authSlice.reducer;
