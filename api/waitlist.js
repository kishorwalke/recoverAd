// waitlist.js
import { createClient } from "@supabase/supabase-js";

// ❗ Using ANON KEY is NOT allowed for writes. Use SERVICE ROLE KEY.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function saveWaitlistEntry(req, res) {
  try {
    const { name, email, website, traffic, message } = req.body;

    const ip =
      req.headers["cf-connecting-ip"] ||               
      req.headers["x-forwarded-for"]?.split(",")[0] || 
      req.socket?.remoteAddress ||
      req.ip ||
      "0.0.0.0";

    const country = req.headers["cf-ipcountry"] || "Unknown";

    // Save into Supabase
    const { data, error } = await supabase
      .from("waitlist_entries")
      .insert([
        {
          name,
          email,
          website,
          traffic,
          message,
          ip_address: ip,
          country,
        },
      ]);

    if (error) throw error;

    res.json({ success: true, message: "Saved successfully" });
  } catch (err) {
    console.error("WAITLIST SAVE ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
