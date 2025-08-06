import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { scanResume, upload , compareResumes} from "../controllers/resumeScan.controller";

const router = Router();

// Resume scan endpoint
router.post("/scan", verifyToken, upload.single("resume"), scanResume);

router.post(
    "/compare", 
    verifyToken, 
    upload.fields([
      { name: "resume1", maxCount: 1 },
      { name: "resume2", maxCount: 1 }
    ]), 
    compareResumes
  );

export default router;
