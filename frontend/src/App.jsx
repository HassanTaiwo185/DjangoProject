import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./pages/Signup";
import RegisterPage from "./pages/Register";
import ConfirmUserPage from "./pages/ConfirmUser";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import EditUserForm from "./pages/EditUserForm";
import TeamLeaderDashboard from "./pages/TeamLeaderDashboard";
import TeamMemberDashboard from "./pages/TeamMemberDashboard";
import User from "./components/Users";
import InviteTeamMemberForm from "./pages/InviteTeamMemberForm";
import CreateStandup from "./components/CreateStandup";
import StandupPage from "./components/StandupPage";
import ChatRoom from "./components/ChatRoom";
import EditStandupForm from "./components/EditStandupForm";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<SignupPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/confirm/user" element={<ConfirmUserPage />} />
        <Route path="/forgot/password" element={<ForgotPasswordPage />} />
        <Route path="/reset/password" element={<ResetPasswordPage />} />
        <Route path="/edit/user/:id" element={<EditUserForm />} />

        <Route path="/teamleader/dashboard" element={<TeamLeaderDashboard />} />
        <Route path="/member/dashboard" element={<TeamMemberDashboard />} />
        <Route path="/manage/team/members" element={<User />} /> 
        <Route path="/invite/team/member" element={<InviteTeamMemberForm />} />
        <Route path="/standups" element={<StandupPage/>} />
        <Route path="/createstandups" element={<CreateStandup />} />
        <Route path="/chatroom/:roomId/:standupId" element={<ChatRoom />} />
        <Route path="/edit/standup/:id" element={<EditStandupForm />} />

         
        
       
      </Routes>
    </Router>
  );
}

export default App;
