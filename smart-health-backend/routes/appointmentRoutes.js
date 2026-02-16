const express = require("express");
const {
    bookAppointmentController,
    userAppointmentsController,
    doctorAppointmentsController,
    updateStatusController,
} = require("../controllers/appointmentController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// POST BOOK APPOINTMENT
router.post("/book-appointment", authMiddleware, bookAppointmentController);

// GET USER APPOINTMENTS
router.get("/user-appointments", authMiddleware, userAppointmentsController);

// GET DOCTOR APPOINTMENTS
router.get("/doctor-appointments", authMiddleware, doctorAppointmentsController);

// POST UPDATE STATUS
router.post("/update-status", authMiddleware, updateStatusController);

module.exports = router;