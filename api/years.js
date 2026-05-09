import { db } from "@/lib/firebaseAdmin";

export default async function handler(req, res) {
  try {
    const snapshot = await db.collection("years").get();

    const years = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        image_url: data.image_url,
        subjects_count: data.subjects?.length || 0
      };
    });

    return res.status(200).json(years);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "FIREBASE_ERROR" });
  }
}
