import { Router } from "express";
import {
  registerUser,
  verifyOTP,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  forgotPassword,
  resetPassword,
  getUser,
  editUserProfile,
  getResumeStats,
  getLinkedinStats,
  getCombinedStats,
  getUserProfile,
  getLastResumeScores,
  getLastLinkedinScores,
  getLastFiveScans,
} from "../controllers/user.controllers";
import {verifyToken} from '../middlewares/verifyToken.middleware'
import { validateInput } from "../middlewares/isValidInput.middleware";

const router = Router();

router.post('/register', validateInput ,registerUser);

router.post('/verify-otp', validateInput ,verifyOTP);

router.post('/login', loginUser);

router.post('/logout',verifyToken ,logoutUser);

router.post('/regenerate-tokens' ,refreshAccessToken);

router.post('/change-password' , verifyToken ,changePassword);

router.post('/forgot-password' ,forgotPassword);

router.post('/reset-password' , resetPassword)

// User profile routes
router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, editUserProfile);

// Stats routes
router.get("/resume-stats", verifyToken, getResumeStats);              // Resume stats only
router.get("/linkedin-stats", verifyToken, getLinkedinStats); // LinkedIn stats only
router.get("/combined-stats", verifyToken, getCombinedStats); // Both stats combined

// New routes for getting last scan scores
router.get("/last-resume-scores", verifyToken, getLastResumeScores);
router.get("/last-linkedin-scores",verifyToken, getLastLinkedinScores);
router.get("/last-five-scans", verifyToken, getLastFiveScans);

export default router