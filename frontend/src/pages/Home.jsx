import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Edit, Trash2, Save, X } from "lucide-react";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [editingEmail, setEditingEmail] = useState(null);
  const [editedUser, setEditedUser] = useState({ name: "", email: "" });

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/getUser`
      );
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (email) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/userDelete/${email}`
      );
      toast.success("User deleted!");
      fetchUsers();
    } catch (error) {
      toast.error("Delete failed.");
    }
  };

  const startEditing = (user) => {
    setEditingEmail(user.email);
    setEditedUser({ name: user.name, email: user.email });
  };

  const cancelEditing = () => {
    setEditingEmail(null);
    setEditedUser({ name: "", email: "" });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/users/userUpdate/${editingEmail}`,
        editedUser
      );
      toast.success("User updated!");
      setEditingEmail(null);
      fetchUsers();
    } catch (error) {
      toast.error("Update failed.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl border">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        All Users
      </h1>

      {users.length === 0 ? (
        <div className="text-center text-gray-500 text-lg py-16">
          No data found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-xl overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-700 text-left">
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.email}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-6">
                    {editingEmail === user.email ? (
                      <input
                        type="text"
                        value={editedUser.name}
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            name: e.target.value,
                          })
                        }
                        className="w-full border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="font-medium text-gray-800">
                        {user.name}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-gray-600">{user.email}</td>
                  <td className="py-3 px-6 text-center space-x-2">
                    {editingEmail === user.email ? (
                      <>
                        <button
                          onClick={handleUpdate}
                          className="inline-flex items-center gap-1 bg-green-500 text-white px-4 py-1.5 rounded-full hover:bg-green-600 transition"
                        >
                          <Save size={16} />
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="inline-flex items-center gap-1 bg-gray-300 text-black px-4 py-1.5 rounded-full hover:bg-gray-400 transition"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(user)}
                          className="inline-flex items-center gap-1 bg-yellow-500 text-white px-4 py-1.5 rounded-full hover:bg-yellow-600 transition"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.email)}
                          className="inline-flex items-center gap-1 bg-red-500 text-white px-4 py-1.5 rounded-full hover:bg-red-600 transition"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Home;
