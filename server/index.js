import express from "express";
import cors from "cors";
import "./firebase.js"; // initializes Firebase Admin

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AccessPath Backend Running 🚀");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
