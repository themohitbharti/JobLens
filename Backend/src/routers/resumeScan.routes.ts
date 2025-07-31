import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { scanResume, upload } from "../controllers/resumeScan.controller";

const router = Router();

// Resume scan endpoint
router.post("/scan", verifyToken, upload.single("resume"), scanResume);

export default router;
