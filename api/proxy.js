export default async function handler(req, res) {
  if (!["GET", "POST"].includes(req.method)) {
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  const { type, yearId, subjectId, teacherId, chapterId, lectureId } = req.query;
  const BASE = "https://platform-sigma-seven.vercel.app";

  let url = "";

  if (type === "years") {
    url = `${BASE}/api/years`;
  } else if (type === "subjects") {
    url = `${BASE}/api/subjects?yearId=${yearId}`;
  } else if (type === "teachers") {
    url = `${BASE}/api/teachers?yearId=${yearId}&subjectId=${subjectId}`;
  } else if (type === "chapters") {
    url = `${BASE}/api/chapters?yearId=${yearId}&subjectId=${subjectId}&teacherId=${teacherId}`;
  } else if (type === "lectures") {
    url = `${BASE}/api/lectures?yearId=${yearId}&subjectId=${subjectId}&teacherId=${teacherId}&chapterId=${chapterId}`;
  } else if (type === "videos") {
    url = `${BASE}/api/videos?yearId=${yearId}&subjectId=${subjectId}&teacherId=${teacherId}&chapterId=${chapterId}&lectureId=${lectureId}`;
  } else {
    return res.status(400).json({ error: "INVALID_TYPE" });
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "PROXY_ERROR" });
  }
}
