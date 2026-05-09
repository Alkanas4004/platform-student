import { db } from "@/lib/firebaseAdmin";

export default async function handler(req, res) {
  const { yearId, subjectId } = req.query;

  if (!yearId || !subjectId) {
    return res.status(400).json({ error: "yearId و subjectId مطلوبان" });
  }

  try {
    // تأكد إن السنة موجودة
    const yearRef = db.collection("years").doc(String(yearId));
    const yearSnap = await yearRef.get();
    if (!yearSnap.exists) {
      return res.status(404).json({ error: "السنة غير موجودة" });
    }

    // تأكد إن المادة موجودة
    const subjectRef = yearRef.collection("subjects").doc(String(subjectId));
    const subjectSnap = await subjectRef.get();
    if (!subjectSnap.exists) {
      return res.status(404).json({ error: "المادة غير موجودة" });
    }

    // جلب المدرسين
    const teachersSnap = await subjectRef
      .collection("teachers")
      .get();

    const teachers = await Promise.all(
      teachersSnap.docs.map(async doc => {
        const data = doc.data();

        // عدد الفصول
        const chaptersSnap = await doc.ref
          .collection("chapters")
          .get();

        return {
          id: doc.id,
          name: data.name,
          image_url: data.image_url || null,
          chapters_count: chaptersSnap.size
        };
      })
    );

    return res.status(200).json(teachers);

  } catch (err) {
    console.error("Error in /api/teachers:", err);
    return res.status(500).json({ error: "حدث خطأ في الخادم" });
  }
}
