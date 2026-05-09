export default async function handler(req, res) {
  if (!["GET", "POST"].includes(req.method)) {
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  const {
    type,
    yearId,
    subjectId,
    teacherId,
    chapterId,
    lectureId
  } = req.query;

  const BASE = "https://platform-student.vercel.app";
  let url = "";

  switch (type) {
    case "years":
      url = `${BASE}/api/years`;
      break;

    case "subjects":
      if (!yearId) return res.status(400).json({ error: "yearId_REQUIRED" });
      url = `${BASE}/api/subjects?yearId=${yearId}`;
      break;

    case "teachers":
      if (!yearId || !subjectId)
        return res.status(400).json({ error: "yearId_subjectId_REQUIRED" });
      url = `${BASE}/api/teachers?yearId=${yearId}&subjectId=${subjectId}`;
      break;

    case "chapters":
      if (!yearId || !subjectId || !teacherId)
        return res.status(400).json({ error: "MISSING_PARAMS" });
      url = `${BASE}/api/chapters?yearId=${yearId}&subjectId=${subjectId}&teacherId=${teacherId}`;
      break;

    case "lectures":
      if (!yearId || !subjectId || !teacherId || !chapterId)
        return res.status(400).json({ error: "MISSING_PARAMS" });
      url = `${BASE}/api/lectures?yearId=${yearId}&subjectId=${subjectId}&teacherId=${teacherId}&chapterId=${chapterId}`;
      break;

    case "videos":
      if (!yearId || !subjectId || !teacherId || !chapterId || !lectureId)
        return res.status(400).json({ error: "MISSING_PARAMS" });
      url = `${BASE}/api/videos?yearId=${yearId}&subjectId=${subjectId}&teacherId=${teacherId}&chapterId=${chapterId}&lectureId=${lectureId}`;
      break;

    default:
      return res.status(400).json({ error: "INVALID_TYPE" });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({
        error: "UPSTREAM_ERROR",
        status: response.status
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      error: "PROXY_ERROR",
      message: error.message
    });
  }
}
