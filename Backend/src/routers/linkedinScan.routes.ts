import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { scanLinkedinProfile, upload } from "../controllers/linkedinScan.controller";

const router = Router();

// LinkedIn scan endpoint
router.post("/scan", verifyToken, upload.single("linkedin"), scanLinkedinProfile);

export default router;