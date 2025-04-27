import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminSignup from "./components/admin/AdminSignup.jsx";
import AddCourse from "./components/admin/AddCourse.jsx";
import Courses from "./components/admin/Courses";
import AdminSignin from "./components/admin/AdminSignin.jsx";
import UserSignin from "./components/user/Usersignin.jsx";
import UserSignup from "./components/user/Usersignup.jsx";
import Course from "./components/admin/Course";
import { Landing } from "./components/admin/Landing.jsx";
import Appbar from "./components/admin/Appbar.jsx";
import { userState } from "./store/atoms/user.js";
import CourseLandingPage from "./components/user/CourseLandingPage.jsx";
import { RecoilRoot, useSetRecoilState } from "recoil";
import axios from "axios";
import { BASE_URL } from "./config.js";
import { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Import the provider
import { ThemeProvider, createTheme } from "@mui/material";
import ExploreCoursesPage from "./components/user/ExploreCoursesPage";
import CourseDescription from "./components/user/Coursedescription";
import LiveClass from "./components/user/LiveClass.jsx";
import InitUser from "./components/InitUser";
// Create a dark theme
import Room from "./components/user/Room.jsx";
import { SocketProvider } from "./Providers/socket.jsx";
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
    <SocketProvider>
      <GoogleOAuthProvider clientId="1004573158418-tuu4clins6au7dcblkbk9ke4ovplsrd3.apps.googleusercontent.com">
        <RecoilRoot>
          <InitUser /> {/* Add this line before ThemeProvider */}
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
                <Routes>
                  <Route path={"/addcourse"} element={<AddCourse />} />
                  <Route path={"/course/:courseId"} element={<Course />} />
                  <Route path={"/courses"} element={<Courses />} />
                  <Route path={"/adminsignin"} element={<AdminSignin />} />
                  <Route path={"/adminsignup"} element={<AdminSignup />} />
                  <Route path={"/usersignin"} element={<UserSignin />} />
                  <Route path={"/usersignup"} element={<UserSignup />} />
                  <Route path={"/adminhome"} element={<Landing />} />
                  <Route path={"/userhome"} element={<CourseLandingPage />} />
                  <Route path={"/Liveclass"} element={<LiveClass />} />
                  <Route path="/room/:roomCode" element={<Room />} />
                  <Route
                    path={"/explore-courses"}
                    element={<ExploreCoursesPage />}
                  />
                  <Route path={"/"} element={<CourseLandingPage />} />
                  <Route
                    path="user/course/:courseId"
                    element={<CourseDescription />}
                  />
                  <Route
                    path="/user/course/:courseId"
                    element={<CourseDescription />}
                  />
                </Routes>
              </Router>
            </div>
          </ThemeProvider>
        </RecoilRoot>
      </GoogleOAuthProvider>
    </SocketProvider>
  );
}

export default App;
