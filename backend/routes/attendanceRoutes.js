
const express = require("express");
const router = express.Router();

const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

// GET attendance records for a selected date
router.get("/", async (req, res) => {
  try {
    const selectedDate = req.query.date
      ? new Date(req.query.date)
      : new Date();

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date"
      });
    }

    const start = new Date(selectedDate);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    const records = await Attendance.find({
      date: { $gte: start, $lt: end }
    }).populate("student", "studentId name department");

    res.json({
      success: true,
      count: records.length,
      records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// SAVE or UPDATE a student's attendance
router.post("/", async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    if (!studentId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: "Student ID, date and status are required"
      });
    }

    if (!["Present", "Absent"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Present or Absent"
      });
    }

    const selectedDate = new Date(date);

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date"
      });
    }

    const start = new Date(selectedDate);
    start.setUTCHours(0, 0, 0, 0);

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const record = await Attendance.findOneAndUpdate(
      { student: student._id, date: start },
      { status },
      { new: true, upsert: true, runValidators: true }
    ).populate("student", "studentId name department");

    res.json({
      success: true,
      message: "Attendance saved successfully",
      record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
