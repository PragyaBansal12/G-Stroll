import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate, Link } from "react-router-dom"

const Signup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError("")
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      navigate("/dashboard")
    } catch (err) {
      setError("That email is already registered.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 font-sans">
      <div className="w-full max-w-md p-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Get Started.</h1>
          <p className="text-gray-400 font-medium mt-2 italic">Join Parthy for easy navigation.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-1">
            <input
              required
              type="email"
              placeholder="Email address"
              className="w-full bg-white border-b-2 border-gray-100 px-2 py-4 outline-none focus:border-blue-600 transition-all text-lg font-medium text-gray-900"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <input
              required
              type="password"
              placeholder="Choose a password"
              className="w-full bg-white border-b-2 border-gray-100 px-2 py-4 outline-none focus:border-blue-600 transition-all text-lg font-medium text-gray-900"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-xs font-bold pt-2">{error}</p>}

          <div className="pt-8">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-2xl shadow-blue-200 transition-all transform active:scale-95">
              CREATE MY ACCOUNT
            </button>
          </div>
        </form>

        <p className="mt-12 text-center text-gray-400 text-sm font-medium">
          Already have an account? <Link to="/login" className="text-gray-900 font-black ml-1 underline decoration-2 underline-offset-4 decoration-blue-100 hover:decoration-blue-600">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup