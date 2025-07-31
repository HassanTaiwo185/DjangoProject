import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api";

// handle edit user form
const EditUserForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state;

    const [formData, updateFormData] = useState({
        username: user.username || "",
        email: user.email || "",
        role: user.role || "",
    });
    const [error, setError] = useState("");

    // handle change in user details
    const handleChange = (e) => {
        updateFormData(prev => ({
            ...prev, [e.target.name]: e.target.value,
        }));
    }

    // update Edit successfully
    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.patch(`/users/edit/${user.id}/`, formData);

            if (response.status === 200) {
                navigate("/teamleader/dashboard");
            }
        } catch (err) {
            const data = err.response?.data;
            const status = err.response?.status;

            if (status === 403) {
                setError("You do not have permission to edit this user.");
                navigate('/')
                return;
            }

            const message =
                data?.non_field_errors?.[0] ||
                data?.detail ||
                "Something went wrong during update.";
            setError(message);
        }
    }

    return (
        <div>
            <h2>Edit User</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleEdit}>
                <div>
                    <label>Username:</label>
                    <input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Email:</label>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Role:</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="Team leader">Team leader</option>
                        <option value="Team member">Team member</option>
                    </select>
                </div>

                <button type="submit">Update User</button>
                <button type="button" onClick={() => navigate(-1)}>Cancel</button>
            </form>
        </div>
    );
}

export default EditUserForm;
