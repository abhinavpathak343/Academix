import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/admin/Signup.jsx";
import AddCourse from "./components/admin/AddCourse.jsx";
import Courses from "./components/admin/Courses";
import Signin from "./components/admin/Signin";
import Course from "./components/admin/Course";
import { Landing } from "./components/admin/Landing.jsx";
import Appbar from "./components/admin/Appbar.jsx";
import { userState } from "./store/atoms/user.js";
import CourseLandingPage from "./components/user/Course-landing-page.jsx";
import { RecoilRoot, useSetRecoilState } from "recoil";
import axios from "axios";
import { BASE_URL } from "./config.js";
import { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Import the provider
import { ThemeProvider, createTheme } from "@mui/material";
export { InitUser }; // Export InitUser as a named export

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2196F3",
    },
    secondary: {
      main: "#21CBF3",
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
});



function App() {
  return (
    <GoogleOAuthProvider clientId="1004573158418-tuu4clins6au7dcblkbk9ke4ovplsrd3.apps.googleusercontent.com">
      <RecoilRoot>
        <ThemeProvider theme={darkTheme}>
          <div
            style={{
              width: "100vw",
              height: "100vh",
              backgroundColor: "#121212",
              color: "#ffffff",
            }}
          >
            <Router>
              <Appbar /> {/* Appbar rendered once at the app level */}
              <InitUser />
              <Routes>
                <Route path={"/addcourse"} element={<AddCourse />} />
                <Route path={"/course/:courseId"} element={<Course />} />
                <Route path={"/courses"} element={<Courses />} />
                <Route path={"/signin"} element={<Signin />} />
                <Route path={"/signup"} element={<Signup />} />
                <Route path={"/adminhome"} element={<Landing />} />
                <Route path={"/userhome"} element={<CourseLandingPage />} />
                {/* You might want to add a default route */}
                <Route path={"/"} element={<CourseLandingPage/>} />
              </Routes>
            </Router>
          </div>
        </ThemeProvider>
      </RecoilRoot>
    </GoogleOAuthProvider>
  );
}

function InitUser() {
  const setUser = useSetRecoilState(userState); // Function to update Recoil state

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setUser({ isLoading: false, userEmail: null, token: null });
          return;
        }

        const response = await axios.get(`${BASE_URL}/admin/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.username) {
          setUser({
            isLoading: false,
            userEmail: response.data.username,
            token,
          });
        } else {
          setUser({ isLoading: false, userEmail: null, token: null });
        }
      } catch (error) {
        setUser({ isLoading: false, userEmail: null, token: null });
      }
    };

    init();
  }, []);

  return null;
}

export default App;