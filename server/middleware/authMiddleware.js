import admin from "../firebase.js"

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" })
  }

  try {
    const token = authHeader.split(" ")[1]
    const decoded = await admin.auth().verifyIdToken(token)
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ message: "Invalid token" })
  }
}

export default authMiddleware
