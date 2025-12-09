import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addUser,
  updateUser,
  deleteUser,
  fetchAllUsers,
} from "../../redux/slices/adminSlice"; // ✅ شامل fetchAllUsers

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // بيانات المستخدم الحالي
  const { user } = useSelector((state) => state.auth);

  // بيانات المستخدمين من adminSlice
  const { users = [], loading, error } = useSelector((state) => state.admin);

  // منع غير الادمن من الدخول
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // جلب كل المستخدمين عند تحميل الكمبوننت
  useEffect(() => {
    if (user && user.role === "admin") {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, user]);

  // فورم إضافة مستخدم جديد
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addUser(formData));
    setFormData({ name: "", email: "", password: "", role: "customer" });
  };

  const handleRoleChange = (userId, newRole) => {
    dispatch(updateUser({ id: userId, role: newRole }));
  };

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Add New User Form */}
      <div className="mb-6 rounded-lg p-6 shadow-md bg-white">
        <h3 className="text-lg font-bold mb-4">Add New User</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Add User
          </button>
        </form>
      </div>

      {/* User List Table */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((userItem) => (
                <tr
                  key={userItem._id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {userItem.name}
                  </td>
                  <td className="py-3 px-4">{userItem.email}</td>
                  <td className="py-3 px-4">
                    <select
                      value={userItem.role}
                      onChange={(e) =>
                        handleRoleChange(userItem._id, e.target.value)
                      }
                      className="border border-gray-300 rounded p-1"
                    >
                      <option value="admin">Admin</option>
                      <option value="customer">Customer</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(userItem._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
