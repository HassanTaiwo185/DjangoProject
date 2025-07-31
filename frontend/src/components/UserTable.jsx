import { useNavigate } from "react-router-dom";
import api from "../api";

const UserTable = ({ users, dispatch, currentUser }) => {
    const navigate = useNavigate();

    // Handling deleting team member 
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            const response = await api.delete(`users/delete/${id}/`);
            if (response.status === 204 || response.status === 200) {
                dispatch({ type: "deleteuser", payload: id });
            }
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

     // Handling editing team member 
    const handleEdit = (user) => {
        const confirmEdit = window.confirm("Are you sure you want to edit this user?");
        if (!confirmEdit) return;
        navigate(`/users/edit/${user.id}`, { state: user });
    };

    return (
        <table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Avatar</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.avatar}</td>
                        <td>{user.role}</td>
                        <td>
                            {currentUser?.role === "Team leader" && (
                                <>
                                    <button onClick={() => handleEdit(user)}>Edit</button>
                                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
export default UserTable