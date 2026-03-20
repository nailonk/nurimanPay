import { useNavigate, Outlet } from "react-router-dom"

export default function AdminPage() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    navigate("/login")
  }

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* HEADER */}
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h1 className="text-xl font-bold">Admin Panel</h1>

        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  )
}