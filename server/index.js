import express from "express"
import cors from "cors"
import "./firebase.js"
import authMiddleware from "./middleware/authMiddleware.js"

const app = express()
app.use(cors())
app.use(express.json())

app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Authenticated user",
    uid: req.user.uid,
    email: req.user.email,
  })
})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})
