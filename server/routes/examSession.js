const express = require("express");
const router = express.Router();

const ExamSession = require("../models/examSession");
const ExamSessionController = require("../controllers/examSession");
const User = require("../models/user");
const Exam = require("../models/exam");
const Student = require("../models/student");

router.get("/:email", async (req, res) => {
  console.log(req.params.email);
  const sessions = await ExamSessionController.getAllSessionsOfUser(
    req.params.email
  );
  return res.json({ sessions: sessions }); // tra dang json
});

router.post("/", async (req, res) => {
  // exams la mang chua cac entry o dang {studentId, score}
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId is required." });
    }

    const user = await User.findOne({ email: userId }); // tim user cho examSession
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const examSession = new ExamSession({
      exams: [],
      user: user,
    });

    const savedExamSession = await examSession.save();

    res.status(200).json({ _id: savedExamSession._id });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  // exams la mang chua cac entry o dang {studentId, score}
  try {
    const id = req.params.id;
    const { exams, userId } = req.body;
    if (!id || !exams || !userId) {
      return res
        .status(400)
        .json({ error: "Id, exams, and userId are required." });
    }
    let savedExams = [];
    for (var i = 0; i < exams.length; i++) {
      var entry = exams[i]; // bai thi

      const { studentId, score } = entry;
      console.log(studentId);
      const student = await Student.findById(studentId); // tim student
      if (!student) {
        console.log("Student not found");
        return res.status(401).json({ error: "Student not found" });
      }
      const newExam = new Exam({ student, score });
      await newExam.save(); // luu nhung exam moi
      savedExams.push(newExam); //them _id de refer trong examSession
    }

    const user = await User.findOne({ email: userId }); // tim user cho examSession
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await ExamSession.findOneAndUpdate({ _id: id }, { exams: savedExams });
    res.status(200).json({ _id: id });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
