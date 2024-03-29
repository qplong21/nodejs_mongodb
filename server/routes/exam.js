const express = require("express");
const router = express.Router();

const Exam = require("../models/exam");
const express = require("express");
const Exam = require("../models/exam");

router.get("/", (req, res) => {});

router.post("/", async (req, res) => {
  try {
    const { studentId, grade } = req.body;
    const student = await Exam.findOne({ _id: studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    const newExam = new Exam({ student, grade });
    await newExam.save();
    res.status(201).json(newExam);
  } catch (error) {
    res.status(500).json({ error: "Failed to create new exam entry" });
  }
});
