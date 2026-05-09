import { db } from "../../lib/firebaseAdmin";

export default async function handler(req, res) {
  try {
    const snap = await db.ref("/").once("value");
    return res.status(200).json({ ok: true, data: snap.val() });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
