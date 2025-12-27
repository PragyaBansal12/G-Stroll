import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate, Link } from "react-router-dom"

const Signup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    await createUserWithEmailAndPassword(auth, email, password)
    navigate("/dashboard")
  }

  return (
    <form onSubmit={handleSignup}>
      <h2>Signup</h2>

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

      <button>Create Account</button>

      <p>
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </p>
    </form>
  )
}

export default Signup
