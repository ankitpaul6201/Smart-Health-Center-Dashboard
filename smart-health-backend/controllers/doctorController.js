const doctorModel = require("../models/doctor");
const appointmentModel = require("../models/appointment");
const userModel = require("../models/user");

const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "doctor data fetch success",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Fetching Doctor Details",
    });
  }
};

const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Doctor Profile Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Doctor Profile Update Issue",
      error,
    });
  }
};

const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "Single Doc Info Fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Single doctor info",
    });
  }
};

const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctors Lists Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Fetching Doctor",
    });
  }
};

const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: 'pending' });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    // In a real app we might send notification to admin here
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Applying For Doctor",
    });
  }
};

// Recommendation logic
const recommendDoctorsController = async (req, res) => {
  try {
    const { symptoms } = req.body;
    // Simple mapping: 
    // Heart pain -> Cardiologist
    // Skin rash -> Dermatologist
    // Fever -> General Physician
    // Headache -> Neurologist/General Physician

    let specialization = "";
    const lowerSymptoms = symptoms.toLowerCase();

    if (lowerSymptoms.includes("heart") || lowerSymptoms.includes("chest pain")) {
      specialization = "Cardiologist";
    } else if (lowerSymptoms.includes("skin") || lowerSymptoms.includes("rash") || lowerSymptoms.includes("acne")) {
      specialization = "Dermatologist";
    } else if (lowerSymptoms.includes("headache") || lowerSymptoms.includes("dizzy")) {
      specialization = "Neurologist";
    } else if (lowerSymptoms.includes("fever") || lowerSymptoms.includes("cold") || lowerSymptoms.includes("cough")) {
      specialization = "General Physician";
    } else {
      specialization = "General Physician"; // Default
    }

    const doctors = await doctorModel.find({
      specialization: { $regex: specialization, $options: "i" },
      status: "approved"
    });

    res.status(200).send({
      success: true,
      data: doctors,
      message: `Recommended doctors for ${specialization}`
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Fetching Doctor",
    });
  }
}


module.exports = {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  getAllDoctorsController,
  applyDoctorController,
  recommendDoctorsController
};