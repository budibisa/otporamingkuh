// Vercel serverless function: records and lists RSVPs for the invitation.
// Storage: Upstash Redis via its REST API. Add it in Vercel → Project → Storage
// (Upstash for Redis); Vercel then sets KV_REST_API_URL / KV_REST_API_TOKEN
// (or UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN) automatically.

const GUESTS = [
  ["Robertus Indra", "Penanggung Jawab"],
  ["Anggo Marantika", "Kepala Sekolah"],
  ["Lukas Evan Kurniawan", "Wakil Kepala Sekolah 1"],
  ["Widhy Kusumaramdhani", "Wakil Kepala Sekolah 2"],
  ["Nurul Qomar S.Pd", "Coach"],
  ["Alfian Fauzi", "Acara"],
  ["Ninik Winarsih", "Sponsorship"],
  ["Laura Silviana", "Sponsorship"],
  ["Marcellino Hanarko", "Desain dan Media"],
  ["Ageng Satrio Prabowo", "Desain dan Media"],
  ["Dhaniswara Pradana", "Dokumentasi"],
  ["Darmawan Trihatmojo", "Dokumentasi"],
  ["Alfian Hidayat", "Ranger Longrun"],
  ["Faried Annas Affandi", "Ranger Longrun"],
  ["Grace Anita", "Ranger Longrun"],
  ["Taufik Suryanto", "Ranger Longrun"],
  ["Budi Nurahman", "Ranger Speed Session"],
  ["Ari Iskandar", "Ranger Speed Session"],
  ["Nesia Puspita Lisnaningrum", "Ranger Speed Session"],
  ["Angger Satya", "Ranger Strength Training"],
  ["Akhmad Syaifuddin", "Ranger Strength Training"],
];

const KEY = "otp-ora-mingkuh-2026:rsvp";
const norm = s => String(s || "").trim().replace(/\s+/g, " ").toLowerCase();
const byName = new Map(GUESTS.map(([n, r]) => [norm(n), { name: n, role: r }]));

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(cmd) {
  const r = await fetch(URL_, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
  });
  if (!r.ok) throw new Error(`redis ${r.status}`);
  return (await r.json()).result;
}

async function readAll() {
  const flat = (await redis(["HGETALL", KEY])) || [];
  const out = {};
  for (let i = 0; i < flat.length; i += 2) {
    try { out[flat[i]] = JSON.parse(flat[i + 1]); } catch { /* skip bad row */ }
  }
  return out;
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!URL_ || !TOKEN) {
    return res.status(503).json({ ok: false, error: "storage_not_configured", guests: GUESTS.map(([name, role]) => ({ name, role })) });
  }
  try {
    if (req.method === "POST") {
      let body = req.body;
      if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
      const g = byName.get(norm(body && body.name));
      const status = body && body.status;
      if (!g) return res.status(400).json({ ok: false, error: "unknown_guest" });
      if (status !== "yes" && status !== "no") return res.status(400).json({ ok: false, error: "bad_status" });
      await redis(["HSET", KEY, g.name, JSON.stringify({ status, at: Date.now() })]);
    } else if (req.method !== "GET") {
      res.setHeader("Allow", "GET, POST");
      return res.status(405).json({ ok: false, error: "method_not_allowed" });
    }
    const rows = await readAll();
    const guests = GUESTS.map(([name, role]) => ({ name, role, status: rows[name] ? rows[name].status : null }));
    return res.status(200).json({ ok: true, guests });
  } catch (e) {
    return res.status(502).json({ ok: false, error: "storage_error" });
  }
};
