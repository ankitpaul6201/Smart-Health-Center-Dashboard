const doctorModel = require("../models/doctor");
const userModel = require("../models/user");

const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.status(200).send({
            success: true,
            message: "users data list",
            data: users,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "erorr while fetching users",
            error,
        });
    }
};

const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        res.status(200).send({
            success: true,
            message: "Doctors Data list",
            data: doctors,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error while getting doctors data",
            error,
        });
    }
};

// Doctor Account Status
const changeAccountStatusController = async (req, res) => {
    try {
        const { doctorId, status } = req.body;
        const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
        const user = await userModel.findOne({ _id: doctor.userId });
        const notification = user.notification;
        // notification.push({
        //   type: "doctor-account-request-updated",
        //   message: `Your Doctor Account Request Has ${status} `,
        //   onClickPath: "/notification",
        // });
        // user.notification = notification;
        // user.isDoctor = status === "approved" ? true : false;
        // await user.save();

        // Simplification for now: Just update doctor status. 
        // Ideally we update User role to 'doctor' if approved.
        if (status === "approved") {
            await userModel.findByIdAndUpdate(doctor.userId, { role: "doctor" });
        }

        res.status(201).send({
            success: true,
            message: "Account Status Updated",
            data: doctor,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Eror in Account Status",
            error,
        });
    }
};

module.exports = {
    getAllDoctorsController,
    getAllUsersController,
    changeAccountStatusController,
};
