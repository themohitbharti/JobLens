import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { scanResume, upload, compareResumes, getResumeScanById } from "../controllers/resumeScan.controller";

const router = Router();

// Resume scan endpoint
router.post("/scan", verifyToken, upload.single("resume"), scanResume);

// Resume comparison endpoint
router.post(
    "/compare", 
    verifyToken, 
    upload.fields([
      { name: "resume1", maxCount: 1 },
      { name: "resume2", maxCount: 1 }
    ]), 
    compareResumes
);

// Get resume scan by ID
router.get("/scan/:scanId", verifyToken, getResumeScanById);

export default router;
