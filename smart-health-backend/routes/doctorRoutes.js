const express = require("express");
const {
    getDoctorInfoController,
    updateProfileController,
    getDoctorByIdController,
    getAllDoctorsController,
    applyDoctorController,
    recommendDoctorsController,
} = require("../controllers/doctorController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// POST APPLY DOCTOR
router.post("/apply-doctor", authMiddleware, applyDoctorController);

// POST GET DOCTOR INFO
router.post("/get-doctor-info", authMiddleware, getDoctorInfoController);

// POST UPDATE PROFILE
router.post("/updateProfile", authMiddleware, updateProfileController);

// POST GET SINGLE DOC INFO
router.post("/getDoctorById", authMiddleware, getDoctorByIdController);

// GET ALL DOCTORS
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

// POST RECOMMEND DOCTORS
router.post("/recommend", authMiddleware, recommendDoctorsController);

module.exports = router;