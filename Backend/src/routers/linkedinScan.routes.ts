import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { scanLinkedinProfile, upload, compareLinkedinProfiles } from "../controllers/linkedinScan.controller";

const router = Router();

// LinkedIn scan endpoint
router.post("/scan", verifyToken, upload.single("linkedin"), scanLinkedinProfile);

router.post(
    "/compare", 
    verifyToken, 
    upload.fields([
      { name: "profile1", maxCount: 1 },
      { name: "profile2", maxCount: 1 }
    ]), 
    compareLinkedinProfiles
  );

export default router;