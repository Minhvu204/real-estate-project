import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import { ProfileLayout } from "./pages/Profile/ProfileLayout";
import { PersonalInfo } from "./pages/Profile/PersonalInfo";
import { ChangePassword } from "./pages/Profile/ChangePassword";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/profile" element={<ProfileLayout />}>
          <Route path="personal-info" element={<PersonalInfo />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;