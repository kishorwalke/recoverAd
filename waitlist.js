import axios from "axios";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://gnalaujngeekaxfveyvx.supabase.co",
  "sb_publishable_ZtXYri42Pc7Cf2QqNm5N2w_nPCYBV2X"
);

export async function saveWaitlistEntry(req, res) {
  try {
    const { name, email, website, traffic, message } = req.body;

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      "0.0.0.0";

    const geoRes = await axios.get(`https://ipapi.co/${ip}/json/`);
    const loc = geoRes.data || {};

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
          city: loc.city,
          region: loc.region,
          country: loc.country_name,
          latitude: loc.latitude,
          longitude: loc.longitude,
        },
      ]);

    if (error) throw error;

    res.json({ success: true, message: "Saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}
