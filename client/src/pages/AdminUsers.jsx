import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const api = "https://furniselect-ai.onrender.com/api/admin";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const token = localStorage.getItem("token");

  const loadUsers = async () => {
    try { const { data } = await axios.get(`${api}/users`, { headers: { Authorization: `Bearer ${token}` } }); setUsers(data); }
    catch (error) { toast.error(error.response?.data?.message || "Could not load customers"); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadUsers(); }, []);

  const changeRole = async (id, role) => {
    try { const { data } = await axios.patch(`${api}/users/${id}/role`, { role }, { headers: { Authorization: `Bearer ${token}` } }); setUsers((current) => current.map((user) => user._id === id ? data : user)); toast.success("Role updated"); }
    catch (error) { toast.error(error.response?.data?.message || "Could not update role"); }
  };

  const filtered = users.filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase()));
  return <main className="admin-theme min-h-screen bg-[#f7f3ee] px-5 py-10 lg:px-8"><div className="mx-auto max-w-[1320px]"><div className="flex flex-col justify-between gap-6 border-b border-[#e5d9cf] pb-8 md:flex-row md:items-end"><div><p className="eyebrow">People & access</p><h1 className="mt-3 text-5xl">Customers</h1><p className="mt-3 text-[#756b63]">Manage accounts, roles and access across FurniSelect.</p></div><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customers" className="h-12 w-full rounded-xl border px-4 md:w-72" /></div><div className="mt-8 grid gap-4 sm:grid-cols-3"><div className="soft-card rounded-2xl p-5"><p className="text-sm text-[#897e75]">Total accounts</p><p className="mt-2 text-3xl font-bold">{users.length}</p></div><div className="soft-card rounded-2xl p-5"><p className="text-sm text-[#897e75]">Customers</p><p className="mt-2 text-3xl font-bold">{users.filter((user) => user.role === "customer").length}</p></div><div className="soft-card rounded-2xl p-5"><p className="text-sm text-[#897e75]">Admins & team</p><p className="mt-2 text-3xl font-bold">{users.filter((user) => user.role !== "customer").length}</p></div></div><div className="mt-8 overflow-x-auto rounded-2xl border border-[#e5d9cf] bg-white"><table className="w-full min-w-[680px] text-left"><thead className="border-b border-[#eee6de] bg-[#fbfaf8] text-xs uppercase tracking-wider text-[#897e75]"><tr><th className="px-6 py-4">User</th><th className="px-6 py-4">Joined</th><th className="px-6 py-4">Role</th><th className="px-6 py-4">Access</th></tr></thead><tbody>{loading ? <tr><td colSpan="4" className="px-6 py-12 text-center text-[#897e75]">Loading customers...</td></tr> : filtered.map((user) => <tr key={user._id} className="border-b border-[#f0e9e3] last:border-0"><td className="px-6 py-5"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e6d0bd] font-bold text-[#6b422b]">{user.name?.[0]?.toUpperCase()}</span><div><p className="font-semibold">{user.name}</p><p className="text-sm text-[#897e75]">{user.email}</p></div></div></td><td className="px-6 py-5 text-sm text-[#756b63]">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</td><td className="px-6 py-5"><select value={user.role} onChange={(e) => changeRole(user._id, e.target.value)} className="rounded-lg border px-3 py-2 text-sm"><option value="customer">Customer</option><option value="salesman">Salesman</option><option value="admin">Admin</option></select></td><td className="px-6 py-5"><span className="rounded-full bg-[#f1e6dc] px-3 py-1.5 text-xs font-semibold text-[#8a5a3c]">{user.role === "customer" ? "Shopping access" : "Team access"}</span></td></tr>)}</tbody></table></div></div></main>;
}
export default AdminUsers;
