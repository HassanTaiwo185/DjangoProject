
import { useNavigate } from "react-router-dom";


const TeamMemberDashboard = () => {
   const navigate = useNavigate();

  const goToUserManagement = () => {
    navigate("/manage/team/members");
  };
  return (
    <div>
      <h1>Team Member Dashboard</h1>

       <button
        onClick={goToUserManagement}
      >
        Show and Manage Team Members
      </button>
      
    </div>
  );
};

export default TeamMemberDashboard;
