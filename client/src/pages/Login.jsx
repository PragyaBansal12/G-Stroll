import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate, Link } from "react-router-dom"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    await signInWithEmailAndPassword(auth, email, password)
    navigate("/dashboard")
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>


      <input
        required
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        required
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button>Login</button>

      <p>
        Don’t have an account?{" "}
        <Link to="/signup">Signup</Link>
      </p>
    </form>
  )
}

export default Login
