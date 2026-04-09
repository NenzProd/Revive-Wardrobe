import contactSubmissionModel from "../models/contactSubmissionModel.js";
import stitchingRequestModel from "../models/stitchingRequestModel.js";

const createContactSubmission = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.json({
        success: false,
        message: "Name, email, subject and message are required",
      });
    }

    await contactSubmissionModel.create({
      name,
      email,
      subject,
      message,
    });

    res.json({ success: true, message: "Contact request received" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const listContactSubmissions = async (_req, res) => {
  try {
    const submissions = await contactSubmissionModel
      .find({})
      .sort({ date: -1 })
      .lean();
    res.json({ success: true, submissions });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const createStitchingRequest = async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      addressType,
      fullAddress,
      landmark,
      city,
      pinCode,
      serviceType,
      itemCount,
      message,
    } = req.body;

    if (
      !name ||
      !phoneNumber ||
      !addressType ||
      !fullAddress ||
      !city ||
      !pinCode ||
      !serviceType ||
      !itemCount
    ) {
      return res.json({
        success: false,
        message: "Please fill all required stitching fields",
      });
    }

    await stitchingRequestModel.create({
      name,
      phoneNumber,
      addressType,
      fullAddress,
      landmark: landmark || "",
      city,
      pinCode,
      serviceType,
      itemCount: Number(itemCount),
      message: message || "",
    });

    res.json({ success: true, message: "Stitching request received" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const listStitchingRequests = async (_req, res) => {
  try {
    const requests = await stitchingRequestModel
      .find({})
      .sort({ date: -1 })
      .lean();
    res.json({ success: true, requests });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  createContactSubmission,
  listContactSubmissions,
  createStitchingRequest,
  listStitchingRequests,
};
