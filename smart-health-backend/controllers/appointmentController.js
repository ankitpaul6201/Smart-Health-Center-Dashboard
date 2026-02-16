const appointmentModel = require("../models/appointment");
const doctorModel = require("../models/doctor");
const userModel = require("../models/user");

const bookAppointmentController = async (req, res) => {
    try {
        req.body.status = "pending";
        const newAppointment = new appointmentModel(req.body);
        await newAppointment.save();

        // Notification logic could go here

        res.status(200).send({
            success: true,
            message: "Appointment Booked Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error While Booking Appointment",
        });
    }
};

const getController = async (req, res) => {
    // Generic get controller, maybe not needed if we have specific ones
};

const userAppointmentsController = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({
            userId: req.body.userId,
        }).populate('doctorId'); // Assuming doctorId ref is 'Doctor' (which is the model name I used) - wait, it refs 'Doctor' schema which I exported as 'Doctor'. 
        // However, in doctor.js I did mongoose.model("Doctor", doctorSchema). 
        // In appointment.js it is ref: 'Doctor'. So populate should work.

        res.status(200).send({
            success: true,
            message: "Users Appointments Fetch Sucessfully",
            data: appointments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error In User Appointments",
        });
    }
};

const doctorAppointmentsController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId });
        const appointments = await appointmentModel.find({
            doctorId: doctor._id,
        }).populate('userId');

        res.status(200).send({
            success: true,
            message: "Doctor Appointments Fetch Sucessfully",
            data: appointments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error In Doctor Appointments",
        });
    }
};

const updateStatusController = async (req, res) => {
    try {
        const { appointmentId, status } = req.body;
        const appointment = await appointmentModel.findByIdAndUpdate(
            appointmentId,
            { status }
        );
        res.status(200).send({
            success: true,
            message: "Appointment Status Updated",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error In Update Status",
        });
    }
};

module.exports = {
    bookAppointmentController,
    userAppointmentsController,
    doctorAppointmentsController,
    updateStatusController
};
