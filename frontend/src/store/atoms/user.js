import {
  atom
} from "recoil";

export const userState = atom({
  key: "userState", // Unique key for Recoil
  default: {
    isLoading: true, // Shows loading until we fetch user info
    userEmail: null, // Stores the email if logged in
    token: localStorage.getItem("token") || null, // Check localStorage initially
  },
});
