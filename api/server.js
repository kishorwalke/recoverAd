// server.js
import express from "express";
import cors from "cors";
import { saveWaitlistEntry } from "./waitlist.js";

const app = express();

app.use(
  cors({
    origin: ["https://www.recoverad.com", "https://recoverad.com"],
    methods: ["POST"],
  })
);

app.use(express.json());

app.post("/api/waitlist", saveWaitlistEntry);

app.get("/", (req, res) => {
  res.send("RecoverAd API is running");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`RecoverAd API running on port ${PORT}`);
});
