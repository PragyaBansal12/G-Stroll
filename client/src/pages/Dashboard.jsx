import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-2">
          Welcome 👋
        </h1>

        <p className="text-gray-600 mb-6">
          {user.email}
        </p>

        <button
          onClick={() => navigate("/map")}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Plan Accessible Route
        </button>
      </div>
    </div>
  )
}

export default Dashboard
