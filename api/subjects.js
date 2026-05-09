import { db } from "@/lib/firebaseAdmin";

export default async function handler(req, res) {
  const { yearId } = req.query;
  if (!yearId) {
    return res.status(400).json({ error: "yearId مطلوب" });
  }

  try {
    // جلب السنة
    const yearRef = db.collection("years").doc(String(yearId));
    const yearSnap = await yearRef.get();

    if (!yearSnap.exists) {
      return res.status(404).json({ error: "السنة غير موجودة" });
    }

    // جلب المواد
    const subjectsSnap = await yearRef
      .collection("subjects")
      .get();

    const subjects = subjectsSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        teachers_count: data.teachers?.length || 0
      };
    });

    return res.status(200).json(subjects);

  } catch (err) {
    console.error("Error in /api/subjects:", err);
    return res.status(500).json({ error: "حدث خطأ في الخادم" });
  }
}
