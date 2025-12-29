import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate, Link } from "react-router-dom"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/dashboard")
    } catch (err) {
      setError("Invalid email or password.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-10">
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-blue-50 rounded-2xl mb-4">
            <span className="text-3xl">🧭</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Parthy</h1>
          <p className="text-gray-500 font-medium mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input
              required
              type="email"
              placeholder="e.g. alex@mail.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 placeholder:text-gray-300"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input
              required
              type="password"
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 placeholder:text-gray-300"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg">{error}</p>}

          <button className="w-full bg-gray-900 hover:bg-black text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98] mt-2">
            CONTINUE
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-50 text-center">
          <p className="text-gray-500 text-sm font-medium">
            New to the platform? <Link to="/signup" className="text-blue-600 font-bold hover:text-blue-700 ml-1">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login