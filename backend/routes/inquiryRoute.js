import express from "express";
import { authorizeAdmin } from "../middleware/adminAuth.js";
import {
  createContactSubmission,
  createStitchingRequest,
  listContactSubmissions,
  listStitchingRequests,
} from "../controllers/inquiryController.js";

const inquiryRouter = express.Router();

inquiryRouter.post("/contact", createContactSubmission);
inquiryRouter.post("/stitching", createStitchingRequest);

inquiryRouter.post(
  "/contact/list",
  authorizeAdmin(["super_admin", "operations_manager", "content_manager"]),
  listContactSubmissions
);
inquiryRouter.post(
  "/stitching/list",
  authorizeAdmin(["super_admin", "operations_manager"]),
  listStitchingRequests
);

export default inquiryRouter;
