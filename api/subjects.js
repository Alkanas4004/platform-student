import { db } from "../lib/firebase.js";

export default async function handler(req, res) {
  const { yearId } = req.query;
  if (!yearId) return res.status(400).json({ error: "yearId مطلوب" });

  try {
    const snapshot = await db
      .ref(`years/${yearId}/subjects`)
      .once("value");

    const data = snapshot.val() || {};

    const subjects = Object.entries(data).map(([id, s]) => ({
      id,
      name: s.name,
      teachers_count: s.teachers ? Object.keys(s.teachers).length : 0
    }));

    res.status(200).json(subjects);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Firebase Error" });
  }
}
