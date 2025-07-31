
import { useNavigate } from "react-router-dom";


const TeamLeaderDashboard = () => {
   const navigate = useNavigate();

  const goToUserManagement = () => {
    navigate("/manage/team/members");
  };
  return (
    <div>
      <h1>Admin Dashboard</h1>

       <button
        onClick={goToUserManagement}
      >
        Show and Manage Team Members
      </button>
      
    </div>
  );
};

export default TeamLeaderDashboard;
