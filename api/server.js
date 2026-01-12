// server.js
import express from "express";
import cors from "cors";
import { saveWaitlistEntry } from "./waitlist.js";

const app = express();
app.use(cors());
app.use(express.json());

// API ROUTE
app.post("/api/waitlist", saveWaitlistEntry);

// RUN SERVER
app.listen(4000, () => {
  console.log("RecoverAd Waitlist API running on http://localhost:4000");
});
